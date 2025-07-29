# 🎨 CoSearch Frontend

React application for CoSearch - a customizable search engine interface.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   # Create .env file
   echo "VITE_API_BASE_URL=http://localhost:8484/api" > .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - http://localhost:3000

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── admin/      # Admin components
│   │   ├── category/   # Category management
│   │   ├── common/     # Common UI elements
│   │   ├── core/       # Core components
│   │   ├── features/   # Feature components
│   │   ├── layout/     # Layout components
│   │   ├── logo/       # Logo and branding
│   │   ├── navigation/ # Navigation components
│   │   ├── onboarding/ # Onboarding flow
│   │   ├── search/     # Search components
│   │   ├── settings/   # Settings components
│   │   └── url/        # URL management
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── utils/          # Utility functions
├── public/             # Static assets
└── temp/              # Icon assets
```

## 🎨 UI Components

### Core Components
- **AppLayout**: Main application layout
- **SidebarLayout**: Sidebar navigation layout
- **ThemeToggle**: Dark/light mode switching

### Category Management
- **CategoryBox**: Display search categories
- **CategoryDisplay**: Show category content
- **CategorySelector**: Select categories
- **SiteTiles**: Display site tiles in categories

### Search Interface
- **SearchBar**: Main search input
- **SearchResults**: Display search results
- **QueryBox**: Search query input

### Settings & Configuration
- **SettingsPanel**: User preferences
- **ServiceTable**: Manage URLs and categories
- **AddUrlModal**: Add new URLs
- **EditUrlModal**: Edit existing URLs

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Mantine UI** - Component library
- **TanStack Query** - Data fetching
- **React Router** - Navigation
- **PostCSS** - CSS processing

## 🎯 Key Features

### User Interface
- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Theme switching
- **Modern UI**: Clean, professional design
- **Accessibility**: WCAG compliant

### Functionality
- **Category Management**: Create, edit, delete categories
- **URL Management**: Add, edit, toggle search sites
- **Search Interface**: Quick access to search sites
- **User Preferences**: Personalized experience

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8484/api
```

## 🎨 Styling

### Mantine UI
The application uses Mantine UI for consistent, modern components:
- **Theme**: Custom theme with JetBrains font
- **Components**: Pre-built, accessible components
- **Hooks**: Useful React hooks for state management
- **Styling**: CSS-in-JS with Mantine's style API

### Custom Styling
- **CSS Variables**: Custom CSS variables for theming
- **Component Styling**: Mantine's style API for component customization
- **Responsive Design**: Mobile-first approach

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout
- **Mobile**: Touch-friendly interface

## 🔗 API Integration

### Services
- **api/index.js**: Main API service
- **categoryService.js**: Category management
- **searchService.js**: Search functionality
- **settingsService.js**: Settings management
- **userService.js**: User management

### Data Fetching
- **TanStack Query**: Efficient data fetching and caching
- **Error Handling**: Graceful error states
- **Loading States**: Loading indicators

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting
- **Any static host**: Upload build files

### Environment Setup
Set `VITE_API_BASE_URL` to your backend API URL in production.

## 🎯 Performance

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Vite optimizations
- **Caching**: TanStack Query caching 