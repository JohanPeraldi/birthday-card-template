import { useState } from 'react';
import { useForm } from '../FormContext';
import { MessageSquare, User, Palette, Upload, X, Plus } from 'lucide-react';

const themes = [
  {
    id: 'classic-purple',
    name: 'Classic Purple',
    colors: ['bg-purple-500', 'bg-purple-400'],
  },
  {
    id: 'warm-pink',
    name: 'Warm Pink',
    colors: ['bg-pink-500', 'bg-rose-400'],
  },
  {
    id: 'sunny-yellow',
    name: 'Sunny Yellow',
    colors: ['bg-yellow-500', 'bg-amber-400'],
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    colors: ['bg-blue-500', 'bg-cyan-400'],
  },
  {
    id: 'nature-green',
    name: 'Nature Green',
    colors: ['bg-green-500', 'bg-emerald-400'],
  },
  {
    id: 'elegant-indigo',
    name: 'Elegant Indigo',
    colors: ['bg-indigo-500', 'bg-violet-400'],
  },
];

export default function Step2MessageDesign() {
  const { formData, updateFormData, errors } = useForm();
  const [dragActive, setDragActive] = useState(false);

  const handleMessageChange = (index: number, value: string) => {
    const newMessages = [...formData.message];
    newMessages[index] = value;
    updateFormData({ message: newMessages });
  };

  const addMessageLine = () => {
    if (formData.message.length < 5) {
      updateFormData({ message: [...formData.message, ''] });
    }
  };

  const removeMessageLine = (index: number) => {
    if (formData.message.length > 1) {
      const newMessages = formData.message.filter((_, i) => i !== index);
      updateFormData({ message: newMessages });
    }
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData({
          customImage: file,
          customImagePreview: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeImage = () => {
    updateFormData({ customImage: undefined, customImagePreview: undefined });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Customize your card
        </h2>
        <p className="text-gray-600">
          Add your personal message and choose a theme that fits the celebration
        </p>
      </div>

      {/* Your Name */}
      <div>
        <label
          htmlFor="senderName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            id="senderName"
            value={formData.senderName}
            onChange={(e) => updateFormData({ senderName: e.target.value })}
            placeholder="e.g., Mom, The Johnson Family, Alex"
            className={`
              w-full pl-12 pr-4 py-3 rounded-lg border transition-all
              ${
                errors.senderName
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
              }
              outline-none
            `}
            aria-describedby={
              errors.senderName ? 'senderName-error' : undefined
            }
          />
        </div>
        {errors.senderName && (
          <p
            id="senderName-error"
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {errors.senderName}
          </p>
        )}
      </div>

      {/* Message Lines */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Birthday Message *
        </label>
        <div className="space-y-3">
          {formData.message.map((line, index) => (
            <div key={index} className="relative">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={line}
                  onChange={(e) => handleMessageChange(index, e.target.value)}
                  placeholder={
                    index === 0
                      ? 'Your main birthday message...'
                      : 'Additional message line...'
                  }
                  rows={2}
                  className={`
                    w-full pl-12 pr-12 py-3 rounded-lg border transition-all resize-none
                    ${
                      errors.message
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                    }
                    outline-none
                  `}
                />
                {formData.message.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMessageLine(index)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove this message line"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {errors.message && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}

        {formData.message.length < 5 && (
          <button
            type="button"
            onClick={addMessageLine}
            className="mt-3 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add another line
          </button>
        )}

        <p className="mt-2 text-sm text-gray-500">
          Each line will appear separately on the card. Add emojis for extra
          personality! 🎉
        </p>
      </div>

      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <Palette className="inline w-4 h-4 mr-2" />
          Choose a Theme
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => updateFormData({ theme: theme.id })}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${
                  formData.theme === theme.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex gap-2 mb-2">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full ${color}`}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-900">{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Image (Optional)
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
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${
                dragActive
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }
            `}
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
            <p className="text-sm text-gray-500">
              Supports JPEG, PNG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Preview Message */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h4 className="font-medium text-purple-900 mb-3">✨ Message Preview</h4>
        <div className="space-y-2">
          {formData.message.map((line, index) => (
            <p key={index} className="text-purple-800">
              {line || (
                <span className="text-purple-400 italic">
                  Message line {index + 1}...
                </span>
              )}
            </p>
          ))}
          {formData.senderName && (
            <p className="text-purple-700 font-medium mt-4">
              — {formData.senderName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
