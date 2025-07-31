# Gemini Clone

A lightweight clone of Google’s Gemini chat interface built with **Next.js 15 App Router**, **TypeScript**, and **Tailwind CSS**.  
It demonstrates client-side state management with **Zustand**, form handling with **React Hook Form** & **Zod**, toast notifications with **react-hot-toast**, and a passwordless **OTP login** flow.

---

## Prerequisites

* Node.js ≥ 18
* pnpm / npm / Yarn

## Setup

```bash
git clone https://github.com/<your-username>/my-gemini-clone.git
cd my-gemini-clone
npm install         # or pnpm install / yarn
```

## Running Locally

```bash
npm run dev         # Starts Next.js dev server at http://localhost:3000
```

Open your browser at <http://localhost:3000>.

To create a production build:

```bash
npm run build
npm start
```

---

## OTP Login

The `/login` route implements a basic OTP workflow:

1. Enter your country code and phone number.
2. Press **Send OTP** – the UI will display a toast indicating that the code was “sent”.
3. Enter the 6-digit code `123456` and press **Verify OTP** to log in.  
   (In the current demo the OTP is hard-coded on the client for simplicity.)

### Integrating a Real SMS Provider

If you want to send real messages:

1. Create a **.env.local** file at the project root with your provider credentials, e.g.

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

2. Build a simple API route or serverless function that receives the phone number and calls the provider SDK to send the OTP.
3. Replace the mocked `setTimeout` blocks in `app/(auth)/login/page.tsx` with `fetch` calls to your API.

---

## Linting & Formatting

```bash
npm run lint
```

The project uses the default **next lint** configuration.

---

## Deployment

The app can be deployed to any platform that supports Node.js.  
For the quickest path, push your repository to GitHub and click **“Deploy”** on [Vercel](https://vercel.com/new).

---

## License

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
