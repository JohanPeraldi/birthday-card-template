import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MessageCircle,
  Image,
  Sparkles,
  Gift,
  ArrowRight,
  Upload,
  Mail,
  QrCode,
  CheckCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';

export default function BirthdayCardCreator() {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientAge: '',
    cardTitle: '',
    message: '',
    senderName: '',
    selectedTheme: 'magical',
    image: null,
    deliveryMethod: 'magic-link',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const [recipientEmail, setRecipientEmail] = useState('');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  const themes = [
    {
      id: 'magical',
      name: 'Magical',
      colors: 'from-purple-500 to-pink-500',
      description: 'Sparkles and wonder',
    },
    {
      id: 'elegant',
      name: 'Elegant',
      colors: 'from-blue-500 to-indigo-600',
      description: 'Classic and sophisticated',
    },
    {
      id: 'joyful',
      name: 'Joyful',
      colors: 'from-yellow-400 to-orange-500',
      description: 'Bright and cheerful',
    },
    {
      id: 'nature',
      name: 'Nature',
      colors: 'from-green-400 to-emerald-500',
      description: 'Fresh and peaceful',
    },
  ];

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateField('image', e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fixed drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Store card data in localStorage with unique ID
  const storeCardData = (cardId: string, cardData: any) => {
    try {
      localStorage.setItem(`card_${cardId}`, JSON.stringify(cardData));
      console.log('💾 Card data stored in localStorage with ID:', cardId);
      return true;
    } catch (error) {
      console.error('❌ Failed to store card data:', error);
      return false;
    }
  };

  const generateCard = async () => {
    setIsGenerating(true);

    try {
      // Generate a shorter, cleaner card ID
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const cleanName = formData.recipientName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 8);
      const cardId = `${cleanName}${randomSuffix}`;

      // Prepare card data
      const cardData = {
        id: cardId,
        recipientName: formData.recipientName,
        recipientAge: formData.recipientAge,
        cardTitle:
          formData.cardTitle ||
          `Happy ${
            formData.recipientAge ? `${formData.recipientAge}th ` : ''
          }Birthday!`,
        message: formData.message,
        senderName: formData.senderName || 'Someone special',
        selectedTheme: formData.selectedTheme,
        image: formData.image || '/happy-birthday.jpeg',
        deliveryMethod: formData.deliveryMethod,
        recipientEmail:
          formData.deliveryMethod === 'magic-link' ? recipientEmail : undefined,
        createdAt: new Date().toISOString(),
      };

      console.log('🎂 Creating birthday card...', {
        cardId,
        deliveryMethod: cardData.deliveryMethod,
      });

      // Store card data in localStorage (for development)
      const stored = storeCardData(cardId, cardData);
      if (!stored) {
        throw new Error('Failed to store card data');
      }

      // Check if we're in development mode
      const isDevelopment =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isDevelopment) {
        // Mock API response for development
        console.log('🔧 Development mode: Mocking API response');

        // Create clean card URL - no parameters in URL
        const baseUrl = window.location.origin;
        const cardUrl = `${baseUrl}/card/${cardId}`;

        // Generate QR code for QR delivery method
        let qrCodeData = null;
        if (cardData.deliveryMethod === 'qr-code') {
          const qrTimestamp = Date.now();
          const qrToken = btoa(`${cardId}:${qrTimestamp}`);
          const qrUrl = `${cardUrl}?qr=${qrToken}`;

          console.log('📱 QR Code URL (shorter):', qrUrl);

          qrCodeData = {
            url: qrUrl,
            token: qrToken,
            imageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              qrUrl
            )}&bgcolor=ffffff&color=000000&margin=20&format=png`,
          };
        }

        // Generate magic link for magic-link delivery method
        let magicLinkData = null;
        if (cardData.deliveryMethod === 'magic-link') {
          const magicTimestamp = Date.now();
          const magicToken = btoa(
            `${cardId}:${magicTimestamp}:${recipientEmail}`
          );
          magicLinkData = `${cardUrl}?token=${magicToken}`;
          console.log('🔗 Magic Link (shorter):', magicLinkData);
        }

        // Mock successful response
        const mockResult = {
          success: true,
          cardId: cardId,
          cardUrl: cardUrl,
          message:
            cardData.deliveryMethod === 'magic-link'
              ? 'Magic link ready!'
              : 'QR code generated successfully!',
          ...(cardData.deliveryMethod === 'magic-link' && {
            emailSent: true,
            magicLink: magicLinkData,
          }),
          ...(cardData.deliveryMethod === 'qr-code' && {
            qrCode: qrCodeData,
          }),
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setGeneratedCard(mockResult);
        console.log('✅ Development card created successfully!', mockResult);
      } else {
        // Production mode: Call real API
        const response = await fetch('/api/create-card', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cardData),
        });

        const result = await response.json();

        if (result.success) {
          setGeneratedCard(result);
          console.log('✅ Card created successfully!', result);
        } else {
          alert(`❌ Error: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('❌ Error creating card:', error);
      alert('Failed to create birthday card. Please try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  const createNewCard = () => {
    setGeneratedCard(null);
    setCurrentStep(1);
    setFormData({
      recipientName: '',
      recipientAge: '',
      cardTitle: '',
      message: '',
      senderName: '',
      selectedTheme: 'magical',
      image: null,
      deliveryMethod: 'magic-link',
    });
    setRecipientEmail('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Copied to clipboard!');
      });
  };

  // Show success screen after card creation
  if (generatedCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="text-green-500 mr-3" size={48} />
              <h1 className="text-3xl font-bold text-gray-800">
                Birthday Card Created! 🎉
              </h1>
            </div>

            {formData.deliveryMethod === 'magic-link' ? (
              <div className="mb-8 text-center">
                <p className="text-gray-600 text-lg mb-4">
                  ✨ Magic link ready for <strong>{recipientEmail}</strong>!
                </p>
                <p className="text-gray-500 mb-4">
                  In production, this would be sent via email. For development,
                  use the link below:
                </p>

                {generatedCard.magicLink && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-700 mb-2">
                      🔗 Development Magic Link:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-blue-800 bg-blue-100 p-2 rounded flex-1 break-all max-h-20 overflow-y-auto">
                        {generatedCard.magicLink}
                      </code>
                      <button
                        onClick={() => copyToClipboard(generatedCard.magicLink)}
                        className="text-blue-600 hover:text-blue-800 p-1 flex-shrink-0"
                        title="Copy magic link"
                      >
                        <Copy size={16} />
                      </button>
                      <a
                        href={generatedCard.magicLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1 flex-shrink-0"
                        title="Open magic link"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-8 text-center">
                <p className="text-gray-600 text-lg mb-4">
                  📱 QR code generated successfully!
                </p>

                {generatedCard.qrCode && (
                  <div className="bg-gray-50 p-6 rounded-lg inline-block mb-4">
                    <img
                      src={generatedCard.qrCode.imageUrl}
                      alt="Birthday Card QR Code"
                      className="w-48 h-48 mx-auto rounded-lg shadow-md"
                      onError={(e) => {
                        console.error('QR Code image failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <p className="text-gray-500 mb-4">
                  Save this QR code to share via messaging apps, email, or print
                  it!
                </p>

                {generatedCard.qrCode && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-700 mb-2">
                      🔗 QR Code URL:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-blue-800 bg-blue-100 p-2 rounded flex-1 break-all max-h-20 overflow-y-auto">
                        {generatedCard.qrCode.url}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedCard.qrCode.url)
                        }
                        className="text-blue-600 hover:text-blue-800 p-1 flex-shrink-0"
                        title="Copy QR URL"
                      >
                        <Copy size={16} />
                      </button>
                      <a
                        href={generatedCard.qrCode.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1 flex-shrink-0"
                        title="Open QR URL"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-2">Direct Card URL:</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-gray-700 bg-gray-200 p-2 rounded flex-1 break-all">
                  {generatedCard.cardUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(generatedCard.cardUrl)}
                  className="text-gray-600 hover:text-gray-800 p-1 flex-shrink-0"
                  title="Copy URL"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={generatedCard.cardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 p-1 flex-shrink-0"
                  title="Open card"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">
                📝 Development Note
              </h3>
              <p className="text-sm text-yellow-700">
                Card data is stored in localStorage with ID:{' '}
                <code className="bg-yellow-200 px-1 rounded">
                  {generatedCard.cardId}
                </code>
                <br />
                URLs are now much shorter and should work properly!
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <a
                href={generatedCard.cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              >
                🎂 Preview Card
              </a>
              <button
                onClick={createNewCard}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-200"
              >
                Create Another Card
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Create a Magical Birthday Card
          </h1>
          <p className="text-gray-600 text-lg">
            Design a personalized birthday surprise that will make someone's day
            unforgettable
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110'
                      : 'bg-gray-300'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <User className="text-purple-500 mr-3" size={24} />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Who's the birthday star?
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) =>
                        updateField('recipientName', e.target.value)
                      }
                      placeholder="e.g., Sarah"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age (optional)
                    </label>
                    <input
                      type="number"
                      value={formData.recipientAge}
                      min="1"
                      max="122"
                      onChange={(e) =>
                        updateField('recipientAge', e.target.value)
                      }
                      placeholder="e.g., 25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={formData.cardTitle}
                    onChange={(e) => updateField('cardTitle', e.target.value)}
                    placeholder="e.g., Happy 25th Birthday!"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => updateField('senderName', e.target.value)}
                    placeholder="e.g., Love from the family"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <MessageCircle className="text-purple-500 mr-3" size={24} />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Personalize your message
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birthday Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Write a heartfelt birthday message... ✨"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {formData.message.length}/500 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a Special Photo (optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                      isDragging
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {formData.image ? (
                      <div className="space-y-4">
                        <img
                          src={formData.image as string}
                          alt="Preview"
                          className="max-w-xs mx-auto rounded-lg shadow-md"
                        />
                        <button
                          onClick={() => updateField('image', null)}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload
                          className={`mx-auto mb-4 ${
                            isDragging ? 'text-purple-500' : 'text-gray-400'
                          }`}
                          size={32}
                        />
                        <label className="cursor-pointer">
                          <span className="text-purple-600 hover:text-purple-700 font-medium">
                            Click to upload
                          </span>
                          <span className="text-gray-500">
                            {' '}
                            or drag and drop
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-gray-400 text-sm mt-2">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose a Theme
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themes.map((theme) => (
                      <motion.div
                        key={theme.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          formData.selectedTheme === theme.id
                            ? 'border-purple-500 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => updateField('selectedTheme', theme.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`w-full h-12 rounded-lg bg-gradient-to-r ${theme.colors} mb-2`}
                        />
                        <h3 className="font-medium text-gray-800">
                          {theme.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {theme.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <Gift className="text-purple-500 mr-3" size={24} />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    How would you like to share?
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.deliveryMethod === 'magic-link'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => updateField('deliveryMethod', 'magic-link')}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Mail className="text-purple-500 mb-4" size={32} />
                    <h3 className="text-lg font-semibold mb-2">
                      Magic Link Email
                    </h3>
                    <p className="text-gray-600">
                      Send a beautiful email with a secure link. Perfect for
                      surprises!
                    </p>
                  </motion.div>

                  <motion.div
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.deliveryMethod === 'qr-code'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => updateField('deliveryMethod', 'qr-code')}
                    whileHover={{ scale: 1.02 }}
                  >
                    <QrCode className="text-purple-500 mb-4" size={32} />
                    <h3 className="text-lg font-semibold mb-2">QR Code</h3>
                    <p className="text-gray-600">
                      Generate a QR code to print, share, or send via messaging
                      apps.
                    </p>
                  </motion.div>
                </div>

                {/* Email input for magic links */}
                {formData.deliveryMethod === 'magic-link' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient's Email Address *
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="their@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required={formData.deliveryMethod === 'magic-link'}
                    />
                  </motion.div>
                )}

                {/* Preview Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Preview Your Card
                  </h3>
                  <div
                    className={`bg-gradient-to-r ${
                      themes.find((t) => t.id === formData.selectedTheme)
                        ?.colors
                    } rounded-lg p-6 text-white text-center`}
                  >
                    <h2 className="text-2xl font-bold mb-2">
                      {formData.cardTitle ||
                        `Happy ${
                          formData.recipientAge
                            ? `${formData.recipientAge}th `
                            : ''
                        }Birthday!`}
                    </h2>
                    <p className="text-lg mb-4">
                      Dear {formData.recipientName || 'Birthday Star'},
                    </p>
                    <p className="mb-4">
                      {formData.message ||
                        'Hope your special day is filled with happiness and joy! 🎉'}
                    </p>
                    <p className="text-sm opacity-90">
                      {formData.senderName || 'With love'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 transition-colors duration-200"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <motion.button
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                disabled={
                  !formData.recipientName ||
                  (currentStep === 2 && !formData.message)
                }
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                onClick={generateCard}
                disabled={
                  !formData.recipientName ||
                  !formData.message ||
                  isGenerating ||
                  (formData.deliveryMethod === 'magic-link' && !recipientEmail)
                }
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Create Magic! ✨</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
