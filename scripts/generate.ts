import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.resolve(__dirname, '../card.config.json');
const outputPath = path.resolve(__dirname, '../src/pages/BirthdayCard.tsx');

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const { title, recipient, image, message } = config;

const generatedComponent = `// AUTO-GENERATED. DO NOT EDIT.
// To update this file, edit card.config.json and run: pnpm run generate

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Gift, Stars, PartyPopper, Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';

const Confetti = ({ isActive }: { isActive: boolean }) => {
  const confettiCount = 100;
  const colors = ['#FFC700','#FF0066','#2EC4B6','#845EC2','#FF9671','#00C2A8','#F9F871'];

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
                initial={{ opacity: 1, y: -20, x: \`\${x}vw\`, rotate: 0, scale }}
                animate={{ opacity: 0, y: '100vh', x: \`\${x + (Math.random() * 20 - 10)}vw\`, rotate: rotation + (Math.random() > 0.5 ? 360 : -360) * (Math.random() * 2 + 1), scale: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration, delay, ease: [0.1, 0.4, 0.7, 1] }}
                style={{ position: 'absolute', top: 0, width: size, height: size, backgroundColor: color, borderRadius: shape === 'circle' ? '50%' : Math.random() > 0.5 ? '2px' : '0px' }}
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

  const [play, { stop }] = useSound('/happy-birthday.mp3', {
    volume: 0.5,
    interrupt: true,
    onload: () => console.log('Audio loaded'),
    onloaderror: (_, e) => console.error('Audio error', e)
  });

  useEffect(() => {
    if (isOpen && !isMuted) play();
    else stop();
    return () => stop();
  }, [isOpen, isMuted]);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  const decorative = {
    backgroundImage: 'url(https://images.unsplash.com/photo-1519751138087-5bf79df62d5b)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <Confetti isActive={showConfetti} />

      <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="fixed top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors shadow-md">
        {isMuted ? <VolumeX className="w-6 h-6 text-gray-600" /> : <Volume2 className="w-6 h-6 text-gray-600" />}
      </button>

      <div className="relative w-full max-w-md aspect-[1/1.5] [perspective:1000px] [transform-style:preserve-3d]">
        <div className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0" style={decorative}>
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm">
              <AnimatePresence>
                {isOpen && (
                  <motion.div className="h-full flex flex-col items-center justify-center p-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.img src="${image}" alt="Birthday" className="rounded-lg shadow-md max-w-[300px] object-cover" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} />
                    <h2 className="font-['Playfair_Display'] text-2xl text-primary text-center">${title}</h2>
                    ${message
                      .map(
                        (p: string) =>
                          `<p className="text-center text-gray-700 leading-relaxed">${p}</p>`
                      )
                      .join('\n')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 [transform-style:preserve-3d]">
          <motion.div className="absolute inset-0 [transform-style:preserve-3d] [transform-origin:left_center] cursor-pointer z-10" animate={isOpen ? 'open' : 'closed'} variants={{ closed: { rotateY: 0, transition: { duration: 0.8 } }, open: { rotateY: -180, transition: { duration: 0.8 } } }} onClick={() => setIsOpen(!isOpen)}>
            <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl shadow-2xl overflow-hidden" style={decorative}>
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-8 space-y-6">
                <PartyPopper className="w-12 h-12 text-yellow-500 animate-pulse" />
                <h1 className="font-['Dancing_Script'] text-5xl text-primary text-center">Happy <span className="block">birthday</span> ${recipient}!</h1>
                <div className="flex gap-4">
                  <Cake className="w-6 h-6 text-pink-500 animate-pulse" />
                  <Stars className="w-6 h-6 text-yellow-500 animate-pulse" />
                  <Gift className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-gray-500 mt-4 animate-pulse">Click to open your birthday card!</p>
              </div>
            </div>
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl shadow-2xl overflow-hidden" style={decorative}>
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(outputPath, generatedComponent);
console.log(`✅ BirthdayCard.tsx generated from card.config.json`);
