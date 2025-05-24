# 🎉 Birthday Card Template

A beautifully animated, customizable digital birthday card generator built with React, TypeScript, and framer-motion — perfect for sending someone special a delightful surprise!

---

## ✨ Features

- Stylish 3D animated birthday card with confetti and sound
- Easily customizable message, name, and image via a config file
- Runs with a single command (`pnpm run generate`)
- Optimized for sharing online

---

## 🚀 Getting Started

### 1. Clone the Template

```bash
git clone https://github.com/JohanPeraldi/birthday-card-template.git
cd birthday-card-template
```

### 2. Install Dependencies

```bash
pnpm install
```

> Don’t have `pnpm`? Install it via `npm i -g pnpm`

---

## 🎨 Customize the Card

Edit the `card.config.json` file in the root folder:

```json
{
  "title": "Happy birthday!",
  "recipient": "Jane",
  "image": "/happy-birthday.jpeg",
  "message": ["Your message here", "XXXX 🎂 🎁 🎈 🥳 😘", "Your name here"]
}
```

- `title`: Your card's title or main message.
- `recipient`: The birthday person.
- `image`: Path to a custom image (e.g. a photo of the recipient).
- `message`: Your heartfelt greeting (as many/few lines as you wish).

---

## ⚙️ Generate the Card

Run the following to generate your personalized card:

```bash
pnpm run generate
```

This compiles the card with your config and outputs it in the `dist` folder.

---

## 👀 Preview It

To see the result locally:

```bash
pnpm run dev
```

Then open your browser to `http://localhost:5173` (or similar Vite dev server port).

---

## 📦 Build for Production

```bash
pnpm run build
```

Your card is now ready in the `dist` folder to deploy or share!

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [framer-motion](https://www.framer.com/motion/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Contributing

Feel free to fork and submit pull requests if you want to add features like:

- Multiple templates
- Background music picker
- Card scheduling
- GIF/sticker integration

---

## 🥳 License

MIT — free for personal and commercial use.

---

Happy card making! 💌
