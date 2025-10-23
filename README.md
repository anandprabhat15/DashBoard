# Dashboard Project

A React dashboard application built with Vite, featuring task management, productivity tracking, and notifications.

## Features

- Task management with real-time updates
- Productivity analytics and charts
- Project progress tracking
- Notification system
- Responsive design with Material-UI

## Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your Postman API key
   # VITE_API_KEY=your_postman_api_key_here
   # VITE_BASE_URL=https://d473b897-ef30-4a6b-bbde-58e8ef1a8bd2.mock.pstmn.io
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Deployment

### GitHub Setup

1. **Initialize Git repository** (if not already done)

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repository**
   - Go to GitHub and create a new repository
   - Add the remote origin
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### Vercel Deployment

1. **Connect to Vercel**

   - Go to [Vercel](https://vercel.com) and sign in
   - Click "New Project" and import your GitHub repository

2. **Configure Environment Variables**

   - In Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
     - `VITE_API_KEY`: Your Postman API key
     - `VITE_BASE_URL`: `https://d473b897-ef30-4a6b-bbde-58e8ef1a8bd2.mock.pstmn.io`

3. **Deploy**
   - Vercel will automatically deploy your project
   - Your app will be live at `https://your-project-name.vercel.app`

## API Configuration

This project uses a Postman mock API. The API key is stored securely as environment variables to comply with GitHub's security policies.

- **Local development**: Uses `.env` file (not committed to Git)
- **Production**: Uses Vercel environment variables

## Tech Stack

- **Frontend**: React 19, Vite
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Deployment**: Vercel

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
