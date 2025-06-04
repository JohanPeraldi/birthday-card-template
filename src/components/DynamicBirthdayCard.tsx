import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cake,
  Gift,
  Stars,
  PartyPopper,
  Volume2,
  VolumeX,
  Mail,
  Send,
  CheckCircle,
  Heart,
  QrCode,
  Download,
  Share2,
  Smartphone,
} from 'lucide-react';
import useSound from 'use-sound';

interface DynamicBirthdayCardProps {
  cardId?: string;
}

export default function DynamicBirthdayCard({
  cardId,
}: DynamicBirthdayCardProps) {
  const [cardData, setCardData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Magic Link Auth State
  const [email, setEmail] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // QR Code Auth State
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isScanned, setIsScanned] = useState(false);

  // Card display state
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [playBirthdaySong, { stop: stopBirthdaySong }] = useSound(
    '/happy-birthday.mp3',
    {
      volume: 0.5,
      interrupt: true,
      onload: () => console.log('🎵 Audio loaded'),
      onloaderror: () => console.log('🎵 Audio not available'),
    }
  );

  const themes = {
    magical: 'from-purple-500 to-pink-500',
    elegant: 'from-blue-500 to-indigo-600',
    joyful: 'from-yellow-400 to-orange-500',
    nature: 'from-green-400 to-emerald-500',
  };

  // Load card data from localStorage
  const loadCardData = (cardId: string) => {
    try {
      const storedData = localStorage.getItem(`card_${cardId}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('💾 Card data loaded from localStorage:', parsedData);
        return parsedData;
      } else {
        console.log('❌ No card data found in localStorage for ID:', cardId);
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading card data from localStorage:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeCard = async () => {
      try {
        console.log('🎂 Initializing card with ID:', cardId);

        if (!cardId) {
          setIsLoading(false);
          return;
        }

        // Load card data from localStorage
        const storedCardData = loadCardData(cardId);
        if (!storedCardData) {
          setIsLoading(false);
          return;
        }

        setCardData(storedCardData);

        // Check for authentication tokens in URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const qrToken = urlParams.get('qr');

        let authenticationPassed = false;

        if (token) {
          console.log('🔗 Magic link token found, validating...');
          const isValid = await validateMagicLink(token, cardId);
          if (isValid) {
            setIsAuthenticated(true);
            authenticationPassed = true;
            console.log('✅ Magic link validated');
            // Clean URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          } else {
            console.log('❌ Magic link validation failed');
            setAuthError('This link has expired or is invalid.');
          }
        } else if (qrToken) {
          console.log('📱 QR token found, validating...');
          const isValid = validateQRCode(qrToken, cardId);
          if (isValid) {
            setIsAuthenticated(true);
            setIsScanned(true);
            authenticationPassed = true;
            console.log('✅ QR code validated');
            // Clean URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          } else {
            console.log('❌ QR code validation failed');
            setAuthError('This QR code has expired or is invalid.');
          }
        }

        // For development: allow bypassing authentication
        const isDev =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';
        if (isDev && !authenticationPassed) {
          console.log('🔓 Development mode: Authentication can be bypassed');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error initializing card:', error);
        setIsLoading(false);
      }
    };

    initializeCard();
  }, [cardId]);

  useEffect(() => {
    if (isOpen && !isMuted) {
      try {
        playBirthdaySong();
      } catch (error) {
        console.log('Audio playback not available');
      }
    } else {
      stopBirthdaySong();
    }
    return () => stopBirthdaySong();
  }, [isOpen, isMuted, playBirthdaySong, stopBirthdaySong]);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  const validateMagicLink = async (
    token: string,
    cardId: string
  ): Promise<boolean> => {
    try {
      // Check if we're in development mode
      const isDev =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isDev) {
        // Development mode - simple validation
        console.log('🔓 Development mode: Validating token...', token);
        try {
          const decoded = atob(token);
          const parts = decoded.split(':');
          if (parts.length >= 2 && parts[0] === cardId) {
            // Check if token is not too old (15 minutes for magic links)
            const timestamp = parseInt(parts[1]);
            const tokenAge = Date.now() - timestamp;
            const maxAge = 15 * 60 * 1000; // 15 minutes

            if (tokenAge < maxAge) {
              console.log('✅ Development token validated successfully');
              return true;
            } else {
              console.log('❌ Development token expired');
            }
          }
        } catch (e) {
          console.log('❌ Development token validation failed');
        }
        return false;
      }

      // Production mode - API validation
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, cardId }),
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Magic link validation error:', error);
      return false;
    }
  };

  const validateQRCode = (token: string, cardId: string): boolean => {
    try {
      // Decode QR token
      const decoded = atob(token);
      const [tokenCardId, timestamp] = decoded.split(':');

      // Check if card ID matches and token isn't too old (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      console.log('🔍 QR validation:', {
        tokenCardId,
        cardId,
        tokenAge: Math.round(tokenAge / 1000 / 60) + ' minutes',
        maxAge: Math.round(maxAge / 1000 / 60) + ' minutes',
      });
      return tokenCardId === cardId && tokenAge < maxAge;
    } catch (error) {
      console.error('QR code validation error:', error);
      return false;
    }
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSending(true);
    setAuthError('');

    try {
      // Check if we're in development mode
      const isDev =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isDev) {
        // Development mode - generate magic link directly
        console.log('🔓 Development mode: Generating magic link...');
        const devToken = btoa(`${cardId}:${Date.now()}:${email}`);
        const magicLink = `${window.location.origin}/card/${cardId}?token=${devToken}`;

        console.log('🔗 Development Magic Link:', magicLink);
        setEmailSent(true);

        // Auto-redirect in development
        setTimeout(() => {
          console.log('🚀 Auto-redirecting to magic link...');
          window.location.href = magicLink;
        }, 2000);

        setIsEmailSending(false);
        return;
      }

      // Production mode
      const response = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          cardId: cardId,
          recipientName: cardData?.recipientName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailSent(true);
        if (result.magicLink) {
          console.log('🔗 Magic link:', result.magicLink);
          setTimeout(() => {
            window.location.href = result.magicLink;
          }, 2000);
        }
      } else {
        setAuthError(result.error || 'Failed to send magic link');
      }
    } catch (error) {
      setAuthError('Failed to send magic link');
    } finally {
      setIsEmailSending(false);
    }
  };

  const generateQRCode = () => {
    if (!cardData) return;

    const timestamp = Date.now();
    const qrToken = btoa(`${cardId}:${timestamp}`);
    const qrUrl = `${window.location.origin}/card/${cardId}?qr=${qrToken}`;

    console.log('📱 Generated QR URL:', qrUrl);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      qrUrl
    )}&bgcolor=ffffff&color=000000&margin=20&format=png`;
    setQrCodeUrl(qrImageUrl);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.download = `${cardData?.recipientName || 'birthday'}-card-qr.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const shareQRCode = async () => {
    if (!cardData) return;

    const timestamp = Date.now();
    const qrToken = btoa(`${cardId}:${timestamp}`);
    const qrUrl = `${window.location.origin}/card/${cardId}?qr=${qrToken}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardData.recipientName}'s Birthday Card`,
          text: 'Scan this QR code to view a special birthday surprise!',
          url: qrUrl,
        });
      } catch (error) {
        console.log('Share failed:', error);
        fallbackShare(qrUrl);
      }
    } else {
      fallbackShare(qrUrl);
    }
  };

  const fallbackShare = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('QR code link copied to clipboard!');
      })
      .catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('QR code link copied to clipboard!');
      });
  };

  // Confetti component
  const Confetti = ({ isActive }: { isActive: boolean }) => {
    const confettiCount = 100;
    const colors = [
      '#FFC700',
      '#FF0066',
      '#2EC4B6',
      '#845EC2',
      '#FF9671',
      '#00C2A8',
      '#F9F871',
    ];

    return (
      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(confettiCount)].map((_, i) => {
              const x = Math.random() * 100;
              const size = Math.random() * 10 + 5;
              const rotation = Math.random() * 360;
              const color = colors[Math.floor(Math.random() * colors.length)];
              const delay = Math.random() * 0.5;
              const duration = Math.random() * 2 + 2;
              const shape = Math.random() > 0.5 ? 'square' : 'circle';
              const scale = Math.random() * 0.5 + 0.5;

              return (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 1,
                    y: -20,
                    x: `${x}vw`,
                    rotate: 0,
                    scale,
                  }}
                  animate={{
                    opacity: 0,
                    y: '100vh',
                    x: `${x + (Math.random() * 20 - 10)}vw`,
                    rotate:
                      rotation +
                      (Math.random() > 0.5 ? 360 : -360) *
                        (Math.random() * 2 + 1),
                    scale: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration, delay, ease: [0.1, 0.4, 0.7, 1] }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: size,
                    height: size,
                    backgroundColor: color,
                    borderRadius:
                      shape === 'circle'
                        ? '50%'
                        : Math.random() > 0.5
                        ? '2px'
                        : '0px',
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your birthday surprise...</p>
        </div>
      </div>
    );
  }

  // Show card not found
  if (!cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎂 Card Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            This birthday card doesn't exist or may have expired.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Create a New Card
          </a>
        </div>
      </div>
    );
  }

  // Show QR scanning success
  if (isScanned && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 mb-4"
          >
            QR Code Scanned! ✨
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-6"
          >
            Get ready for your birthday surprise, {cardData.recipientName}!
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
          />

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={() => setIsAuthenticated(true)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Open Birthday Card 🎂
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Show authentication gates
  if (!isAuthenticated) {
    // Try to determine auth method from delivery method in stored data
    const authMethod = cardData.deliveryMethod || 'magic-link';

    if (authMethod === 'qr-code') {
      // QR Code Authentication Gate
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <QrCode className="w-10 h-10 text-indigo-600" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  🎉 Private Birthday Card
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  Hi {cardData.recipientName}! Scan the QR code below to open
                  your special birthday surprise!
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-200 mb-6"
            >
              <div className="text-center">
                {qrCodeUrl ? (
                  <motion.img
                    src={qrCodeUrl}
                    alt="QR Code for Birthday Card"
                    className="mx-auto mb-4 rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onError={(e) => {
                      console.error('QR Code image failed to load');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                    <button
                      onClick={generateQRCode}
                      className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                    >
                      Generate QR Code
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-semibold">
                    Scan with your phone camera
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Point your camera at the QR code or use a QR scanner app
                </p>
              </div>
            </motion.div>

            {qrCodeUrl && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button
                  onClick={downloadQRCode}
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={shareQRCode}
                  className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </motion.div>
            )}

            {/* Development testing helper */}
            {(window.location.hostname === 'localhost' ||
              window.location.hostname === '127.0.0.1') && (
              <motion.div
                className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <h4 className="font-semibold text-blue-800 mb-2">
                  🧪 Development Testing
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Click the button below to simulate QR code scan!
                </p>
                <button
                  onClick={() => {
                    setIsScanned(true);
                    setTimeout(() => setIsAuthenticated(true), 1500);
                  }}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🚀 Simulate QR Scan
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      );
    } else {
      // Magic Link Authentication Gate
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {!emailSent ? (
              <>
                <div className="text-center mb-6">
                  <Mail className="mx-auto text-purple-500 mb-4" size={48} />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Hi {cardData.recipientName}! 🎉
                  </h2>
                  <p className="text-gray-600">
                    Enter your email to access your birthday surprise!
                  </p>
                </div>

                <form onSubmit={sendMagicLink}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500"
                    required
                  />

                  <button
                    type="submit"
                    disabled={isEmailSending}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isEmailSending
                      ? 'Sending...'
                      : 'Send My Birthday Surprise! 🎁'}
                  </button>
                </form>

                {authError && (
                  <p className="text-red-500 text-sm mt-4 text-center">
                    {authError}
                  </p>
                )}

                {/* Development testing helper */}
                {(window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1') && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      🧪 Development Testing
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Click the button below to simulate magic link
                      authentication!
                    </p>
                    <button
                      onClick={() => setIsAuthenticated(true)}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🚀 Skip Auth (Dev Mode)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <CheckCircle
                  className="mx-auto text-green-500 mb-4"
                  size={48}
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Check Your Email! 📧
                </h2>
                <p className="text-gray-600 mb-4">
                  We've sent you a magical link to access your birthday
                  surprise!
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    🚀 <strong>Development mode:</strong> Magic link logged to
                    console!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      );
    }
  }

  // Show the actual birthday card
  const themeGradient =
    themes[cardData.selectedTheme as keyof typeof themes] || themes.magical;

  const decorativeElements = {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1519751138087-5bf79df62d5b)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <Confetti isActive={showConfetti} />

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        className="fixed top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90 shadow-md z-30"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-gray-600" />
        ) : (
          <Volume2 className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <div className="relative w-full max-w-md aspect-[1/1.5] [perspective:1000px] [transform-style:preserve-3d]">
        <div className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0" style={decorativeElements}>
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.div
                    className="h-full flex flex-col items-center justify-center p-8 space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="card-content"
                  >
                    {cardData.image &&
                      cardData.image !== '/happy-birthday.jpeg' &&
                      typeof cardData.image === 'string' &&
                      cardData.image.startsWith('data:') && (
                        <motion.img
                          src={cardData.image}
                          alt="Birthday celebration"
                          className="rounded-lg shadow-md max-w-[250px] max-h-[200px] object-cover"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        />
                      )}
                    <h2 className="font-['Playfair_Display'] text-2xl text-primary text-center">
                      {cardData.cardTitle}
                    </h2>
                    <div className="space-y-4 text-center">
                      {cardData.message
                        .split('\n')
                        .map((line: string, index: number) => (
                          <motion.p
                            key={index}
                            className="text-gray-700 text-lg leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.8 + index * 0.2,
                              duration: 0.5,
                            }}
                          >
                            {line}
                          </motion.p>
                        ))}
                    </div>
                    <motion.p
                      className="text-gray-600 font-medium text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      {cardData.senderName} ❤️
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 [transform-style:preserve-3d]">
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d] [transform-origin:left_center] cursor-pointer z-10"
            animate={isOpen ? 'open' : 'closed'}
            variants={{
              closed: {
                rotateY: 0,
                transition: { duration: 0.8, ease: 'easeInOut' },
              },
              open: {
                rotateY: -180,
                transition: { duration: 0.8, ease: 'easeInOut' },
              },
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className="absolute inset-0 [backface-visibility:hidden] rounded-2xl shadow-2xl overflow-hidden"
              style={decorativeElements}
            >
              <div className="absolute inset-0 bg-white/80">
                <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-6 z-20">
                  <PartyPopper className="w-12 h-12 text-yellow-500 animate-pulse" />
                  <h1 className="font-['Dancing_Script'] text-5xl text-primary text-center">
                    Happy <span className="block">birthday</span>{' '}
                    {cardData.recipientName}!
                  </h1>
                  <div className="flex gap-4">
                    <Cake className="w-6 h-6 text-pink-500 animate-pulse" />
                    <Stars className="w-6 h-6 text-yellow-500 animate-pulse" />
                    <Gift className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <p className="text-sm text-gray-500 mt-4 animate-pulse">
                    Click to open your birthday card!
                  </p>
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl shadow-2xl overflow-hidden"
              style={decorativeElements}
            >
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
