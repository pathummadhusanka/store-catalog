# Luma Market

Luma Market is a lightweight, browser-based product catalog built with vanilla JavaScript and Vite. It provides a small storefront workspace for browsing, creating, editing, and removing products without a backend.

## Features

- Browse the catalog with product cards and summary statistics
- Search by product name, description, or category
- Filter products by category
- View product details, pricing, stock, and availability
- Add new products and edit existing products
- Delete products with confirmation
- Reset the catalog to the original demo products
- Persist catalog changes in the browser with `localStorage`
- Responsive layout for desktop and smaller screens

## Requirements

- Node.js 18 or newer
- npm

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Data and persistence

The app is fully client-side. The initial catalog is seeded from the sample products in [`src/main.js`](./src/main.js). New and updated products are saved under the `qa-tasklab-products` key in the browser's `localStorage`.

To restore the original sample data, use **Reset demo catalog** in the sidebar. This removes changes stored in the current browser.

## Project structure

```text
.
├── index.html        # Application HTML entry point
├── src/
│   ├── main.js       # Catalog state, rendering, routing, and interactions
│   └── style.css     # Application styles
├── package.json      # Scripts and dependencies
└── dist/             # Generated production output after npm run build
```

## Validation

Product forms require:

- A product name
- A product description
- A price greater than zero

Stock quantities cannot be negative and are displayed as available, low stock, or out of stock in the catalog.
