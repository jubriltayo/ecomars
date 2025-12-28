# Ecomars - Digital Marketplace Platform

## 🚀 Overview

Ecomars is a modern, full-stack digital marketplace platform similar to Gumroad, built with Next.js 15. It enables creators to sell digital products and customers to purchase them with secure payments, instant downloads, and comprehensive management tools.

**Live Demo**: [Coming Soon]  
**Repository**: `https://github.com/jubriltayo/ecomars`

## ✨ Features

### 🛒 For Buyers
- **Browse Marketplace**: Discover digital products across various categories
- **Secure Checkout**: Stripe-powered payment processing
- **Instant Downloads**: Immediate access to purchased products
- **Purchase History**: Track all orders and downloads
- **Wishlist**: Save products for later

### 🎨 For Sellers/Creators
- **Product Management**: Create, edit, and delete digital products
- **File Upload**: Upload PDFs, ZIPs, ePubs, documents, and images (up to 100MB)
- **Sales Dashboard**: Track revenue, orders, and customer insights
- **Pricing Control**: Set flexible pricing for products

### 🔐 Security & Infrastructure
- **JWT Authentication**: Secure session management
- **Google OAuth**: Social login integration
- **File Protection**: Secure download links with authorization checks
- **Stripe Integration**: PCI-compliant payment processing
- **CORS Protection**: Secure API communication between frontend/backend

## 🏗️ Architecture

Ecomars follows a modern, decoupled architecture:

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │    Backend      │
│   (Next.js 15)  │────▶│  (Next.js API) │
│   Local: 3000   │     │   Local: 4000   │
└─────────────────┘     └─────────────────┘
                                │
                        ┌─────────────────┐
                        │   Hasura GraphQL│
                        │     Database    │
                        └─────────────────┘
                                │
                        ┌─────────────────┐
                        │     Stripe      │
                        │  (Payments)     │
                        └─────────────────┘
```

## 📦 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** with custom design system
- **Radix UI** components
- **Next Themes** for dark/light mode
- **React Hook Form** with Zod validation
- **Stripe.js** for client-side payments

### Backend
- **Next.js API Routes** (GraphQL & REST)
- **Apollo Server** for GraphQL
- **JWT** for authentication
- **Stripe Node.js SDK**
- **Zod** for validation
- **jose** for JWT handling

### Database & Infrastructure
- **Hasura GraphQL Engine**
- **PostgreSQL** (via Hasura)
- **Stripe** for payments
- **Google OAuth** for authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account
- Google OAuth credentials
- Hasura instance (local or cloud)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/jubriltayo/ecomars.git
cd ecomars
```

#### 2. Backend Setup
```bash
cd backend
cp .env.example .env.local
# Configure environment variables
npm install
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Configure environment variables
npm install
npm run dev
```

#### 4. Database Setup
1. Run Hasura migrations
2. Set up database schema
3. Configure relationships and permissions

### Environment Variables

#### Backend (`.env.local`)
```env
# App
NODE_ENV=development
NEXTAUTH_SECRET=your-secret-key
COOKIE_DOMAIN=localhost

# Database
HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
HASURA_ADMIN_SECRET=your-admin-secret

# URLs
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## 📁 Project Structure

### Backend
```
backend/
├── app/api/           # API routes (GraphQL, auth, upload, webhooks)
├── graphql/           # GraphQL schema and resolvers
├── lib/              # Utilities (auth, validation, database, stripe)
├── types/            # TypeScript types
└── scripts/          # Build and database scripts
```

### Frontend
```
frontend/
├── app/              # Next.js app router pages
├── components/       # Reusable components
│   ├── home/        # Homepage components
│   ├── layout/      # Layout components
│   ├── products/    # Product-related components
│   ├── theme/       # Theme components
│   └── ui/          # Base UI components
├── lib/             # Utilities and contexts
└── public/          # Static assets
```

## 🔐 Authentication Flow

1. **Email/Password**: Traditional registration and login
2. **Google OAuth**: Social login with automatic account linking
3. **Session Management**: JWT-based sessions with secure cookies
4. **Protected Routes**: Middleware for route protection

### Auth Endpoints
- `POST /api/graphql` - GraphQL endpoint with auth mutations
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/callback/google` - Google OAuth callback

## 💳 Payment Flow

1. **Create Order**: User adds products to cart
2. **Checkout**: User enters payment details
3. **Stripe Payment**: Secure payment processing
4. **Order Completion**: Update order status and grant downloads
5. **Webhook Handling**: Process payment events from Stripe

### Payment Endpoints
- `POST /api/graphql` - Create order and get Stripe client secret
- `POST /api/webhook/stripe` - Handle Stripe webhooks

## 📤 File Management

### Upload Process
1. Seller creates product
2. Uploads file via `/api/upload`
3. File stored in `public/uploads/` with UUID filename (local), cloudinary on production
4. File metadata saved to database

### Download Process
1. Buyer purchases product
2. Download record created
3. File served via `/api/download` with auth validation
4. File served with proper Content-Type headers

### Supported File Types
- Documents: PDF, DOC, DOCX, TXT
- Archives: ZIP, RAR
- eBooks: EPUB
- Images: JPG, PNG, GIF

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run generate-types # Generate TypeScript types from GraphQL
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## 📊 Database Schema

Key tables:
- `users` - User accounts and profiles
- `products` - Digital products for sale
- `orders` - Customer orders
- `order_items` - Items within orders
- `downloads` - Track file downloads
- `accounts` - OAuth account linking

## 🔧 API Documentation

### GraphQL API
Access at: `http://localhost:4000/api/graphql`

**Key Queries:**
- `products` - List all published products
- `product(id)` - Get single product
- `myProducts` - Get seller's products
- `myOrders` - Get user's orders
- `me` - Get current user

**Key Mutations:**
- `createProduct` - Add new product
- `createOrder` - Create order and get Stripe client secret
- `register` - Create new account
- `login` - Authenticate user
- `downloadProduct` - Create download record

### REST Endpoints
- `POST /api/upload` - Upload product files
- `GET /api/download` - Download purchased files
- `POST /api/webhook/stripe` - Stripe webhook handler

## 🚢 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start with process manager (PM2, systemd)
4. Configure SSL/TLS
5. Set up database connection pooling

### Frontend Deployment
1. Update `NEXT_PUBLIC_BACKEND_URL` to production URL
2. Build: `npm run build`
3. Deploy to Vercel

### Database Deployment
1. Set up production PostgreSQL
2. Configure Hasura with proper permissions
3. Set up backups and monitoring

## 🔒 Security Considerations

1. **File Uploads**: Validate file types and sizes
2. **Downloads**: Authenticate and authorize each download
3. **Payments**: Use Stripe for PCI compliance
4. **Sessions**: Secure, HTTP-only cookies
5. **CORS**: Restrict to trusted origins
6. **Input Validation**: Validate all user input with Zod

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.