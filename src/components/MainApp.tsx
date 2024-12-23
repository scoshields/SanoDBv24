import React, { useState, useEffect } from 'react';
import { HowItWorks } from './HowItWorks';
import { NoteInput } from './NoteInput';
import { ProcessedNote } from './ProcessedNote';
import { Note, NoteFormData } from '../types';
import { processNoteWithAPI } from '../services/api';
import { buildPrompt } from '../utils/prompts/promptBuilder';
import { parseSections } from '../utils/sections';
import { getNoteFormatPrompt } from '../utils/noteFormats/prompts';
import type { NoteFormatType } from '../utils/noteFormats/types';
import { useSettings } from '../hooks/useSettings';

export function MainApp() {
  const [note, setNote] = useState<Note | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { settings } = useSettings();
  const [currentFormat, setCurrentFormat] = useState<NoteFormatType>(
    (settings?.note_format as NoteFormatType) || 'girp'
  );

  // Update currentFormat when settings load
  useEffect(() => {
    if (settings?.note_format) {
      setCurrentFormat(settings.note_format as NoteFormatType);
    }
  }, [settings?.note_format]);

  const clearNote = () => {
    setNote(null);
  };

  const processNote = async ({ 
    content, selectedTherapies, noteType, noteFormat, customInstructions, guidedResponses 
  }: NoteFormData) => {
    setCurrentFormat(noteFormat);
    const noteContent = guidedResponses ? 
      Object.entries(guidedResponses)
        .filter(([_, value]) => value.trim())
        .map(([id, value]) => value.trim())
        .join('\n\n')
      : content;

    const newNote: Note = {
      id: Date.now().toString(),
      content: noteContent,
      originalContent: noteContent,
      isProcessing: true,
      sections: []
    };
    setNote(newNote);

    try {
      const data = await processNoteWithAPI({ 
        content: noteContent,
        prompt: buildPrompt(
          selectedTherapies,
          noteType,
          noteFormat,
          customInstructions,
          guidedResponses,
          {
            content,
            selectedTherapies,
            selectedConcerns: [],
            selectedObservations: [],
            selectedResponses: [],
            selectedPlans: [],
            noteType,
            noteFormat,
            isGuided: !!guidedResponses,
            guidedResponses
          }
        ),
      });
      
      setNote(prev => prev ? {
        ...prev,
        sections: parseSections(data.processedContent, noteType === 'assessment', noteFormat),
        isProcessing: false
      } : null);
    } catch (error) {
      console.error('Processing error:', error);
      setNote(prev => prev ? {
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process note. Please try again.',
        isProcessing: false,
        sections: []
      } : null);
    }
  };

  const handleRegenerateSection = async (sectionId: string) => {
    if (!note?.originalContent) return;

    const currentSection = note.sections.find(s => s.id === sectionId);
    if (!currentSection) return;

    setNote(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sections: prev.sections.map(section => 
          section.id === sectionId 
            ? { ...section, isProcessing: true, error: undefined }
            : section
        )
      };
    });

    try {
      const section = note.sections.find(s => s.id === sectionId);
      if (!section) throw new Error('Section not found');

      const formatTemplate = getNoteFormatPrompt(currentFormat);
      
      const sectionPrompt = `
Please regenerate the following section of the clinical documentation.
The documentation uses the ${currentFormat.toUpperCase()} format with these exact section headers:

${formatTemplate}

Regenerate ONLY the content for this section:
${section.heading}

Return ONLY the content without the section header. Maintain professional clinical language and ensure 5-10 complete sentences.`;

      const data = await processNoteWithAPI({
        content: note.originalContent,
        prompt: sectionPrompt,
        removeHeader: true
      });

      setNote(prev => {
        if (!prev) return null;
        const section = prev.sections.find(s => s.id === sectionId);
        if (!section) return prev;

        const newVersion = {
          id: section.versions.length > 0 ? Math.max(...section.versions.map(v => v.id)) + 1 : 0,
          content: data.processedContent.trim(),
          timestamp: Date.now()
        };

        return {
          ...prev,
          sections: prev.sections.map(section => 
            section.id === sectionId 
              ? { 
                  ...section, 
                  versions: section.versions.concat(newVersion),
                  currentVersion: newVersion.id,
                  isProcessing: false,
                  error: undefined
                }
              : section
          )
        };
      });
    } catch (error) {
      console.error('Section regeneration error:', error);
      setNote(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sections: prev.sections.map(section => 
            section.id === sectionId 
              ? { 
                  ...section, 
                  error: error instanceof Error ? error.message : 'Failed to regenerate section',
                  isProcessing: false
                }
              : section
          )
        };
      });
    }
  };

  const handleVersionChange = (sectionId: string, versionId: number) => {
    setNote(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? { ...section, currentVersion: versionId }
            : section
        )
      };
    });
  };

  return (
    <div className="space-y-8">
      <NoteInput 
        onSubmit={processNote}
        onClear={clearNote}
        defaultFormat={currentFormat}
        isProcessing={note?.isProcessing || false}
      />
      {note && (
        <ProcessedNote 
          note={note} 
          onRegenerateSection={handleRegenerateSection} 
          onVersionChange={handleVersionChange}
        />
      )}
      <HowItWorks isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </div>
  );
}