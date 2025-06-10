import { useForm } from '../FormContext';
import { Mail, QrCode, Shield, Clock, Smartphone, Globe } from 'lucide-react';

export default function Step3DeliveryMethod() {
  const { formData, updateFormData, errors } = useForm();

  const deliveryMethods = [
    {
      id: 'magic-link' as const,
      name: 'Magic Link',
      description: 'Send a secure email with a special link',
      icon: Mail,
      features: [
        'Secure email delivery',
        'Automatic expiration (15 minutes)',
        'Perfect for remote sharing',
        'Works on any device',
      ],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'qr-code' as const,
      name: 'QR Code',
      description: 'Generate a QR code to print or share',
      icon: QrCode,
      features: [
        'Instant phone camera access',
        'Print and share physically',
        'Perfect for parties',
        'Works offline once generated',
      ],
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How should we deliver the card?
        </h2>
        <p className="text-gray-600">
          Choose the best way to share your birthday surprise
        </p>
      </div>

      {/* Delivery Method Selection */}
      <div className="space-y-4">
        {deliveryMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = formData.deliveryMethod === method.id;

          return (
            <div
              key={method.id}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              onClick={() => updateFormData({ deliveryMethod: method.id })}
            >
              <div className="flex items-start gap-4">
                {/* Method Icon */}
                <div
                  className={`
                  w-12 h-12 rounded-lg bg-gradient-to-r ${method.gradient} 
                  flex items-center justify-center flex-shrink-0
                `}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Method Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {method.name}
                    </h3>
                    {isSelected && (
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{method.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {method.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Radio button hidden but accessible */}
              <input
                type="radio"
                name="deliveryMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => updateFormData({ deliveryMethod: method.id })}
                className="sr-only"
                aria-describedby={`${method.id}-description`}
              />
            </div>
          );
        })}
      </div>

      {/* Email Input for Magic Link */}
      {formData.deliveryMethod === 'magic-link' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-medium text-purple-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Recipient's Email Address
          </h4>

          <div>
            <label
              htmlFor="recipientEmail"
              className="block text-sm font-medium text-purple-800 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="recipientEmail"
              value={formData.recipientEmail}
              onChange={(e) =>
                updateFormData({ recipientEmail: e.target.value })
              }
              placeholder="recipient@example.com"
              className={`
                w-full px-4 py-3 rounded-lg border transition-all
                ${
                  errors.recipientEmail
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-purple-200 focus:ring-purple-500 focus:border-purple-500'
                }
                outline-none bg-white
              `}
              aria-describedby={
                errors.recipientEmail ? 'recipientEmail-error' : 'email-help'
              }
            />
            {errors.recipientEmail && (
              <p
                id="recipientEmail-error"
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {errors.recipientEmail}
              </p>
            )}
            <p id="email-help" className="mt-2 text-sm text-purple-700">
              We'll send a secure link that expires in 15 minutes for privacy
            </p>
          </div>
        </div>
      )}

      {/* QR Code Information */}
      {formData.deliveryMethod === 'qr-code' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h4 className="font-medium text-indigo-900 mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Details
          </h4>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-indigo-900">Easy Scanning</p>
                  <p className="text-sm text-indigo-700">
                    Works with any phone camera or QR scanner app
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-indigo-900">Print & Share</p>
                  <p className="text-sm text-indigo-700">
                    Download, print, or share the QR code image
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-indigo-200 rounded-lg p-4">
              <p className="text-sm text-indigo-800">
                <strong>After creating the card:</strong> You'll get a
                downloadable QR code that you can print on invitations, display
                at parties, or share digitally.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Security
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Automatic Expiration</p>
              <p>Cards expire after viewing for recipient privacy</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Secure Access</p>
              <p>Each card has a unique, encrypted access link</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">🎉 Ready to Create!</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>For:</strong> {formData.recipientName || 'Recipient'}
          </p>
          <p>
            <strong>Card Title:</strong> {formData.cardTitle || 'Card title'}
          </p>
          <p>
            <strong>From:</strong> {formData.senderName || 'Your name'}
          </p>
          <p>
            <strong>Delivery:</strong>{' '}
            {formData.deliveryMethod === 'magic-link'
              ? `Magic Link${
                  formData.recipientEmail
                    ? ` to ${formData.recipientEmail}`
                    : ''
                }`
              : 'QR Code'}
          </p>
        </div>
      </div>
    </div>
  );
}
