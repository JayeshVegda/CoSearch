# 🔍 CoSearch

A customizable search engine that allows users to organize and manage their favorite search sites across different categories.

## ✨ Features

- **Custom Categories**: Create and manage your own search categories
- **Site Management**: Add, edit, and organize your favorite search sites
- **Clean Interface**: Modern, responsive UI built with React and Mantine
- **User Preferences**: Personalized search experience for each user
- **Real-time Updates**: Instant changes to your search configuration
- **Admin Dashboard**: Manage users and system settings
- **Image Upload**: Upload custom icons for your search sites
- **Dark/Light Mode**: Beautiful theme support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cosearch.git
   cd cosearch
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your MongoDB connection string and other settings
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8484

## 📁 Project Structure

```
CoSearch/
├── backend/          # Node.js API server
│   ├── controllers/  # API controllers
│   ├── middleware/   # Express middleware
│   ├── models/       # Database models
│   ├── router/       # API routes
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
├── frontend/         # React application
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   └── utils/        # Utility functions
├── DEPLOYMENT.md     # Deployment guide
└── README.md         # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** for data storage
- **Mongoose** for database modeling
- **Cloudinary** for image uploads
- **JWT** for authentication
- **Winston** for logging
- **Helmet** for security

### Frontend
- **React** with Vite
- **Mantine UI** for components
- **TanStack Query** for data fetching
- **React Router** for navigation
- **Axios** for HTTP requests

## 🌐 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy Options:
- **Vercel** (Frontend) + **Railway** (Backend)
- **Docker** with docker-compose
- **Traditional VPS** with PM2 and Nginx

## 📖 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server
npm run test         # Run tests
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
```

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ESLint and Prettier for code formatting
- Follow the existing code structure
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [troubleshooting section](./DEPLOYMENT.md#troubleshooting)
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Updates

Stay updated with the latest changes:
- Watch the repository for releases
- Check the [changelog](./CHANGELOG.md) for version history
- Follow the deployment guide for updates

## 📊 Status

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green)
![License](https://img.shields.io/badge/License-MIT-yellow) 