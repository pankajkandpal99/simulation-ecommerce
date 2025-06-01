# eCommerce Checkout Flow Simulation

A complete 3-page eCommerce checkout flow simulation built with the MERN stack (MongoDB, Express, React, Node.js) with TypeScript support, featuring end-to-end type safety, robust form validation, and transaction processing.

## Features

- **Complete Checkout Flow**: Landing Page (product display), Checkout Page (form validation), and Thank You Page (order confirmation)
- **Transaction Simulation**: Handles approved transactions, declined payments, and gateway failures with appropriate user feedback
- **Email Notifications**: Integrated with Mailtrap.io for order confirmations, payment failures, and gateway error notifications
- **Form Validation**: Dual-layer validation with Zod on both client and server sides
- **State Management**: Redux Toolkit for efficient global state management
- **Modern UI**: Built with shadcn/ui components, Tailwind CSS for styling, and Framer Motion for animations
- **Security**: Helmet, rate limiting, NoSQL injection prevention, and XSS protection
- **Type Safety**: Full TypeScript integration across both frontend and backend

## Tech Stack

### Frontend

- **Framework**: React v19 with Vite for ultra-fast development
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Redux Toolkit for centralized state
- **Form Handling**: React Hook Form with Zod validation resolver
- **Routing**: React Router DOM v7
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Animations**: Framer Motion for smooth transitions
- **Type Safety**: TypeScript with strict type checking
- **Notifications**: Sonner for elegant toast notifications
- **Build Tool**: Vite with LightningCSS for optimized production builds

### Backend

- **Runtime**: Node.js with Express framework
- **Database**: MongoDB with Mongoose ODM (including transactions support)
- **Authentication**: JWT with Passport.js strategy
- **Email Service**: Nodemailer integrated with Mailtrap.io sandbox
- **Security Middleware**:
  - Helmet for security headers
  - Express Rate Limit for API throttling
  - Express Mongo Sanitize against NoSQL injection
  - XSS Clean for cross-site scripting protection
- **Logging**: Winston for structured logging
- **Type Safety**: TypeScript with strict type definitions
- **Dev Tools**: TSX for development with hot reloading

## Development Setup

### Prerequisites

- Node.js v18 or higher
- MongoDB (local instance or cloud MongoDB Atlas)
- Mailtrap.io account (free tier sufficient for testing)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ecommerce-checkout-flow.git
   cd ecommerce-checkout-flow

   ```

2. Install server dependencies:
   cd client && npm install

3. Install server dependencies:
   cd ../server && npm install

4. Configure environment variables given in .env.example

5. Start development servers:
   In first terminal (client):
   cd client && npm run dev

   In second terminal (server):
   cd server && npm run dev

Project Structure :
ecommerce-checkout-flow/
├── client/ # Frontend application
│ ├── public/ # Static assets
│ ├── src/ # Application source
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Route pages (Landing, Checkout, ThankYou)
│ │ ├── store/ # Redux store (slices, actions)
│ │ ├── types/ # TypeScript type definitions
│ │ ├── utils/ # Helper functions and constants
│ │ ├── App.tsx # Root application component
│ │ └── main.tsx # Entry point with providers
│ └── vite.config.ts # Vite configuration
│
├── server/ # Backend application
│ ├── src/ # Server source
│ │ ├── config/ # App configuration
│ │ ├── controllers/ # Route controllers
│ │ ├── interfaces/ # TypeScript interfaces
│ │ ├── middleware/ # Express middleware stack
│ │ ├── models/ # MongoDB schemas and models
│ │ ├── routes/ # API route definitions
│ │ ├── services/ # Business logic services
│ │ ├── utils/ # Utility functions
│ │ └── server.ts # Express server setup
│ └── tsconfig.json # TypeScript configuration
│
└── README.md # Project documentation

License
This project is open-source and available under the MIT License. Feel free to use it as a template for your eCommerce applications.

This comprehensive README provides all necessary information in a single, well-organized document that:

1. Clearly explains the project's features and capabilities
2. Details the complete technology stack
3. Provides straightforward setup instructions
4. Includes visual project structure
5. Explains how to test transaction scenarios
6. Offers deployment guidance
7. Maintains professional formatting throughout

The document is ready to be added to your project repository and will effectively communicate your implementation to reviewers or other developers.
