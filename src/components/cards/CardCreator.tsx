import { ArrowLeft, Gift, User, MessageSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CardCreator() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Create Your Birthday Card
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Design a personalized birthday card with custom messages, images,
              and delivery options. We'll guide you through each step.
            </p>
          </div>
        </div>

        {/* Progress Steps Preview */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 lg:space-x-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Recipient</p>
                <p className="text-sm text-gray-500">Basic info</p>
              </div>
            </div>

            <div className="w-8 h-px bg-gray-300"></div>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="text-sm font-medium text-gray-500">Customize</p>
                <p className="text-sm text-gray-400">Message & design</p>
              </div>
            </div>

            <div className="w-8 h-px bg-gray-300"></div>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="text-sm font-medium text-gray-500">Delivery</p>
                <p className="text-sm text-gray-400">Send options</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-purple-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Multi-step Form Coming Soon
              </h2>

              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We're building the intuitive form interface that will let you
                create cards in just a few simple steps.
              </p>

              {/* Feature Preview */}
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Step 1: Recipient Info
                    </p>
                    <p className="text-sm text-gray-600">
                      Name, age, and card title
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Step 2: Customize
                    </p>
                    <p className="text-sm text-gray-600">
                      Message, theme, and images
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Send className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Step 3: Delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      Magic links or QR codes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Live Preview
              </h3>
              <p className="text-sm text-gray-600">
                See your card update in real-time as you design it
              </p>
            </div>

            {/* Card Preview Placeholder */}
            <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-['Dancing_Script'] text-2xl font-bold text-gray-700 mb-2">
                  Happy Birthday!
                </h4>
                <p className="text-gray-600 text-sm">
                  Your custom card will appear here
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                🚀 Coming Next
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Real-time preview updates</li>
                <li>• Theme and color selection</li>
                <li>• Image upload and positioning</li>
                <li>• Animation previews</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Want to Use the Current System?
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              While we're building the new interface, you can still create cards
              using our existing template system.
            </p>
            <a
              href="https://github.com/JohanPeraldi/birthday-card-template"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Template System
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
