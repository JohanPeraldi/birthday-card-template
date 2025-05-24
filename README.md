# 🎉 Birthday Card Template

A customizable birthday card template built with React and TypeScript, designed to be generated and customized via scripts.

---

## ✨ Features

- Stylish 3D animated birthday card with confetti and sound
- Easily customizable message, name, and image via a config file
- Runs with a single command (`pnpm run generate`)
- Optimized for sharing online

---

## 🚀 Getting Started

### 0. Prerequisites

- Node.js (v16 or newer recommended)
- pnpm or npm

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

This will generate a `BirthdayCard.tsx` file in the `src/pages/` folder based on your template and configuration.

---

## 📁 Project Structure and Generated Files

- The `src/pages/` folder **must exist and be committed** to your repository. It acts as the target location for generated birthday card components.
- When you run the generate script, it will create or overwrite the `BirthdayCard.tsx` file inside `src/pages/`.
- **Do not commit the generated `BirthdayCard.tsx` or any other generated files** inside `src/pages/`. These are build outputs and can be recreated anytime by running the generation script.

Make sure to keep `src/pages/` in your repo even if it’s initially empty to avoid errors.

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

## 🚫 Ignored Files

- The `dist-scripts/` folder contains compiled scripts and **should be added to `.gitignore`**.
- Generated files inside `src/pages/` like `BirthdayCard.tsx` should **not** be committed.

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

## © License

MIT © Johan Peraldi — Free for personal and commercial use.

---

Happy card making! 💌
