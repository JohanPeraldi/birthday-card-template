import { useForm } from '../FormContext';
import { User, Calendar, Type } from 'lucide-react';

export default function Step1RecipientInfo() {
  const { formData, updateFormData, errors } = useForm();

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Who's celebrating?
        </h2>
        <p className="text-gray-600">
          Let's start with some basic information about the birthday person
        </p>
      </div>

      <div className="space-y-6">
        {/* Recipient Name */}
        <div>
          <label
            htmlFor="recipientName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Recipient's Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="recipientName"
              value={formData.recipientName}
              onChange={(e) =>
                handleInputChange('recipientName', e.target.value)
              }
              placeholder="e.g., Sarah Johnson"
              className={`
                w-full pl-12 pr-4 py-3 rounded-lg border transition-all
                ${
                  errors.recipientName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                }
                outline-none
              `}
              aria-describedby={
                errors.recipientName ? 'recipientName-error' : undefined
              }
            />
          </div>
          {errors.recipientName && (
            <p
              id="recipientName-error"
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {errors.recipientName}
            </p>
          )}
        </div>

        {/* Card Title */}
        <div>
          <label
            htmlFor="cardTitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Card Title *
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="cardTitle"
              value={formData.cardTitle}
              onChange={(e) => handleInputChange('cardTitle', e.target.value)}
              placeholder="e.g., Happy 25th Birthday!"
              className={`
                w-full pl-12 pr-4 py-3 rounded-lg border transition-all
                ${
                  errors.cardTitle
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                }
                outline-none
              `}
              aria-describedby={
                errors.cardTitle ? 'cardTitle-error' : undefined
              }
            />
          </div>
          {errors.cardTitle && (
            <p
              id="cardTitle-error"
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {errors.cardTitle}
            </p>
          )}
        </div>

        {/* Recipient Age (Optional) */}
        <div>
          <label
            htmlFor="recipientAge"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Age (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              id="recipientAge"
              value={formData.recipientAge}
              onChange={(e) =>
                handleInputChange('recipientAge', e.target.value)
              }
              placeholder="25"
              min="1"
              max="150"
              className={`
                w-full pl-12 pr-4 py-3 rounded-lg border transition-all
                ${
                  errors.recipientAge
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                }
                outline-none
              `}
              aria-describedby={
                errors.recipientAge ? 'recipientAge-error' : undefined
              }
            />
          </div>
          {errors.recipientAge && (
            <p
              id="recipientAge-error"
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {errors.recipientAge}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Adding an age helps personalize the celebration
          </p>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-2">
          💡 Tips for great cards
        </h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Use the recipient's preferred name or nickname</li>
          <li>
            • Include milestone ages (18, 21, 30, 50, etc.) for extra
            celebration
          </li>
          <li>• Keep titles warm and personal</li>
        </ul>
      </div>
    </div>
  );
}
