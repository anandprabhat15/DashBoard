# Dashboard Project

A modern React dashboard application built with Vite, featuring task management, productivity tracking, and project monitoring.

## Features

- 📊 Task List with status tracking
- 📈 Productivity charts and analytics
- 🚀 Projects in progress carousel
- 🔔 Real-time notifications
- 👤 User profile management
- 📅 Date range filtering

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/anandprabhat15/DashBoard.git
cd DashBoard
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API credentials:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_KEY=your_postman_api_key_here
VITE_BASE_URL=your_api_base_url_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Configuration

The application uses environment variables for API configuration. Make sure to set up your `.env` file with the correct API credentials before running the application.

Required environment variables:

- `VITE_API_KEY`: Your Postman API key
- `VITE_BASE_URL`: Your API base URL

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React 18
- Vite
- Axios for API calls
- Recharts for data visualization
- Lucide React for icons

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
