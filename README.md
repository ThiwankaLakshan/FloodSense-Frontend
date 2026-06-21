# FloodSense Frontend

Real-time flood monitoring dashboard for Sri Lanka's Western Province. Built with React, Vite, and TailwindCSS.

## 🌊 Overview

FloodSense Frontend is a modern, responsive web application that provides real-time visualization of flood risks, weather data, and alert management. The application features interactive maps, data charts, and an intuitive admin dashboard for monitoring flood conditions across multiple locations.

### Key Features

- 🗺️ **Interactive Risk Maps** - Leaflet-powered maps with color-coded risk zones
- 📊 **Data Visualization** - Real-time charts using Recharts for weather and risk trends
- 🎨 **Modern UI** - Clean, responsive design with TailwindCSS
- 🔐 **Admin Authentication** - Secure JWT-based admin panel
- 📱 **Mobile Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Powered by Vite for lightning-fast development and builds
- 🔔 **Real-time Notifications** - Toast notifications for alerts and updates
- 📈 **Historical Analytics** - View trends over 24h, 7d, 30d, and 90d periods

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Features Overview](#features-overview)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Deployment](#deployment)

## 🛠️ Tech Stack

### Core Framework
- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server
- **React Router DOM** 7.13.0 - Client-side routing

### UI & Styling
- **TailwindCSS** 3.4.17 - Utility-first CSS framework
- **Lucide React** 0.563.0 - Beautiful icon library
- **React Hot Toast** 2.4.1 - Toast notifications

### Maps & Visualization
- **React Leaflet** 5.0.0 - Interactive maps
- **Leaflet** 1.9.4 - Mapping library
- **Recharts** 3.7.0 - Chart components

### Utilities
- **Axios** 1.13.4 - HTTP client
- **date-fns** 4.1.0 - Date formatting
- **clsx** 2.1.1 - Conditional classNames
- **tailwind-merge** 3.4.0 - Merge Tailwind classes

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^5.1.1",
  "autoprefixer": "^10.4.24",
  "eslint": "^9.39.1",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.17"
}
```

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **npm** 9.x or higher (comes with Node.js)
- **FloodSense Backend** running (see backend README)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/ThiwankaLakshan/FloodSense-Frontend.git
cd FloodSense-Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables** (see next section)

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Application Settings
VITE_APP_NAME=FloodSense
VITE_APP_VERSION=1.0.0

# Map Configuration (Optional)
VITE_MAP_CENTER_LAT=6.9271
VITE_MAP_CENTER_LNG=79.8612
VITE_MAP_ZOOM=10
```

### Environment Variable Details

- **VITE_API_URL**: Backend API base URL (required)
  - Development: `http://localhost:5000/api`
  - Production: Your deployed backend URL

- **VITE_APP_NAME**: Application display name

- **Map Settings**: Default map center and zoom for Colombo, Sri Lanka

## 💻 Development

**Start development server:**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Development Features

- ⚡ **Hot Module Replacement (HMR)** - Instant updates without full reload
- 🔍 **ESLint** - Code quality checks
- 🎨 **Tailwind IntelliSense** - Auto-completion for Tailwind classes

### Available Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run start    # Alias for dev
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🏗️ Building for Production

1. **Create optimized build**
```bash
npm run build
```

This generates a `dist/` folder with optimized assets:
- Minified JavaScript and CSS
- Code splitting for faster loads
- Asset optimization
- Source maps (optional)

2. **Preview production build locally**
```bash
npm run preview
```

3. **Deploy `dist/` folder** to your hosting service

### Build Optimization

Vite automatically handles:
- Tree shaking for smaller bundle size
- Asset hashing for cache busting
- CSS code splitting
- Image optimization

## 📁 Project Structure

