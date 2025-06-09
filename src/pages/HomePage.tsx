import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Gift,
  Mail,
  QrCode,
  Sparkles,
  Heart,
  Shield,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="font-['Dancing_Script'] text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Create Beautiful
              <span className="block text-purple-600">Birthday Cards</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Design personalized birthday cards with custom messages, images,
              and secure delivery options. No technical knowledge required –
              just pure celebration magic.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/create"
              className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl text-lg"
            >
              <Gift className="w-5 h-5" />
              Create Your Card
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button className="inline-flex items-center gap-2 text-purple-600 px-6 py-4 rounded-xl font-medium hover:bg-purple-50 transition-colors">
              <Sparkles className="w-4 h-4" />
              See Examples
            </button>
          </div>

          {/* Preview Card */}
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Gift className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Your custom card</p>
                </div>
              </div>
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 text-center">
                Happy Birthday!
              </h3>
              <p className="text-sm text-gray-600 text-center mt-2">
                Personalized just for you ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Birthday Cards?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create and deliver the perfect birthday
              surprise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Personalized Design
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Add custom messages, photos, and choose from beautiful themes to
                make each card unique and special.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure Delivery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Choose between magic links or QR codes for secure, private
                access. Links expire automatically for privacy.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Magic
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create and send beautiful cards in minutes. No downloads, no
                complicated setup – just pure birthday joy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Two Ways to Share the Joy
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Magic Links
              </h3>
              <p className="text-gray-600 mb-4">
                Send a secure email with a special link. Perfect for remote
                celebrations and ensuring the surprise stays secret.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Secure email delivery</li>
                <li>• Automatic expiration</li>
                <li>• Perfect for remote sharing</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                QR Codes
              </h3>
              <p className="text-gray-600 mb-4">
                Generate a QR code to print, share, or display. Great for
                parties, gift cards, and in-person surprises.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Instant phone camera access</li>
                <li>• Print and share physically</li>
                <li>• Perfect for parties</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Something Special?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of people spreading birthday joy with personalized,
            secure cards.
          </p>

          <Link
            to="/create"
            className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg text-lg"
          >
            <Gift className="w-5 h-5" />
            Start Creating Now
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-sm text-gray-400 mt-4">
            Free to use • No signup required • Instant results
          </p>
        </div>
      </section>
    </div>
  );
}
