# Lagos Sourcing

A web platform that connects clients with vendors for product sourcing and order tracking.

## Current application

- Single-page web application hosted through GitHub Pages.
- Client and vendor account registration and login through Firebase Authentication.
- Vendor profile discovery and vendor verification workflow.
- Sourcing requests, vendor quotes, simulated escrow state, shipment updates, order tracking, and dispute review.
- Responsive client, vendor, and admin dashboards.
- Account settings for clients and vendors.
- Fresh-login behavior and a 15-minute inactivity sign-out.
- Order details and printable order receipts.

## Development and validation

The app currently runs as a static HTML page with browser ES modules loaded from Firebase's CDN. Backend storage and security-rule changes are intentionally handled separately from this frontend pass.

The repository includes a lightweight GitHub Actions workflow that checks:

- JavaScript syntax in inline scripts.
- Explicit button types.
- Labels for form controls.
- Image alternative text.
- Core accessibility hooks and responsive viewport configuration.

To run the checks locally, use Node.js 20 or newer:

```bash
node .github/scripts/validate.mjs
```

## Important beta limitations

- Escrow funding is a simulation, not a payment transaction.
- Do not use the current escrow flow to collect, hold, or transfer real money.
- Firebase Storage, production Firestore rules, and server-side transaction enforcement require a separate backend setup and review.
- Browser-only UI checks do not replace end-to-end tests with real Firebase test accounts.

## Deployment

The production site is published from the repository's `main` branch through GitHub Pages. UI changes in a feature branch are not live until reviewed and merged.
