<div align="center">

# 🔍 CoSearch

### **Your Personalized Multi-Engine Search Aggregator**

*Search across all your favorite engines with a single query* ✨

**[🌐 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#)**

---

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.16-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![Mantine](https://img.shields.io/badge/Mantine-8.1-339AF0?style=for-the-badge&logo=mantine&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

---

## 📖 About

CoSearch is a customizable multi-engine search aggregator that lets you search across 50+ search engines simultaneously with a single query. Organize engines into categories, customize your experience, and search faster.

---

## ✨ Features

- 🔎 **Multi-Engine Search** - Search across Google, Bing, DuckDuckGo, and more
- 🎨 **Customizable Categories** - Organize engines by type (News, Images, Videos, Shopping, AI)
- 🌓 **Dark/Light Mode** - Beautiful UI with theme switching
- ⚙️ **User Preferences** - Save your settings and preferences
- 🛡️ **Secure & Fast** - Built with security and performance in mind

---

## 💻 Usage

1. **Search:** Select a category, enter your query, and click search
2. **Customize:** Go to Settings to manage categories and enable/disable engines
3. **Organize:** Add custom categories and upload icons for search engines
4. **Theme:** Toggle between light and dark mode using the theme button
---
## 📽️ Demo

https://github.com/user-attachments/assets/d67de1d2-6b11-4329-8d80-c0fd5d0c3cc6

---
## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CoSearch.git
   cd CoSearch
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

3. **Setup environment**

   **Backend:** Copy `backend/env.example` to `backend/.env` and configure:
   ```env
   PORT=8484
   MONGODB_URI=mongodb://localhost:27017/cosearch
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

   **Frontend:** Create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8484/api
   ```

4. **Run the application**

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8484

---


---

## 📁 Project Structure

```
CoSearch/
├── frontend/          # React app (Mantine UI, Vite)
├── backend/           # Node.js API (Express, MongoDB)
└── package.json       # Root configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Jayesh Vegda**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

<div align="center">

**Made with ❤️ by Jayesh Vegda**

⭐ If you found this project helpful, please give it a star on GitHub!

</div>
