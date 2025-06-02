import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const pagesDir = path.join(process.cwd(), 'src/pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.resolve(__dirname, '../card.config.json');
const templatePath = path.resolve(__dirname, '../BirthdayCard.template.tsx');
const outputPath = path.resolve(__dirname, '../src/pages/BirthdayCard.tsx');

// Read configuration and template
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
let template = fs.readFileSync(templatePath, 'utf-8');

const { title, recipient, image, message, authentication } = config;

// Generate unique card ID if not provided
const cardId = authentication?.cardId || `card-${crypto.randomUUID()}`;

// Replace template placeholders
template = template
  .replace(/__RECIPIENT__/g, recipient)
  .replace(/__SUBTITLE__/g, title)
  .replace(/__IMAGE__/g, image)
  .replace(/__AUDIO__/g, '/happy-birthday.mp3')
  .replace(/__CARD_ID__/g, cardId)
  .replace(/__AUTH_ENABLED__/g, authentication?.enabled ? 'true' : 'false')
  .replace(/__AUTH_METHOD__/g, authentication?.method || 'magic-link');

// Handle message lines replacement properly
const messageElements = message
  .map(
    (line: string, index: number) =>
      `<motion.p 
      key={${index}}
      className="text-center text-gray-700 leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ${0.8 + index * 0.1}, duration: 0.5 }}
    >
      ${line}
    </motion.p>`
  )
  .join('\n                    ');

template = template.replace('__MESSAGE_LINES__', messageElements);

// Write the generated component
fs.writeFileSync(outputPath, template);

// Create deployment info
const deploymentInfo = {
  cardId,
  generatedAt: new Date().toISOString(),
  recipient,
  authEnabled: authentication?.enabled || false,
  authMethod: authentication?.method || 'none',
  config: {
    ...config,
    // Don't include sensitive info in deployment file
    email: config.email
      ? { ...config.email, recipientEmail: '***' }
      : undefined,
  },
};

// Write deployment info
fs.writeFileSync(
  path.resolve(__dirname, '../deployment-info.json'),
  JSON.stringify(deploymentInfo, null, 2)
);

console.log(`✅ BirthdayCard.tsx generated successfully!`);
console.log(`📋 Card ID: ${cardId}`);
console.log(
  `🔐 Authentication: ${
    authentication?.enabled ? `${authentication.method} enabled` : 'disabled'
  }`
);
console.log(`📄 Deployment info saved to deployment-info.json`);

// If magic link is enabled, show next steps
if (authentication?.enabled && authentication.method === 'magic-link') {
  console.log('\n🚀 Next steps for magic link setup:');
  console.log('1. Create api/send-magic-link.ts in your project');
  console.log('2. Create api/verify-token.ts in your project');
  console.log(
    '3. Set up environment variables (RESEND_API_KEY, CARD_SECRET_KEY)'
  );
  console.log('4. Deploy to Vercel with API routes enabled');

  if (config.email?.recipientEmail) {
    console.log(`\n📧 Recipient email: ${config.email.recipientEmail}`);
  }
}
