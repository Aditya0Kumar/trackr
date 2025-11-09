# 🏗️ Trackr - Construction Site Progress Tracker

A full-stack web application for tracking daily construction site progress with photo documentation. Perfect for construction managers, site supervisors, and contractors to maintain detailed records of work completed, materials used, and worker attendance.

## ✨ Features

- 📸 **Photo Documentation**: Upload multiple photos for each daily report
- 📊 **Daily Reports**: Track site name, work done, materials used, and worker count
- 🔐 **User Authentication**: Secure login and registration system
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🗂️ **Report History**: View all past reports with filtering options
- 🔒 **Protected Routes**: Private areas accessible only to authenticated users

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM v6
- Axios for API calls
- Tailwind CSS for styling
- Vite as build tool

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository

### 2. Install Frontend Dependencies

### 3. Install Backend Dependencies

### 4. Environment Setup
Create `server/.env` file:

### 4. Environment Setup
Create `server/.env` file:

### 6. Run the Application

The app will open at `http://localhost:5173` (frontend) with backend at `http://localhost:5000`

## 📁 Project Structure

trackr/
├── src/
│ ├── api/
│ │ └── axios.js # API configuration
│ ├── assets/ # Images, icons
│ ├── components/
│ │ ├── Navbar.jsx # Navigation bar
│ │ ├── PrivateRoute.jsx # Protected route wrapper
│ │ └── ReportCard.jsx # Report display component
│ ├── context/
│ │ └── AuthContext.jsx # Authentication state management
│ ├── pages/
│ │ ├── Dashboard.jsx # Main dashboard
│ │ ├── AddReport.jsx # Daily report form
│ │ ├── Reports.jsx # View all reports
│ │ ├── Login.jsx # User login
│ │ └── Register.jsx # User registration
│ ├── App.jsx # Main app component
│ ├── main.jsx # App entry point
│ └── index.css # Global styles
├── server/
│ ├── config/
│ │ └── db.js # Database connection
│ ├── controllers/ # Route handlers
│ ├── middleware/ # Auth middleware
│ ├── models/
│ │ ├── User.js # User model
│ │ └── Report.js # Report model
│ ├── routes/
│ │ ├── authRoutes.js # Authentication routes
│ │ └── reportRoutes.js # Report CRUD routes
│ └── server.js # Express server
├── public/ # Static files
├── uploads/ # Uploaded images (auto-created)
├── package.json
└── vite.config.js


## 🚀 Usage

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **Add Report**: Click "Add Report" to document daily progress
   - Enter site name
   - Describe work completed
   - List materials used
   - Record worker count
   - Upload photos of the work
4. **View Reports**: Access all historical reports with images
5. **Dashboard**: See overview of your construction tracking activity

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Reports
- `POST /api/reports` - Create new daily report (with images)
- `GET /api/reports` - Get all reports for logged-in user
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

## 🐛 Known Issues & Fixes Needed

See the issues section of this repository for current bugs and planned improvements.

## 📄 License

MIT License - feel free to use this project for your construction tracking needs!

## 👤 Author

**Aditya Kumar**
- GitHub: [@Aditya0Kumar](https://github.com/Aditya0Kumar)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

**Made with ❤️ for construction site management**