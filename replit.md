# QR Code Generator Web Application

## Overview

This project is a full-stack, client-side QR code generator web application designed for various content types (URLs, emails, phone numbers, WiFi, vCards, events). It offers a responsive design, advanced customization options, and aims to be a free, no-app solution. The application prioritizes developer experience, type safety, and modern web standards, operating as a static website where all QR code generation and scanning occur within the browser without server-side data collection. The business vision is to provide a comprehensive, user-friendly tool for generating custom QR codes for personal and professional use, with high market potential due to its accessibility and feature set.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred header styling: Dynamic neon gradient colors that change over time (blue+pink to green+orange cycles).

## System Architecture

### UI/UX Decisions
- Responsive design with a clean, component-first approach.
- CSS variables-based theming with dark mode support.
- Utilizes Tailwind CSS and shadcn/ui (new-york style) for a modern aesthetic.
- Dynamic neon gradient for header styling.
- Comprehensive favicon and PWA setup for improved user experience and search visibility across devices.
- Focus on client-side rendering with strategic server-side skeleton for critical content (hero section) to optimize Largest Contentful Paint (LCP) and user experience.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Vite for bundling, TanStack Query for state management, React Router for routing, Radix UI primitives, React Hook Form with Zod for validation.
- **QR Code Generation**: Client-side generation using the `qrcode` library, supporting various content types, customization (size, colors, error correction, logo embedding), and outputting Data URLs.
- **Image Processing**: Client-side image upload, resizing, and format conversion for logo embedding.
- **Backend**: Minimal Node.js with Express.js, TypeScript with ES modules, primarily serving the frontend.
- **Performance Optimizations**: Aggressive esbuild minification, CSS minification, single vendor chunk strategy, code splitting, lazy loading (e.g., `html5-qrcode`), and critical rendering path optimizations like inlined critical CSS and hero skeleton HTML. Gzip/brotli compression and proper cache headers for server-side assets.
- **PWA/SEO**: Extensive SEO content, optimized meta tags, and complete PWA configuration (web manifest, favicons) for better search engine visibility and app-like experience.

### Feature Specifications
- Support for generating QR codes for URLs, Emails, Text, Phone, SMS, WhatsApp, WiFi, vCard, Enhanced vCard, Event, Image, PayPal, and Zoom.
- Advanced customization options for QR codes.
- Web Share API integration for enhanced functionality (e.g., direct calendar/contact app integration).
- QR code scanning functionality.

### System Design Choices
- Monorepo structure.
- Client-side QR generation as a core principle to ensure privacy and no server-side data collection.
- TypeScript used extensively for type safety.
- Modern development toolchain (Vite, ESBuild).
- Designed for static website deployment, with specific considerations for hosting environments like Hostinger (e.g., `.htaccess` configurations for MIME types).

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, React Router
- **State Management**: TanStack React Query
- **Forms**: React Hook Form, Hookform Resolvers
- **Validation**: Zod
- **QR Generation**: `qrcode` library
- **Date Handling**: `date-fns`

### UI Libraries
- **Component Library**: Radix UI (base for shadcn/ui)
- **Styling**: Tailwind CSS, `class-variance-authority`
- **Utilities**: `clsx`
- **Icons**: Lucide React

### Development Tools
- **TypeScript**
- **Build Tools**: Vite, esbuild, PostCSS
- **Database Tools**: Drizzle Kit (used for PostgreSQL setup, but core app functionality is in-memory)
- **Database**: PostgreSQL (configured for Neon serverless, though primary storage is in-memory for the web app's core function), `@neondatabase/serverless`.