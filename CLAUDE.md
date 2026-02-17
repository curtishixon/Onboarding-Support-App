# Onboarding Support App

## Project Overview
Internal support tool for automating onboarding workflows using the Zonos API. Built to help onboarding teams configure and test Zonos integrations for new merchants.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **API**: Zonos GraphQL API (`https://api.zonos.com/graphql`)
- **Deployment**: Vercel
- **Package Manager**: npm

## Project Structure
```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/          # API routes (proxy to Zonos GraphQL)
│   └── ...           # Page components
├── lib/              # Shared utilities and API clients
│   ├── zonos-client.ts      # Main Zonos GraphQL client
│   ├── vision-client.ts     # Vision AI extraction client
│   ├── classify-client.ts   # HS code classification client
│   └── credentials.ts       # API key management
├── components/       # React components
└── types/            # TypeScript type definitions
    └── zonos.ts      # Zonos API types
```

## Architecture
```
Browser → Next.js API Routes → Zonos GraphQL API
          (/api/proxy)         (api.zonos.com/graphql)
```

All Zonos API calls are proxied through Next.js API routes to keep credentials server-side.

## Zonos API Authentication
- **Standard operations**: `credentialToken` header
- **Destructive operations** (void/cancel): `credentialToken` + `credentialTokenProxy` headers
- API keys are stored in environment variables, never in code

## Environment Variables
```
ZONOS_API_KEY=credential_live_...       # Private API key (server-side only)
ZONOS_PROXY_KEY=...                      # Proxy key for destructive operations
NEXT_PUBLIC_ZONOS_STORE_ID=...          # Store ID (can be public)
```

## Key Zonos Concepts
- **Workflow mutations**: Multiple operations combined in a single GraphQL call (parties → items → cartonize → rate → landed cost)
- **Landed Cost**: Duties, taxes, and fees for cross-border shipments
- **Classify**: AI-powered HS code classification (BASE/ADVANCED/ULTRA levels)
- **Vision**: AI item extraction from images
- **Checkout**: International checkout flows with currency conversion

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run linter
```

## API Reference Files
See `docs/` directory for detailed Zonos API references:
- `docs/zonos-api-reference.md` - Core mutations, queries, and input types
- `docs/zonos-integration-guide.md` - Workflow patterns and integration examples

## Conventions
- Use TypeScript strict mode
- API routes go in `src/app/api/`
- Shared logic goes in `src/lib/`
- Components use functional React with hooks
- All Zonos API calls go through server-side proxy routes
- Never expose API keys to the client