```
FloodSense-Frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── index.html
├── src/
│   ├── assets/              # Static assets (images, fonts)
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   │   ├── Login.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── common/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── dashboard/      # Admin dashboard components
│   │   │   └── Dashboard.jsx
│   │   ├── layout/         # Layout components
│   │   │   └── Navbar.jsx
│   │   └── public/         # Public-facing components
│   │       ├── SummaryCards.jsx
│   │       └── RainfallChart.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.js
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── PublicLayout.jsx
│   ├── pages/
│   │   ├── admin/          # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Locations.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── RiskManager.jsx
│   │   │   ├── WeatherManager.jsx
│   │   │   ├── Subscriptions.jsx
│   │   │   └── Logs.jsx
│   │   └── public/         # Public pages
│   │       ├── Home.jsx
│   │       ├── Map.jsx
│   │       ├── Alerts.jsx
│   │       ├── History.jsx
│   │       └── LocationRisk.jsx
│   ├── services/           # API services
│   │   ├── api.js          # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── locationService.js
│   │   └── dashboardService.js
│   ├── utils/
│   │   ├── constants.js    # App constants (risk levels, colors)
│   │   └── helpers.js      # Utility functions
│   ├── App.jsx             # Main App component
│   ├── app.jsx             # App routing
│   ├── main.jsx            # React entry point
│   ├── index.css           # Global styles
│   └── app.css             # Component styles
├── .env                    # Environment variables (gitignored)
├── .env.example            # Environment template
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML entry point
├── package.json
├── postcss.config.js       # PostCSS config
├── tailwind.config.js      # Tailwind configuration
└── vite.config.js          # Vite configuration
```

## 🎯 Features Overview

### 1. Admin Dashboard

**Route:** `/`

Main admin interface showing:
- Real-time risk distribution across locations
- Active alerts and warnings
- Weather trends and statistics
- Location monitoring status

**Components:**
- Summary cards (total locations, critical alerts)
- Risk distribution chart
- Recent alerts table
- Weather data visualizations

### 2. Interactive Map

**Route:** `/map` (public) or `/monitoring` (admin)

Features:
- Color-coded location markers (green/yellow/orange/red)
- Marker clustering for dense areas
- Click markers for detailed risk breakdown
- Real-time updates every 30 minutes
- Pan and zoom controls

**Tech:** React Leaflet + Leaflet.js

### 3. Location Details

**Route:** `/monitoring/:id`

Detailed view for specific location:
- Current weather conditions
- Risk score breakdown (5 factors)
- 24h/72h rainfall data
- Historical trends
- Evacuation instructions

### 4. Alert Management

**Route:** `/alerts`

Admin panel for:
- View sent alerts history
- Alert success/failure status
- Recipient lists
- Alert filtering by risk level

### 5. Risk Assessment

**Route:** `/risk`

Risk analysis tools:
- Real-time risk calculations
- Factor contribution breakdown
- Historical risk trends
- Risk prediction insights

### 6. System Logs

**Route:** `/logs`

System activity monitoring:
- API call logs
- Error tracking
- User actions
- System events

## 🛣️ Routing

### Public Routes
```javascript
/login           # Admin login page
```

### Protected Admin Routes (JWT Required)
```javascript
/                # Dashboard overview
/monitoring      # Location monitoring
/monitoring/:id  # Specific location details
/alerts          # Alert management
/risk            # Risk assessment
/logs            # System logs
```

### Route Protection

```javascript
// PrivateRoute wrapper
<Route path="/" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
```

Routes check for valid JWT token in localStorage. Redirects to `/login` if unauthorized.

## 🔄 State Management

### Context API

**AuthContext** (`src/context/AuthContext.jsx`):
```javascript
{
  user: null,           // Current admin user
  token: null,          // JWT token
  isAuthenticated: false,
  login: (credentials) => {},
  logout: () => {},
  loading: false
}
```

### Local State

Components use React hooks:
- `useState` for local state
- `useEffect` for side effects
- `useContext` for global auth state

## 🔌 API Integration

### Axios Instance

Configured in `src/services/api.js`:

```javascript
// Automatic JWT token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto token refresh on 401
api.interceptors.response.use(
  (response) => response,
  (error) => handleTokenRefresh(error)
);
```

### Service Layer

**locationService.js:**
```javascript
import api from './api';

export const getLocations = () => api.get('/locations');
export const getLocationById = (id) => api.get(`/locations/${id}`);
export const getWeatherHistory = (id, period) => 
  api.get(`/locations/${id}/weather-history?period=${period}`);
```

