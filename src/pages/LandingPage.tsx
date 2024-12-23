import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Brain, Shield, Zap, Clock, FileCheck, Layout, Sparkles } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header isSidebarOpen={false} onSidebarToggle={() => {}} />
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Clinical Documentation
              <span className="block text-blue-600 dark:text-blue-400">Made Simple</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Transform your therapeutic note-taking process with AI assistance. Create comprehensive, professional clinical documentation in minutes while maintaining the highest standards of care.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/auth"
                className="rounded-md bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-800 transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Streamline Your Clinical Documentation
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Sano helps mental health professionals create comprehensive, professional documentation in minutes
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Zap}
              title="Smart Documentation"
              description="AI-powered assistance transforms your session notes into professional clinical documentation while maintaining your therapeutic voice."
            />
            <Feature
              icon={Clock}
              title="Save Time"
              description="Cut documentation time in half. Spend more time with clients and less time on paperwork."
            />
            <Feature
              icon={Brain}
              title="Flexible Formats"
              description="Choose from SOAP, DAP, BIRP, GIRP, and more. Easily switch between formats while maintaining consistency."
            />
            <Feature
              icon={Shield}
              title="Secure & Compliant"
              description="Built with HIPAA compliance in mind. Your clinical documentation remains secure and meets regulatory standards."
            />
            <Feature
              icon={Layout}
              title="Guided Workflow"
              description="Follow structured templates and guided questions for thorough, consistent documentation every time."
            />
            <Feature
              icon={Sparkles}
              title="Customizable"
              description="Tailor the platform to your practice with custom templates, therapeutic approaches, and documentation preferences."
            />
          </div>
        </div>
      </div>
      
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Simple, Efficient Documentation
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Create professional clinical documentation in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900 dark:text-blue-400">
                1
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Write Your Notes</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Use free-form writing or follow our guided template system
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900 dark:text-blue-400">
                2
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Smart Processing</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Advanced AI transforms your notes into polished clinical documentation
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900 dark:text-blue-400">
                3
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Review & Edit</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Fine-tune your documentation with section-by-section editing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="relative p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
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