import { useState } from 'react';
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
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Here we'll integrate with the API in future issues
      console.log('🎉 Form submitted successfully!', formData);

      // For now, just show success message
      alert(
        'Card created successfully! 🎉\n\nThis will be replaced with actual card generation in the next phase.'
      );
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error creating your card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = true; // Always allow clicking Next - validation happens in handleNext
  const isLastStep = currentStep === totalSteps;

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
              Follow these simple steps to create a personalized birthday card
              that will bring joy and smiles.
            </p>
          </div>
        </div>

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
                </p>
              </div>

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
