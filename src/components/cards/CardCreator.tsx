import { useState } from 'react';
<<<<<<< HEAD
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { FormProvider, useForm } from './FormContext';
import ProgressIndicator from './ProgressIndicator';
import Step1RecipientInfo from './steps/Step1RecipientInfo';
import Step2MessageDesign from './steps/Step2MessageDesign';
import Step3DeliveryMethod from './steps/Step3DeliveryMethod';

// Step components mapping
const stepComponents = {
  1: Step1RecipientInfo,
  2: Step2MessageDesign,
  3: Step3DeliveryMethod,
};

function CardCreatorContent() {
  const { currentStep, setCurrentStep, validateStep, formData } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;
  const CurrentStepComponent =
    stepComponents[currentStep as keyof typeof stepComponents];

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
=======
import { ArrowLeft, Upload, X, Eye, Send, Mail, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormData {
  cardTitle: string;
  recipientName: string;
  message: string;
  senderName: string;
  theme: 'purple' | 'yellow';
  customImage?: File;
  customImagePreview?: string;
  deliveryMethod: 'email' | 'qr';
  recipientEmail: string;
}

const themes = {
  purple: {
    name: 'Classic Purple',
    gradient: 'from-purple-500 to-indigo-600',
    colors: ['bg-purple-500', 'bg-indigo-500'],
  },
  yellow: {
    name: 'Sunny Yellow',
    gradient: 'from-yellow-500 to-amber-600',
    colors: ['bg-yellow-500', 'bg-amber-500'],
  },
};

export default function SimpleCardCreator() {
  const [formData, setFormData] = useState<FormData>({
    cardTitle: '',
    recipientName: '',
    message: '',
    senderName: '',
    theme: 'purple',
    deliveryMethod: 'email',
    recipientEmail: '',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please upload a valid image file',
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setErrors((prev) => ({ ...prev, image: 'Image must be less than 10MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      updateField('customImage', file);
      updateField('customImagePreview', e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const removeImage = () => {
    updateField('customImage', undefined);
    updateField('customImagePreview', undefined);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardTitle.trim()) {
      newErrors.cardTitle = 'Card title is required';
    } else if (formData.cardTitle.length > 50) {
      newErrors.cardTitle = 'Card title must be 50 characters or less';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    } else if (formData.recipientName.length > 30) {
      newErrors.recipientName = 'Recipient name must be 30 characters or less';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 300) {
      newErrors.message = 'Message must be 300 characters or less';
    }

    if (!formData.senderName.trim()) {
      newErrors.senderName = 'Your name is required';
    } else if (formData.senderName.length > 30) {
      newErrors.senderName = 'Your name must be 30 characters or less';
    }

    // Image is now optional - users can choose

    if (formData.deliveryMethod === 'email') {
      if (!formData.recipientEmail.trim()) {
        newErrors.recipientEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
        newErrors.recipientEmail = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
>>>>>>> feature/simple-card-creator
    }
  };

  const handleSubmit = async () => {
<<<<<<< HEAD
    setIsSubmitting(true);

    try {
      // Here we'll integrate with the API in future issues
      console.log('🎉 Form submitted successfully!', formData);

      // For now, just show success message
      alert(
        'Card created successfully! 🎉\n\nThis will be replaced with actual card generation in the next phase.'
=======
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Here we'll integrate with the API in future issues
      console.log('🎉 Creating card with data:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        'Card created successfully! 🎉\n\nThis will be replaced with actual card generation.'
>>>>>>> feature/simple-card-creator
      );
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error creating your card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

<<<<<<< HEAD
  const canProceed = true; // Always allow clicking Next - validation happens in handleNext
  const isLastStep = currentStep === totalSteps;
=======
  if (showPreview) {
    return (
      <CardPreview
        formData={formData}
        onBack={() => setShowPreview(false)}
        onSend={handleSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  const selectedTheme = themes[formData.theme];
>>>>>>> feature/simple-card-creator

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
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
<<<<<<< HEAD
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Follow these simple steps to create a personalized birthday card
              that will bring joy and smiles.
=======
            <p className="text-gray-600 max-w-xl mx-auto">
              Fill in the details below to create a personalized birthday card
>>>>>>> feature/simple-card-creator
            </p>
          </div>
        </div>

<<<<<<< HEAD
        {/* Progress Indicator */}
        <ProgressIndicator />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <CurrentStepComponent />
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Card Preview
                </h3>
                <p className="text-sm text-gray-600">
                  Live preview coming in Issue #7
=======
        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Card Title */}
            <div>
              <label
                htmlFor="cardTitle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Card Title *
              </label>
              <input
                type="text"
                id="cardTitle"
                value={formData.cardTitle}
                onChange={(e) => updateField('cardTitle', e.target.value)}
                placeholder="Happy 25th Birthday!"
                maxLength={50}
                className={`w-full px-4 py-3 rounded-lg border transition-all ${
                  errors.cardTitle
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                } outline-none`}
              />
              {errors.cardTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.cardTitle}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.cardTitle.length}/50 characters
              </p>
            </div>

            {/* Recipient Name */}
            <div>
              <label
                htmlFor="recipientName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                To *
              </label>
              <input
                type="text"
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => updateField('recipientName', e.target.value)}
                placeholder="Sarah"
                maxLength={30}
                className={`w-full px-4 py-3 rounded-lg border transition-all ${
                  errors.recipientName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                } outline-none`}
              />
              {errors.recipientName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.recipientName}
>>>>>>> feature/simple-card-creator
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.recipientName.length}/30 characters
              </p>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Hope your special day is absolutely amazing! 🎂

Wishing you all the happiness in the world ✨"
                rows={6}
                maxLength={300}
                className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                  errors.message
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                } outline-none`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.message.length}/300 characters
              </p>
            </div>

            {/* Sender Name */}
            <div>
              <label
                htmlFor="senderName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                From *
              </label>
              <input
                type="text"
                id="senderName"
                value={formData.senderName}
                onChange={(e) => updateField('senderName', e.target.value)}
                placeholder="Mom"
                maxLength={30}
                className={`w-full px-4 py-3 rounded-lg border transition-all ${
                  errors.senderName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                } outline-none`}
              />
              {errors.senderName && (
                <p className="mt-1 text-sm text-red-600">{errors.senderName}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.senderName.length}/30 characters
              </p>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateField('theme', key)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.theme === key
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-2 mb-2">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-full ${color}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {theme.name}
                    </p>
                  </button>
                ))}
              </div>

<<<<<<< HEAD
              {/* Simple Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>

                  <h4 className="font-['Dancing_Script'] text-xl font-bold text-gray-700 mb-2">
                    {formData.cardTitle || 'Happy Birthday!'}
                  </h4>

                  <p className="text-sm text-gray-600 mb-2">
                    For: {formData.recipientName || 'Recipient Name'}
                  </p>

                  {formData.message[0] && (
                    <p className="text-xs text-gray-500 mb-2">
                      "{formData.message[0].substring(0, 30)}
                      {formData.message[0].length > 30 ? '...' : ''}"
                    </p>
                  )}

                  {formData.senderName && (
                    <p className="text-xs text-gray-500">
                      — {formData.senderName}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">
                    {Math.round((currentStep / totalSteps) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium capitalize">
                    {formData.deliveryMethod.replace('-', ' ')}
                  </span>
                </div>
                {formData.theme && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-medium capitalize">
                      {formData.theme.replace('-', ' ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Next Steps Preview */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">
                  🚀 Coming in Issue #7
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Real-time card preview</li>
                  <li>• Theme visualization</li>
                  <li>• Animation previews</li>
                  <li>• Image positioning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            ) : (
              <div></div>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : isLastStep ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Create Card
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Development Info */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">
              ✅ Issue #3 Complete - Multi-Step Form Wizard
            </h3>
            <p className="text-green-100 mb-4">
              Form state management, validation, and step navigation are working
              perfectly!
            </p>
            <div className="text-sm text-green-200">
              <p>
                <strong>Next up:</strong> Issues #4-6 will enhance each step
                with more features
              </p>
              <p>
                <strong>Issue #7:</strong> Real-time preview integration
              </p>
              <p>
                <strong>Issues #9+:</strong> Backend API integration for card
                generation
              </p>
            </div>
=======
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Image
              </label>

              {formData.customImagePreview ? (
                <div className="relative">
                  <img
                    src={formData.customImagePreview}
                    alt="Custom upload preview"
                    className="w-full max-w-sm mx-auto rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drop an image here, or{' '}
                    <label className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium">
                      browse to upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    JPEG, PNG, GIF up to 10MB
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700 font-medium">
                      💡 Tip: Landscape images (wider than tall) work best for
                      birthday cards!
                    </p>
                  </div>
                </div>
              )}
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Send via
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateField('deliveryMethod', 'email')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.deliveryMethod === 'email'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Mail className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">Secure link via email</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('deliveryMethod', 'qr')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.deliveryMethod === 'qr'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-medium text-gray-900">QR Code</p>
                  <p className="text-sm text-gray-600">
                    Generate QR to print/share
                  </p>
                </button>
              </div>
            </div>

            {/* Email Input (conditional) */}
            {formData.deliveryMethod === 'email' && (
              <div>
                <label
                  htmlFor="recipientEmail"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Recipient's Email *
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={(e) =>
                    updateField('recipientEmail', e.target.value)
                  }
                  placeholder="sarah@example.com"
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    errors.recipientEmail
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                  } outline-none`}
                />
                {errors.recipientEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.recipientEmail}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePreview}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
            >
              <Eye className="w-5 h-5" />
              Preview Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Card Preview Component
function CardPreview({
  formData,
  onBack,
  onSend,
  isSubmitting,
}: {
  formData: FormData;
  onBack: () => void;
  onSend: () => void;
  isSubmitting: boolean;
}) {
  const selectedTheme = themes[formData.theme];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Preview Your Card
          </h1>
          <p className="text-gray-600">
            This is exactly how {formData.recipientName} will see it
          </p>
        </div>

        {/* Full Size Card Preview */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative w-full aspect-[1/1.5] [perspective:1000px]">
            <div className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  formData.theme === 'yellow'
                    ? 'from-yellow-50 via-amber-50 to-orange-50'
                    : 'from-purple-50 via-indigo-50 to-blue-50'
                }`}
              >
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm">
                  <div className="h-full flex flex-col p-6 gap-6">
                    {/* Custom Image or Default Placeholder */}
                    <div className="h-1/2 flex items-center justify-center">
                      {formData.customImagePreview ? (
                        <img
                          src={formData.customImagePreview}
                          alt="Birthday celebration"
                          className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${selectedTheme.gradient
                            .replace('500', '100')
                            .replace(
                              '600',
                              '100'
                            )} rounded-lg border-2 border-dashed border-gray-300`}
                        >
                          <div className="text-center">
                            <div className="text-6xl mb-2">🎂</div>
                            <p className="text-gray-600 font-medium">
                              Happy Birthday!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Text Content - Equal space, properly sized */}
                    <div className="h-1/2 flex flex-col justify-center text-center">
                      {/* Card Title */}
                      <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-0.5">
                        {formData.cardTitle}
                      </h2>

                      {/* Message - Readable size */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                          {formData.message.split('\n').map((line, index) => (
                            <p
                              key={index}
                              className="text-gray-700 text-sm leading-relaxed"
                            >
                              {line}
                            </p>
                          ))}

                          {/* Sender - Left aligned */}
                          <p className="text-gray-700 font-medium text-sm mt-4 text-left ml-8">
                            — {formData.senderName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            ← Edit Card
          </button>

          <button
            type="button"
            onClick={onSend}
            disabled={isSubmitting}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Card...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Card
              </>
            )}
          </button>
        </div>

        {/* Delivery Info */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">
              Delivery Method
            </h3>
            {formData.deliveryMethod === 'email' ? (
              <p className="text-gray-600">
                Magic link will be sent to{' '}
                <strong>{formData.recipientEmail}</strong>
              </p>
            ) : (
              <p className="text-gray-600">
                QR code will be generated for printing or sharing
              </p>
            )}
>>>>>>> feature/simple-card-creator
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardCreator() {
  return (
    <FormProvider>
      <CardCreatorContent />
    </FormProvider>
  );
}
