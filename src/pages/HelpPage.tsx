import React from 'react';
import { Brain, Shield, Zap, Clock, FileCheck, Layout } from 'lucide-react';

export function HelpPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">How Sano Works</h1>

      <div className="max-w-4xl space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Getting Started
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sano is your clinical documentation assistant, designed to help mental health professionals create comprehensive and professional clinical notes efficiently. The intuitive interface provides quick access to all documentation tools through the central control panel.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="Smart Documentation"
              description="AI-powered assistance transforms your session notes into professional clinical documentation"
            />
            <FeatureCard
              icon={Clock}
              title="Save Time"
              description="Cut documentation time in half, spend more time with clients"
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Compliant"
              description="Built with HIPAA compliance in mind for secure documentation"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Documentation Features
          </h2>
          
          <div className="space-y-6">
            <Feature
              title="Quick Access Controls"
              items={[
                "Format: Choose your preferred documentation format",
                "Therapy: Select therapeutic approaches used in session",
                "Concerns: Document presenting problems and symptoms",
                "Observations: Record client's presentation and behavior",
                "Response: Track engagement and progress",
                "Plans: Document homework and future session focus"
              ]}
            />

            <Feature
              title="Documentation Formats"
              items={[
                "SOAP: Subjective, Objective, Assessment, Plan",
                "DAP: Data, Assessment, Plan",
                "BIRP: Behavior, Intervention, Response, Plan",
                "GIRP: Goals, Intervention, Response, Plan",
                "And more customizable formats"
              ]}
            />

            <Feature
              title="Documentation Modes"
              items={[
                "Free Form: Write notes directly with support from Quick Add options",
                "Guided Mode: Use structured questions for comprehensive documentation",
                "Selected Items: View and track all toggled items in one place"
              ]}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Best Practices
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span>Use the Quick Access panel for efficient navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span>Choose the appropriate documentation format for your needs</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span>Toggle buttons to track items for documentation</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span>Use Quick Add (+) for efficient text insertion</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span>Be specific and detailed in your responses</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow">
      <div className="absolute top-6 left-6">
        <span className="inline-flex items-center justify-center rounded-md bg-blue-600/10 p-2 mb-2">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </span>
      </div>
      <div className="mt-16 space-y-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

function Feature({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{title}</h3>
      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}