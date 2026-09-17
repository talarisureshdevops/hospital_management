# 🏥 Hospital Management System (HMS)

A full-stack **Hospital Management System** designed to manage hospital operations such as patient records, doctor management, appointments, pharmacy inventory, room allocation, and staff management.

This system provides a centralized platform for hospital administrators and staff to efficiently handle hospital workflows.

---

# 📌 Features

- 🔐 Secure Authentication (JWT based login)
- 👨‍⚕️ Doctor Management
- 🧑‍🤝‍🧑 Patient Management
- 📅 Appointment Scheduling
- 💊 Medicine Inventory Management
- 💉 Medicine Issue Tracking
- 🏥 Room Management
- 🛏 Room Assignment System
- 📋 Patient Medical History
- 👩‍💼 Staff Management

---

# 🏗 System Architecture

```
Frontend (HTML, CSS, JS)
        │
        ▼
REST API (Node.js + Express)
        │
        ▼
PostgreSQL Database
```

---

# 📂 Project Structure

```
hospital-management-system
│
├── HMS-frontend
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── patients.html
│   ├── doctors.html
│   ├── appointments.html
│   ├── medicines.html
│   ├── rooms.html
│   └── css/
│
├── HMS-backend
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   ├── medicines.js
│   │   ├── medicine_issues.js
│   │   ├── rooms.js
│   │   ├── room_assignments.js
│   │   ├── patient_history.js
│   │   └── staff.js
│   │
│   └── middleware/
│       └── auth.js
│
├── HMS-db
│   └── schema.sql
│
└── README.md
```

---

# ⚙️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- Bootstrap

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt password hashing

### Database
- PostgreSQL

### Deployment
- Render (Backend Hosting)

---

# 🚀 Installation & Setup

## 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/hospital-management-system.git
cd hospital-management-system
```

---

## 2️⃣ Setup Backend

Navigate to backend folder:

```bash
cd HMS-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Run the server:

```bash
node server.js
```

Server will start on:

```
http://localhost:3001
```

---

## 3️⃣ Setup Database

Import the database schema:

```
HMS-db/schema.sql
```

This will create the required tables such as:

- users
- patients
- doctors
- appointments
- medicines
- rooms
- staff
- patient_history

---

## 4️⃣ Run Frontend

Open:

```
HMS-frontend/index.html
```

in your browser.

---

# 🔑 Authentication

The system uses **JWT (JSON Web Tokens)** for secure authentication.

Login returns a token which is stored in the browser and used for API requests.

Example Authorization header:

```
Authorization: Bearer <token>
```

---

# 📡 API Modules

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Users
```
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

### Patients
```
GET /api/patients
GET /api/patients/:id
```

### Doctors
```
GET /api/doctors
POST /api/doctors
PUT /api/doctors/:id
DELETE /api/doctors/:id
```

### Appointments
```
GET /api/appointments
POST /api/appointments
PUT /api/appointments/:id
DELETE /api/appointments/:id
```

### Medicines
```
GET /api/medicines
POST /api/medicines
DELETE /api/medicines/:id
```

### Rooms
```
GET /api/rooms
POST /api/rooms
POST /api/rooms/:id/vacate
```

### Staff
```
GET /api/staff
POST /api/staff
DELETE /api/staff/:id
```

---

# 📊 Future Improvements

- Dashboard analytics
- Role-based UI
- Email notifications
- Billing system
- AI-based patient insights
- Mobile responsive interface

---

# 👨‍💻 Author

**Adhvaith Sibu**
Computer Science Student  


---

# 📜 License

This project is created for **educational and academic purposes**.
