import React from 'react';
import { Heart, Coffee, Bot } from 'lucide-react';

export function DonatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Support Sano</h1>
      
      <div className="max-w-3xl space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Support Our Mission
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your support helps us continue developing tools that make mental health documentation more efficient, allowing therapists to focus more on what matters most - their clients.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DonationTier
              icon={Coffee}
              amount="$5.00"
              title="Buy us a coffee"
              description="Help fuel our development with a coffee"
              featured
            />
            <DonationTier
              icon={Heart}
              amount="$-"
              title="Monthly supporter (GPT-4)"
              description="Support our mission with GPT-4 powered assistance"
              comingSoon={true}
            />
            <DonationTier
              icon={Bot}
              amount="$-"
              title="Monthly supporter (GPT-3.5)"
              description="Support our mission with GPT-3.5 powered assistance"
              comingSoon={true}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Where Your Support Goes
          </h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span>Developing new features and improvements</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span>Maintaining and scaling our infrastructure</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span>Supporting ongoing research and development</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function DonationTier({ 
  icon: Icon, 
  amount, 
  title, 
  description, 
  comingSoon,
  featured 
}: { 
  icon: React.ElementType;
  amount: string;
  title: string;
  description: string;
  comingSoon?: boolean;
  featured?: boolean;
}) {
  return (
    <div className={`relative flex flex-col rounded-lg border-2 p-6 transition-all hover:border-blue-500 hover:shadow-md ${
      featured 
        ? 'border-blue-500 shadow-md' 
        : 'border-gray-200 dark:border-gray-700'
    } h-full`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            Popular
          </span>
        </div>
      )}
      <div className="flex flex-col items-center text-center h-full">
        <Icon className={`w-8 h-8 mb-3 ${
          featured ? 'text-blue-500' : 'text-gray-400'
        }`} />
        <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-white flex flex-col">
          {amount}
          {comingSoon && (
            <span className="block text-sm font-normal text-gray-500 dark:text-gray-400">
              Coming Soon
            </span>
          )}
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
        <button
          type="button"
          onClick={() => {
            if (title === "Buy us a coffee") {
              window.location.href = "https://buy.stripe.com/28o5oa6BT4VVf4Y8ww";
            }
          }}
          disabled={comingSoon}
          className={`mt-auto w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            featured
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {comingSoon ? 'Coming Soon' : `Donate ${amount}`}
        </button>
      </div>
    </div>
  );
}