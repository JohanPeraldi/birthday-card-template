import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Gift, Stars, PartyPopper, Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';

// Confetti component that creates a festive falling confetti effect
interface ConfettiProps {
  isActive: boolean;
}

const Confetti = ({ isActive }: ConfettiProps) => {
  const confettiCount = 100; // Number of confetti pieces
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
            // Random properties for each confetti piece
            const x = Math.random() * 100; // random horizontal position (%)
            const size = Math.random() * 10 + 5; // between 5-15px
            const rotation = Math.random() * 360; // random rotation
            const color = colors[Math.floor(Math.random() * colors.length)];
            const delay = Math.random() * 0.5; // staggered animation start
            const duration = Math.random() * 2 + 2; // between 2-4s duration
            const shape = Math.random() > 0.5 ? 'square' : 'circle';
            const scale = Math.random() * 0.5 + 0.5; // between 0.5-1

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
                transition={{
                  duration,
                  delay,
                  ease: [0.1, 0.4, 0.7, 1],
                }}
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
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  interface UseSoundOptions {
    volume: number;
    interrupt: boolean;
    onload: () => void;
    onloaderror: (id: string | number, error: Error) => void;
  }

  type UseSoundReturn = [() => void, { stop: () => void }];

  const [playBirthdaySong, { stop: stopBirthdaySong }]: UseSoundReturn =
    useSound('/happy-birthday.mp3', {
      volume: 0.5,
      interrupt: true,
      onload: () => console.log('Audio loaded successfully'),
      onloaderror: (_, error) => console.error('Audio failed to load:', error),
    } as UseSoundOptions);

  // Manage audio playback
  useEffect(() => {
    console.log('Effect triggered:', { isOpen, isMuted });
    if (isOpen && !isMuted) {
      console.log('Attempting to play audio');
      try {
        playBirthdaySong();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    } else {
      console.log('Stopping audio');
      stopBirthdaySong();
    }
    return () => {
      console.log('Cleanup: stopping audio');
      stopBirthdaySong();
    };
  }, [isOpen, isMuted, playBirthdaySong, stopBirthdaySong]);

  // Manage confetti display
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti when card opens
      setShowConfetti(true);
      // Stop the confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Ensure confetti is hidden when card is closed
      // This reset is crucial for allowing the effect to trigger again on next open
      setShowConfetti(false);
    }
  }, [isOpen]);

  const coverVariants = {
    closed: {
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
    open: {
      rotateY: -180,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.4, duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const decorativeElements = {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1519751138087-5bf79df62d5b)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      {/* Confetti effect */}
      <Confetti isActive={showConfetti} />

      {/* Sound control button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
          console.log('Mute toggled:', !isMuted);
        }}
        className="fixed top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors shadow-md"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-gray-600" />
        ) : (
          <Volume2 className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Card container */}
      <div className="relative w-full max-w-md aspect-[1/1.5] [perspective:1000px] [transform-style:preserve-3d]">
        {/* Inner page (visible when opened) */}
        <div className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0" style={decorativeElements}>
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.div
                    className="h-full flex flex-col items-center justify-center p-8 space-y-6"
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key="card-content"
                  >
                    <motion.img
                      src="/happy-birthday.jpeg"
                      alt="Birthday celebration"
                      className="rounded-lg shadow-md max-w-[300px] object-cover"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        exit: { duration: 0.2 },
                        enter: { delay: 0.6, duration: 0.5 },
                      }}
                    />
                    <h2 className="font-['Playfair_Display'] text-2xl text-primary text-center">
                      Happy birthday!
                    </h2>
                    <p className="text-center text-gray-700 leading-relaxed">
                      Your message here
                    </p>
                    <p className="text-center text-gray-700 leading-relaxed">
                      XXXX 🎂 🎁 🎈 🥳 😘
                    </p>
                    <p className="text-center text-gray-700 leading-relaxed">
                      Your name here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Card cover wrapper - has fixed position */}
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {/* Animated cover element */}
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d] [transform-origin:left_center] cursor-pointer z-10"
            animate={isOpen ? 'open' : 'closed'}
            variants={coverVariants}
            onClick={() => {
              console.log('Card clicked, toggling open state');
              setIsOpen(!isOpen);
            }}
          >
            {/* Front of cover - only visible when card is closed */}
            <div
              className="absolute inset-0 [backface-visibility:hidden] rounded-2xl shadow-2xl overflow-hidden"
              style={decorativeElements}
            >
              <div className="absolute inset-0 bg-white/80">
                <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-6 z-20">
                  <PartyPopper className="w-12 h-12 text-yellow-500 animate-pulse" />
                  <h1 className="font-['Dancing_Script'] text-5xl text-primary text-center">
                    Happy birthday!
                  </h1>
                  <div className="flex gap-4">
                    <Cake className="w-6 h-6 text-pink-500 animate-pulse" />
                    <Stars className="w-6 h-6 text-yellow-500 animate-pulse" />
                    <Gift className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <p className="text-sm text-gray-500 mt-4 animate-pulse">
                    Click!
                  </p>
                </div>
              </div>
            </div>

            {/* Back of cover - visible when card is open */}
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
