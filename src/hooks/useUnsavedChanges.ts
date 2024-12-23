import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  // Handle browser back/forward buttons and tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle navigation within the app
  const handleNavigate = useCallback((to: string) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        setHasUnsavedChanges(false);
        navigate(to);
      }
    } else {
      navigate(to);
    }
  }, [hasUnsavedChanges, navigate]);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleNavigate
  };
}