**authService.js:**
```javascript
export const login = (credentials) => 
  api.post('/admin/login', credentials);
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
```

### API Endpoints

All endpoints defined in `src/utils/constants.js`:

```javascript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/login',
    VERIFY: '/admin/verify'
  },
  LOCATIONS: {
    ALL: '/locations',
    BY_ID: (id) => `/locations/${id}`,
    WEATHER_HISTORY: (id) => `/locations/${id}/weather-history`
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    RISK_DISTRIBUTION: '/dashboard/risk-distribution'
  }
};
```

## 🎨 Styling

### TailwindCSS Configuration

**Custom Colors** (`tailwind.config.js`):
```javascript
colors: {
  'risk-critical': '#EF4444',  // Red
  'risk-high': '#F97316',      // Orange
  'risk-moderate': '#FACC15',  // Yellow
  'risk-low': '#22C55E',       // Green
  primary: '#0B5ED7',          // Deep Blue
  secondary: '#4FD1C5',        // Aqua
}
```

### Risk Level Constants

Defined in `src/utils/constants.js`:
```javascript
export const RISK_LEVELS = {
  CRITICAL: {
    label: 'Critical',
    color: '#DC2626',
    bgColor: 'bg-red-600',
    textColor: 'text-red-600',
    action: 'Evacuate immediately to higher ground'
  },
  // ... other levels
};
```

### Component Styling

**Using Tailwind:**
```javascript
<div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
  <h2 className="text-xl font-bold text-gray-900">Critical Alert</h2>
</div>
```

**Dynamic Classes:**
```javascript
import { RISK_LEVELS } from '@/utils/constants';

<div className={RISK_LEVELS[riskLevel].bgColor}>
  Risk: {RISK_LEVELS[riskLevel].label}
</div>
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure environment variables** in Vercel dashboard

### Netlify

1. **Connect GitHub repository**
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add environment variables** in Netlify dashboard

### Traditional Hosting (nginx)

1. **Build the app**
```bash
npm run build
```

2. **Upload `dist/` folder** to server

3. **Configure nginx:**
```nginx
server {
  listen 80;
  server_name floodsense.com;
  root /var/www/floodsense/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # API proxy
  location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### Environment Variables for Production

Update `.env` for production:
```env
VITE_API_URL=https://api.floodsense.com/api
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚡ Performance Optimization

### Code Splitting

Vite automatically splits code at route level:
```javascript
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
```

### Image Optimization

Use WebP format:
```javascript
<img src="/images/map.webp" alt="Map" loading="lazy" />
```

### Memoization

Use React.memo for expensive components:
```javascript
export default React.memo(RainfallChart);
```

## 🧪 Testing

*Testing setup coming soon*

Planned testing stack:
- Vitest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Route guards for admin pages
- **Auto Token Refresh** - Seamless token renewal
- **XSS Protection** - React's built-in escaping
- **HTTPS Only** - Force HTTPS in production
- **Environment Variables** - Sensitive data never committed

## 🐛 Troubleshooting

### Common Issues

**Build fails with "Module not found":**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API calls fail with CORS error:**
```bash
# Ensure backend CORS is configured for frontend URL
# Backend needs: app.use(cors({ origin: 'http://localhost:5173' }))
```

**Map not displaying:**
```bash
# Install leaflet CSS in index.html or import in component
import 'leaflet/dist/leaflet.css';
```

**Environment variables not working:**
```bash
# Must prefix with VITE_
# Restart dev server after .env changes
```

**Tailwind classes not applying:**
```bash
# Rebuild Tailwind
npm run build

# Check tailwind.config.js content paths
content: ["./src/**/*.{js,jsx,ts,tsx}"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- Use functional components with hooks
- Follow ESLint rules
- Use Tailwind for styling (avoid inline styles)
- Keep components small and focused
- Add JSDoc comments for complex functions

## 📝 License

ISC License - See LICENSE file for details

## 👨‍💻 Author

**Thiwanka Lakshan**

## 🔗 Related Projects

- [FloodSense Backend](https://github.com/ThiwankaLakshan/FloodSense-Backend) - REST API

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Contact: thiwankalakshan@example.com

---

**Built with ❤️ for safer communities in Sri Lanka**
