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
  Smartphone,
  Download,
  Share2,
} from 'lucide-react';
import useSound from 'use-sound';

// This template is designed to work with the generate script
// All configuration comes from template placeholders that get replaced
const getConfig = () => {
  return {
    title: '__SUBTITLE__',
    recipient: '__RECIPIENT__',
    image: '__IMAGE__',
    cardId: '__CARD_ID__',
    // @ts-ignore - This placeholder gets replaced by the generate script
    authEnabled: '__AUTH_ENABLED__' === 'true',
    authMethod: '__AUTH_METHOD__' as 'magic-link' | 'qr-code' | 'none',
  };
};

interface MagicLinkGateProps {
  onAuthenticated: () => void;
  config: ReturnType<typeof getConfig>;
}

interface QRCodeGateProps {
  onAuthenticated: () => void;
  config: ReturnType<typeof getConfig>;
}

const QRCodeGate = ({ onAuthenticated, config }: QRCodeGateProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    // Check if user arrived via QR code scan
    const urlParams = new URLSearchParams(window.location.search);
    const qrToken = urlParams.get('qr');

    if (qrToken) {
      validateQRCode(qrToken);
    } else {
      generateQRCode();
    }
  }, []);

  const validateQRCode = async (token: string) => {
    try {
      console.log('🔍 Validating QR token:', token);

      // Decode the QR token
      const decoded = atob(token);
      console.log('📦 Decoded QR data:', decoded);

      const parts = decoded.split(':');
      if (parts.length !== 2) {
        console.log(
          '❌ Invalid QR token format - expected 2 parts, got:',
          parts.length
        );
        return;
      }

      const [cardId, timestamp] = parts;

      // Check if cardId matches
      if (cardId !== config.cardId) {
        console.log(
          '❌ Card ID mismatch. Expected:',
          config.cardId,
          'Got:',
          cardId
        );
        return;
      }

      // Check if token is not too old (24 hours for QR codes)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (tokenAge > maxAge) {
        console.log(
          '❌ QR token expired. Age:',
          Math.round(tokenAge / 1000 / 60),
          'minutes'
        );
        return;
      }

      console.log('✅ QR token validated successfully');
      setIsScanned(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Small delay for UX
      setTimeout(() => onAuthenticated(), 1000);
    } catch (error) {
      console.error('❌ QR validation failed:', error);
    }
  };

  const generateQRCode = () => {
    // Generate QR code using a free service (qr-server.com)
    const timestamp = Date.now();
    // Create a simple QR token (different from magic link tokens)
    const qrData = `${config.cardId}:${timestamp}`;
    const qrToken = btoa(qrData);

    // Ensure we use the correct base URL
    const baseUrl = window.location.origin;
    const fullPath = window.location.pathname;
    const qrUrl = `${baseUrl}${fullPath}?qr=${qrToken}`;

    console.log('🔗 QR Code URL:', qrUrl);
    console.log('🎫 QR Token:', qrToken);
    console.log('📦 QR Data:', qrData);

    // Generate QR code image URL using qr-server.com (free service)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      qrUrl
    )}&bgcolor=f8fafc&color=3b82f6&margin=10`;
    setQrCodeUrl(qrImageUrl);
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `${config.recipient}-birthday-card-qr.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const shareQRCode = async () => {
    const qrUrl = `${window.location.origin}${
      window.location.pathname
    }?qr=${btoa(`${config.cardId}:${Date.now()}`).substring(0, 16)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${config.recipient}'s Birthday Card`,
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
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('QR code link copied to clipboard!');
      });
  };

  if (isScanned) {
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
            Get ready for your birthday surprise, {config.recipient}!
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
          />
        </motion.div>
      </div>
    );
  }

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
              Hi {config.recipient}! Scan the QR code below to open your special
              birthday surprise!
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
              />
            ) : (
              <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="animate-pulse text-gray-400">
                  Loading QR Code...
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
              <Smartphone className="w-4 h-4" />
              <span className="font-semibold">Scan with your phone camera</span>
            </div>
            <p className="text-sm text-gray-500">
              Point your camera at the QR code or use a QR scanner app
            </p>
          </div>
        </motion.div>

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
              Since you're on localhost, copy the QR URL from the console and
              paste it in a new tab to test the QR flow!
            </p>
            <button
              onClick={() => {
                const timestamp = Date.now();
                const qrToken = btoa(`${config.cardId}:${timestamp}`).substring(
                  0,
                  16
                );
                const testUrl = `${window.location.origin}${window.location.pathname}?qr=${qrToken}`;
                window.open(testUrl, '_blank');
              }}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🚀 Test QR Flow in New Tab
            </button>
          </motion.div>
        )}

        <motion.div
          className="mt-8 pt-6 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Why QR codes?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Instant access with phone camera</li>
              <li>• No typing or passwords needed</li>
              <li>• Works offline once generated</li>
              <li>• Perfect for sharing physically!</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const MagicLinkGate = ({ onAuthenticated, config }: MagicLinkGateProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState('');

  // Check if user arrived via magic link
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      validateMagicLink(token);
    }
  }, []);

  const validateMagicLink = async (token: string) => {
    try {
      // Check if we're in development mode
      const isDev =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isDev) {
        // Development mode - simple validation
        console.log('🔓 Development mode: Validating token...', token);

        // Simple check - if token looks like base64 and has our card ID, accept it
        try {
          const decoded = atob(token);
          if (decoded.includes(config.cardId)) {
            console.log('✅ Development token validated successfully');
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
            onAuthenticated();
            return;
          }
        } catch (e) {
          console.log('❌ Development token validation failed');
        }
      }

      // Production mode - try API validation
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, cardId: config.cardId }),
      });

      if (response.ok) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        onAuthenticated();
      } else {
        setError(
          'This link has expired or is invalid. Please request a new one.'
        );
      }
    } catch (err) {
      console.error('Token validation error:', err);
      setError('Unable to verify the link. Please try again.');
    }
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check if we're in development mode first
      const isDev =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isDev) {
        // Development mode - generate magic link directly
        console.log('🔓 Development mode: Generating magic link...');
        const devToken = btoa(`${config.cardId}:${Date.now()}:${email}`);
        const magicLink = `${window.location.origin}${window.location.pathname}?token=${devToken}`;
        console.log('🔗 Development Magic Link:', magicLink);

        setLinkSent(true);

        // Auto-redirect in development
        setTimeout(() => {
          console.log('🚀 Auto-redirecting to magic link...');
          window.location.href = magicLink;
        }, 2000);

        setIsLoading(false);
        return;
      }

      // Production mode - try to send via API
      const response = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          cardId: config.cardId,
          recipientName: config.recipient,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLinkSent(true);
      } else {
        setError(data.error || 'Failed to send magic link');
      }
    } catch (err) {
      console.error('Error in sendMagicLink:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (linkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            Check Your Email! 📧
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600 mb-6">
              We've sent a special link to <strong>{email}</strong>. Click the
              link in your email to open your birthday surprise!
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-200 mb-6">
              <div className="flex items-center justify-center gap-2 text-pink-700 mb-2">
                <Heart className="w-4 h-4" />
                <span className="font-semibold">Pro Tip</span>
              </div>
              <p className="text-sm text-pink-600">
                Check your spam folder if you don't see the email within a few
                minutes!
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700">
                🚀 <strong>Development mode:</strong> Magic link logged to
                console!
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => {
              setLinkSent(false);
              setEmail('');
            }}
            className="mt-6 text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Send to different email
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4">
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
            className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Mail className="w-10 h-10 text-purple-600" />
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
              Hi {config.recipient}! Enter your email to receive a secure link
              to your special birthday surprise!
            </p>
          </motion.div>
        </div>

        <motion.form
          onSubmit={sendMagicLink}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-lg"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm text-center bg-red-50 p-4 rounded-xl border border-red-200"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Sending magic link...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send My Birthday Surprise!
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          className="mt-8 pt-6 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Why email authentication?
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• No passwords to remember</li>
              <li>• Secure, private access</li>
              <li>• Links expire automatically</li>
              <li>• Perfect for special occasions!</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

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
                initial={{ opacity: 1, y: -20, x: `${x}vw`, rotate: 0, scale }}
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

export default function BirthdayCard() {
  const config = getConfig();
  const [isAuthenticated, setIsAuthenticated] = useState(!config.authEnabled);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [playBirthdaySong, { stop: stopBirthdaySong }] = useSound('__AUDIO__', {
    volume: 0.5,
    interrupt: true,
    onload: () => console.log('🎵 Audio loaded'),
    onloaderror: () =>
      console.log('🎵 Audio not available (this is fine for testing)'),
  });

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

  // Show authentication gate if authentication is enabled and user not authenticated
  if (config.authEnabled && !isAuthenticated) {
    if (config.authMethod === 'qr-code') {
      return (
        <QRCodeGate
          onAuthenticated={() => setIsAuthenticated(true)}
          config={config}
        />
      );
    } else {
      return (
        <MagicLinkGate
          onAuthenticated={() => setIsAuthenticated(true)}
          config={config}
        />
      );
    }
  }

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
        className="fixed top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90 shadow-md"
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
                    <motion.img
                      src="__IMAGE__"
                      alt="Birthday celebration"
                      className="rounded-lg shadow-md max-w-[300px] object-cover"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    />
                    <h2 className="font-['Playfair_Display'] text-2xl text-primary text-center">
                      {config.title}
                    </h2>
                    __MESSAGE_LINES__
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
                    Happy <span className="block">birthday</span> __RECIPIENT__!
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
