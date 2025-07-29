# 🔍 CoSearch

A customizable search engine that allows users to organize and manage their favorite search sites across different categories.

## ✨ Features

- **Custom Categories**: Create and manage your own search categories
- **Site Management**: Add, edit, and organize your favorite search sites
- **Clean Interface**: Modern, responsive UI built with React and Mantine
- **User Preferences**: Personalized search experience for each user
- **Real-time Updates**: Instant changes to your search configuration

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
   # Edit .env with your MongoDB connection string
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
├── frontend/         # React application
└── README.md         # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** for data storage
- **Mongoose** for database modeling
- **Cloudinary** for image uploads

### Frontend
- **React** with Vite
- **Mantine UI** for components
- **TanStack Query** for data fetching
- **React Router** for navigation

## 📖 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please create an issue in the repository. 