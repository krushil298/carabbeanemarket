import React from 'react';
import { Check, Star, Zap } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonColor: string;
}

const SubscriptionPlans: React.FC = () => {
  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free Viewer',
      price: 0,
      period: 'forever',
      description: 'Browse and contact sellers',
      features: [
        'Browse all listings',
        'Contact sellers',
        'Save favorites',
        'Basic search filters'
      ],
      buttonText: 'Current Plan',
      buttonColor: 'bg-gray-400'
    },
    {
      id: 'standard',
      name: 'Standard Seller',
      price: 9.99,
      period: 'month',
      description: 'Perfect for casual sellers',
      features: [
        'Post up to 10 listings',
        'Basic listing features',
        'Email support',
        'Listing analytics',
        'Photo uploads (5 per listing)'
      ],
      popular: true,
      buttonText: 'Start Selling',
      buttonColor: 'bg-teal-600 hover:bg-teal-700'
    },
    {
      id: 'pro',
      name: 'Pro Seller',
      price: 24.99,
      period: 'month',
      description: 'For serious sellers and businesses',
      features: [
        'Unlimited listings',
        'Premium listing features',
        'Priority support',
        'Advanced analytics',
        'Photo & video uploads (10 per listing)',
        'Featured listing placement',
        'Store profile page',
        'Bulk listing tools'
      ],
      buttonText: 'Go Pro',
      buttonColor: 'bg-coral-600 hover:bg-coral-700'
    }
  ];

  return (
    <div className="py-16 caribbean-sunset dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start for free or upgrade to unlock powerful selling features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-teal-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-teal-500 text-white text-center py-2 px-4">
                  <div className="flex items-center justify-center">
                    <Star size={16} className="mr-1" />
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check size={16} className="text-teal-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${plan.buttonColor}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include secure payments and fraud protection
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>✓ 30-day money back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;