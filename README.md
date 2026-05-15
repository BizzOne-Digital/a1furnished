# A1 Furnished Homes Canada — Full Stack MERN Website

Complete website + admin panel built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (for image uploads — free tier)

---

## 📁 Project Structure

```
a1furnished/
├── backend/              ← Node.js + Express API
│   ├── config/
│   │   ├── cloudinary.js   ← Image upload config
│   │   └── seed.js         ← Database seeder
│   ├── controllers/
│   │   └── propertyController.js
│   ├── middleware/
│   │   └── auth.js         ← JWT middleware
│   ├── models/
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   ├── User.js
│   │   └── Inquiry.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── inquiryRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/             ← React app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   └── AdminLayout.js
    │   │   ├── common/
    │   │   │   ├── Navbar.js
    │   │   │   ├── Footer.js
    │   │   │   └── PublicLayout.js
    │   │   └── property/
    │   │       └── PropertyCard.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminLoginPage.js
    │   │   │   ├── AdminDashboard.js
    │   │   │   ├── AdminProperties.js
    │   │   │   ├── AdminPropertyForm.js
    │   │   │   ├── AdminBookings.js
    │   │   │   ├── AdminBookingDetail.js
    │   │   │   ├── AdminInquiries.js
    │   │   │   └── AdminSettings.js
    │   │   └── public/
    │   │       ├── HomePage.js
    │   │       ├── PropertiesPage.js
    │   │       ├── PropertyDetailPage.js
    │   │       ├── BookingPage.js
    │   │       ├── BookingConfirmationPage.js
    │   │       ├── ContactPage.js
    │   │       └── AboutPage.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    └── package.json
```

---

## ⚙️ Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your values
```

Required `.env` values:
```env
PORT=5000
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/a1furnished
JWT_SECRET=your_super_secret_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@a1suites.ca
ADMIN_PASSWORD=Admin@123456
CLIENT_URL=http://localhost:3000
```

### 3. Seed Database
```bash
npm run seed
```
This creates 3 sample properties + the admin account.

### 4. Start Backend
```bash
npm run dev     # development with nodemon
npm start       # production
```
API runs on: **http://localhost:5000**

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Add Logo
Place your logo file at: `frontend/public/logo.png`

### 3. Configure API URL (optional)
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```
(The proxy in package.json handles this for local dev automatically)

### 4. Start Frontend
```bash
npm start
```
App runs on: **http://localhost:3000**

---

## 🌐 Pages & Routes

### Public Website
| Route | Page |
|-------|------|
| `/` | Homepage (hero, featured properties, features) |
| `/properties` | All properties with filters |
| `/properties/:slug` | Property detail with gallery |
| `/book/:slug` | 3-step booking wizard |
| `/booking-confirmed/:id` | Booking confirmation |
| `/about` | About page |
| `/contact` | Contact form |

### Admin Panel
| Route | Page |
|-------|------|
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard with stats & charts |
| `/admin/properties` | Properties table (CRUD) |
| `/admin/properties/new` | Add property |
| `/admin/properties/edit/:id` | Edit property |
| `/admin/bookings` | All bookings |
| `/admin/bookings/:id` | Booking detail + status update |
| `/admin/inquiries` | Inquiries with reply panel |
| `/admin/settings` | Password change + user management |

---

## 🔐 Admin Credentials

After running `npm run seed`:
```
Email:    admin@a1suites.ca
Password: Admin@123456
```
> Change these in your `.env` file before seeding.

---

## 🔌 API Endpoints

### Properties
```
GET    /api/properties              Public - list with filters
GET    /api/properties/:slug        Public - single property
POST   /api/properties              Admin - create
PUT    /api/properties/:id          Admin - update
DELETE /api/properties/:id          Admin - delete
POST   /api/properties/:id/images   Admin - upload images
DELETE /api/properties/:id/images/:imageId  Admin - delete image
POST   /api/properties/:id/reviews  Public - add review
POST   /api/properties/:id/views    Public - increment view count
```

### Bookings
```
POST   /api/bookings               Public - create booking
GET    /api/bookings               Admin - all bookings (filter by status, search)
GET    /api/bookings/:id           Admin - single booking
PUT    /api/bookings/:id           Admin - update status/notes
GET    /api/bookings/check/:propertyId  Public - availability check
```

### Inquiries
```
POST   /api/inquiries              Public - submit inquiry
GET    /api/inquiries              Admin - all inquiries
PUT    /api/inquiries/:id          Admin - update/reply
```

### Auth
```
POST   /api/auth/login             Login → JWT token
GET    /api/auth/me                Get current user
PUT    /api/auth/password          Change password
```

### Admin
```
GET    /api/admin/stats            Dashboard statistics + charts
GET    /api/admin/users            List admin users (superadmin)
POST   /api/admin/users            Create admin user (superadmin)
DELETE /api/admin/users/:id        Delete admin user (superadmin)
```

---

## 🚢 Deployment

### Backend (Railway / Render / Heroku)
1. Set all environment variables
2. Deploy from the `/backend` folder
3. Make sure MongoDB Atlas allows connections from your server IP

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend.railway.app/api`
2. Deploy from the `/frontend` folder
3. Build command: `npm run build`

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS with CSS Variables |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Images | Cloudinary + Multer |
| Email | Nodemailer |

---

## 📞 Contact & Branding

- **Phone**: +1 (647) 723-4567
- **Email**: info@a1suites.ca
- **Brand Colors**: Navy `#1a2744`, Red `#c8102e`
- **Fonts**: Montserrat (headings), Lato (body)

---

*Built with ❤️ for A1 Furnished Homes Canada*
