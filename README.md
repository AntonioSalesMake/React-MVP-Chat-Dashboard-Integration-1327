# SalesMake Dashboard

A comprehensive project management dashboard for SalesMake with real-time chat, progress tracking, and user management.

## 🚀 Features

- **Real-time Chat Interface** - Interactive chat with progress notifications
- **Project Dashboard** - Track progress, emails sent, meetings booked
- **User Management** - Role-based access (Admin, Specialist, Client)
- **Ideal Customer Profiling** - Manage target customer segments
- **Project Assignment** - Assign users to specific projects
- **Progress Tracking** - Visual progress bars with step-by-step tracking

## 🏗️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Icons
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: React Context
- **Build Tool**: Vite
- **Authentication**: Supabase Auth with email/password

## 🗄️ Database Schema

The application uses three main tables:

1. **user_profiles_um2024** - User information and roles
2. **projects_um2024** - Project details and progress
3. **project_assignments_um2024** - User-project relationships

## 👥 User Roles

- **Admin**: Full access, can create projects and manage users
- **Specialist**: Can update assigned projects
- **Client**: Can view assigned projects (read-only)

## 🧪 Test Accounts

You can test the application with these pre-configured accounts:

- **Admin**: admin@salesmate.com
- **Client**: john.smith@techcorp.com  
- **Specialist**: sarah.johnson@specialist.com

*Note: You'll need to set passwords for these accounts through Supabase Auth or create new accounts via the sign-up flow.*

## 🛠️ Setup Instructions

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Supabase Configuration**: Already configured with project credentials
4. **Start development server**: `npm run dev`

## 🔐 Security Features

- Row Level Security (RLS) policies
- Role-based data access
- Secure authentication with Supabase Auth
- Protected API endpoints

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for consistent styling
- Responsive grid layouts
- Touch-friendly interfaces

## 🚀 Deployment

The application is ready for deployment with:
- Optimized build process
- Environment-based configuration
- Production-ready Supabase setup

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 Project Structure

```
src/
├── components/          # React components
│   ├── AuthProvider.jsx # Authentication context
│   ├── ChatDashboard.jsx # Main dashboard layout
│   ├── ChatInterface.jsx # Chat component
│   ├── Dashboard.jsx    # Project dashboard
│   ├── LoginForm.jsx    # Authentication form
│   ├── UserManagement.jsx # User management modal
│   └── ...
├── common/              # Shared utilities
│   └── SafeIcon.jsx     # Icon wrapper component
├── lib/                 # Configuration
│   └── supabase.js      # Supabase client setup
└── App.jsx              # Main application component
```

## 🎯 Key Features Explained

### Progress Tracking
- Visual progress bars with percentage completion
- Step-by-step milestone tracking
- Automatic progress notifications in chat

### User Management  
- Invite new users via email
- Assign users to specific projects
- Role-based permissions system

### Real-time Chat
- Project-specific chat interface
- Automated progress notifications
- Message history and timestamps

### Dashboard Analytics
- Email campaign metrics
- Meeting booking statistics  
- Editable project information
- Ideal Customer Profile management

## 🔄 Data Flow

1. **Authentication** - Supabase Auth handles user login/signup
2. **Profile Creation** - User profiles linked to auth accounts
3. **Project Assignment** - Many-to-many relationship between users and projects
4. **Real-time Updates** - Changes sync across all connected clients
5. **Role Enforcement** - RLS policies ensure data security

## 🎨 UI/UX Features

- Clean, modern interface design
- Intuitive navigation and controls
- Responsive layout for all screen sizes
- Consistent color scheme and typography
- Loading states and error handling
- Smooth animations and transitions

---

**Built with ❤️ for SalesMake**