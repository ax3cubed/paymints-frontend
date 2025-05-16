# Paymints Frontend

<p align="center">
  <img src="public/placeholder.svg" alt="Paymints Logo" width="120" />
</p>

<p align="center">
  <b>Modern, secure, and scalable platform for digital payments, invoicing, payroll, and treasury management—built on Next.js, React, and Solana.</b>
</p>

---

## ✨ Overview
Paymints Frontend is a next-generation web application designed to streamline digital payments, invoicing, payroll, and treasury operations for businesses and individuals. Leveraging the power of Solana blockchain, modern UI/UX, and robust state management, Paymints delivers a seamless experience for managing financial workflows, integrating wallets, and visualizing data.

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Project Intention & Philosophy](#project-intention--philosophy)
- [Project Structure & Architecture](#project-structure--architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Key Features
- **Digital Invoicing**: Create, send, and manage invoices with PDF export and public invoice sharing.
- **Payroll Automation**: Effortlessly manage payroll cycles and employee payments.
- **Order Management**: Track and fulfill orders with real-time status updates.
- **Treasury Dashboard**: Visualize balances, transactions, and analytics in a unified dashboard.
- **Solana Wallet Integration**: Connect, view, and transact with Solana wallets using Wallet Adapter.
- **Secure Authentication**: Modern authentication flows and session management.
- **Responsive UI**: Mobile-first, accessible, and beautiful design with Radix UI and Tailwind CSS.
- **Data Visualization**: Interactive charts and analytics for financial insights.
- **PDF Generation**: Export invoices and reports as PDFs.
- **Theming**: Light/dark mode support for personalized experience.
- **AI Credit Scoring & Lending**: AI-powered on-chain credit score, advance eligibility, transparent repayment, score factors, achievements, and personalized tips for borrowing power and financial reputation.
- **Stablecoin Swaps with Perena**: Seamlessly swap between supported stablecoins using Perena, enabling flexible payroll, invoicing, and treasury operations with minimal slippage and fast settlement.

---

## 🏗️ Project Intention & Philosophy
Paymints aims to:
- **Empower businesses and freelancers** to manage payments, invoices, and payroll with ease.
- **Bridge traditional finance and Web3** by integrating Solana blockchain for fast, low-cost transactions.
- **Deliver a delightful user experience** through thoughtful design, accessibility, and performance.
- **Enable extensibility** for future features like multi-currency support, advanced analytics, and integrations.

---

## 🧩 Project Structure & Architecture

```
app/                # Next.js app directory (routing, layouts, pages)
  ├─ analytics/      # Analytics dashboard and charts
  ├─ credit/         # Credit management pages
  ├─ dashboard/      # Main dashboard overview
  ├─ invoices/       # Invoice creation, viewing, and public sharing
  ├─ orders/         # Order management and templates
  ├─ payroll/        # Payroll management
  ├─ profile/        # User profile and editing
  ├─ settings/       # App and user settings
  ├─ transactions/   # Transaction history and details
  ├─ treasury/       # Treasury dashboard
  ├─ wallet/         # Wallet connection and management
  └─ ...             # Global providers, layouts, error pages

components/         # Reusable UI and feature components
  ├─ auth-provider/  # Authentication context and logic
  ├─ header/         # App headers (dashboard, unauthenticated)
  ├─ invoice/        # Invoice forms, views, dashboards
  ├─ sidebar/        # Sidebar navigation and wrappers
  ├─ solana/         # Solana wallet and provider components
  ├─ ui/             # UI primitives (buttons, dialogs, forms, etc.)
  └─ ...

data/               # Static and mock data (e.g., invoices)
hooks/              # Custom React hooks for data fetching, state, and utilities
lib/                # Core utilities, config, PDF templates, API logic
providers/          # Context providers (API, loading, etc.)
public/             # Static assets (images, icons, logos)
store/              # State management (Jotai atoms, invoice store)
styles/             # Global and component styles (Tailwind, CSS)
types/              # TypeScript type definitions (auth, invoice, swap, etc.)
utils/              # Utility functions and token lists
```

### Architectural Highlights
- **App Directory Routing**: Uses Next.js 15 app directory for file-based routing and layouts.
- **Provider Pattern**: Global providers for authentication, theming, API, and wallet context.
- **Atomic State Management**: Jotai atoms for local/global state, React Query for async data.
- **Separation of Concerns**: Clear separation between UI, business logic, and data fetching.
- **Composable UI**: UI primitives and feature components for rapid development and consistency.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React 19](https://react.dev/), [Radix UI](https://www.radix-ui.com/), [Tailwind CSS](https://tailwindcss.com/)
- **State/Data**: [Jotai](https://jotai.org/), [React Query](https://tanstack.com/query/v5)
- **Solana**: [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/), Wallet Adapter
- **PDF**: [jsPDF](https://github.com/parallax/jsPDF)
- **Other**: Axios, Zod, Lucide Icons, Embla Carousel, and more

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (used as the package manager)

### Installation
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd paymints-frontend-fe/paymints-frontend
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```

### Running the Development Server
```sh
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Available Scripts
- `pnpm dev` – Start the development server
- `pnpm build` – Build the app for production
- `pnpm start` – Start the production server
- `pnpm lint` – Run ESLint for code quality

---

## 🔑 Environment Variables
Create a `.env.local` file in the root directory and add any required environment variables. Example:
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```
Refer to the codebase for all required variables.

---

## 🧑‍💻 Development Workflow
- **Component-Driven**: Build UI in `components/` and compose in `app/` routes.
- **State Management**: Use Jotai for local state, React Query for async data.
- **API Integration**: Use Axios and custom hooks in `lib/api/` and `hooks/`.
- **Styling**: Use Tailwind CSS utility classes and custom styles in `styles/`.
- **Testing**: (Add your testing strategy here if available)

---

## 🚢 Deployment
1. **Build the app:**
   ```sh
   pnpm build
   ```
2. **Start the production server:**
   ```sh
   pnpm start
   ```

Deploy to Vercel, Netlify, or your preferred platform. Ensure environment variables are set in your deployment environment.

---

## 🧠 AI Credit Scoring & Lending
Paymints features an innovative AI-powered credit scoring and lending system designed for the Web3 economy:
- **AI Credit Score**: Your score is calculated using on-chain activity, payment history, work reputation, and DAO endorsements. The score is visualized in your dashboard and updated dynamically.
- **Advance Eligibility**: Based on your credit score, you can request payment advances (short-term loans) directly from the platform. The maximum advance amount and terms are determined by your score and repayment history.
- **Transparent Repayment**: Advances are repaid automatically from future invoices, with clear service fees and repayment schedules.
- **Score Factors & Achievements**: See detailed breakdowns of what impacts your score, including positive factors (like perfect payment history, endorsements, and consistent work) and areas for improvement. Unlock achievements for milestones like perfect payer, trusted contributor, and more.
- **Personalized Tips**: Get actionable suggestions to improve your score and increase your borrowing power, such as completing your profile, requesting endorsements, and maintaining payment consistency.

This system empowers users to build on-chain reputation and access working capital, all within a secure, transparent, and user-friendly interface.

---

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License.

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-blue?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" />
  <img src="https://img.shields.io/badge/Solana-Blockchain-3a3a3a?logo=solana" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.17-38bdf8?logo=tailwindcss" />
</p>
