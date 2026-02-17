# Livelo Clone

## Overview
A frontend clone of the Livelo (livelo.com.br) loyalty rewards program website. This is a static frontend application built with React, TypeScript, and Tailwind CSS.

## Project Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Express (minimal, serves frontend)
- **No database needed** - this is a static frontend clone

## Key Components
- `PromoBar` - Top promotional message bar with rotation
- `Header` - Navigation header with logo, menu, search, login
- `SecurityBanner` - Security warning banner
- `HeroBanner` - Auto-rotating hero carousel with 3 banners
- `TravelSearch` - Tabbed travel search (flights, hotels, cars, packages)
- `CpfConsulta` - CPF consultation with 16s loading animation (top of page, after header)
- `ProductsCarousel` - Products grid with category filter
- `DestinationsSection` - Popular travel destinations grid
- `Partners` - Partner companies by category
- `ClubLivelo` - Subscription plans (3 tiers)
- `AppDownload` - Mobile app download CTA
- `Footer` - Multi-column footer with links

## Theme
- Primary: Purple #7B2D8E (HSL 280 70% 45%)
- Accent: Orange #FF6600 (HSL 24 100% 50%)
- Font: Inter

## Recent Changes
- 2026-02-17: Moved CPF consultation to top of page (after header), removed PointsSection, redesigned with white background
- 2026-02-17: Added CPF consultation system with 16-second loading animation
- 2026-02-17: Initial build - complete Livelo homepage clone
