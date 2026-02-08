# SmartChart Pro - Portfolio Demo

> **Healthcare EMR System for Assisted Living Facilities**

A full-stack healthcare application built with Next.js, TypeScript, and React that digitizes care documentation workflows for assisted living facilities.

## 🌟 Live Demo

**[View Live Demo](#)** _(Add your deployment URL here)_

### Demo Accounts

| Role  | Email            | Password     |
| ----- | ---------------- | ------------ |
| Admin | `admin@demo.com` | any password |
| CNA   | `cna@demo.com`   | any password |

> **Note:** This is a portfolio demo running in read-only mode. All changes are simulated and not persisted.

---

## 📋 Project Overview

SmartChart Pro replaces paper-based workflows with a digital system that manages daily operations for assisted living facilities. The application streamlines care documentation, shift management, and regulatory compliance.

### Key Features

#### 🎯 Real-Time Dashboard

- Monitor active staff sessions in real-time
- Track resident assignments across shifts
- View session progress and completion status
- Live updates for shift changes and activities

#### 📱 iPad-Optimized Charting Interface

- Touch-friendly UI designed for daily use by care staff
- Optimized for iPad viewport sizes (768px - 1024px)
- Eliminates documentation errors from illegible handwriting
- Streamlined workflow for ADL (Activities of Daily Living) charting
- Landscape and portrait orientation support

#### 📊 Shift Management System

- Visual shift scheduling (Morning, Evening, Night)
- CNA availability management
- Resident assignments per shift
- Shift handoff workflow
- Time tracking and attendance

#### 📄 Automated PDF Report Generation

- Professional PDF reports generated on shift completion
- Includes facility information, CNA details, and all charting entries
- Reduces administrative overhead
- Complete audit trail for compliance

#### 🔐 Secure Role-Based Authentication

- Admin and CNA user roles
- Master password override feature for operational flexibility
- Session management and tracking
- Secure password hashing

#### 📈 Session Tracking

- Active charting sessions monitoring
- Progress tracking through workflow steps
- Session history and analytics
- Duration tracking and timestamps

#### ✅ Regulatory Compliance Features

- Complete audit trail (who, what, when)
- Timestamped entries for all activities
- Required field validation
- HIPAA-compliant data handling

---

## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management
- **Zustand** - Client state management
- **React PDF** - PDF generation

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication
- **Prisma ORM** - Database ORM (production)
- **PostgreSQL** - Database (production)

### Demo Mode

- **Mock Data Layer** - JSON-based data for demo
- **Simulated API** - No database required
- **Client-side PDF Generation** - Works without backend

---

## 🚀 Features Showcase

### For Administrators

1. **Dashboard Overview**
   - View all active CNA sessions
   - Monitor resident assignments
   - Track shift coverage
   - Review pending reports

2. **Staff Management**
   - Manage CNA accounts
   - Set shift availability
   - Track certifications
   - View performance metrics

3. **Resident Management**
   - Comprehensive resident profiles
   - Medical history and conditions
   - Medication tracking
   - Emergency contacts

4. **Reports & Analytics**
   - View completed charting reports
   - Export PDF reports
   - Review and approve documentation
   - Compliance tracking

### For CNAs (Certified Nursing Assistants)

1. **Charting Workflow**
   - Select residents for shift
   - Document ADL activities
   - Add notes and observations
   - Review and submit

2. **ADL Documentation**
   - Bathing assistance
   - Dressing assistance
   - Eating/feeding
   - Toileting
   - Mobility assistance
   - Health checks

3. **Session Management**
   - Start/resume charting sessions
   - Track progress through workflow
   - Review entries before submission
   - Automatic PDF generation

---

## 💻 Running Locally

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd smartchartpro

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with demo credentials.

### Demo Mode Configuration

The demo mode is controlled by the `NEXT_PUBLIC_DEMO_MODE` environment variable:

```env
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

When `NEXT_PUBLIC_DEMO_MODE=true`:

- No database connection required
- Uses mock data from `src/lib/mock-data/`
- All mutations are simulated (not persisted)
- Demo banner displayed at top
- Quick login buttons on login page

---

## 📱 iPad Optimization

The charting interface is specifically optimized for iPad use:

- **Touch Targets**: Minimum 44px for easy tapping
- **Responsive Layout**: Optimized for 768px - 1024px viewports
- **Orientation Support**: Works in both landscape and portrait
- **Large Buttons**: Easy-to-tap action buttons
- **Clear Typography**: Readable text sizes for quick scanning
- **Minimal Scrolling**: Content fits within viewport when possible

### Tested Devices

- iPad (9th generation) - 10.2"
- iPad Air - 10.9"
- iPad Pro - 11" and 12.9"

---

## 🏗️ Project Structure

```
smartchartpro/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── charting/          # CNA charting workflow
│   │   ├── login/             # Authentication
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── atoms/             # Basic UI components
│   │   ├── molecules/         # Composite components
│   │   └── pdf/               # PDF templates
│   ├── lib/                   # Utilities and helpers
│   │   ├── mock-data/         # Demo mode data
│   │   ├── mock-db.ts         # Mock database client
│   │   └── demo-config.ts     # Demo configuration
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand state stores
│   └── types/                 # TypeScript types
├── prisma/                    # Database schema (production)
└── public/                    # Static assets
```

---

## 🎨 Design Decisions

### Why iPad-First?

Care staff spend most of their time moving between residents. An iPad provides:

- Portability for bedside documentation
- Large enough screen for detailed forms
- Touch interface for quick input
- Long battery life for full shifts

### Why Real-Time Updates?

Administrators need to:

- Monitor staff activity during shifts
- Respond quickly to coverage gaps
- Track documentation completion
- Ensure regulatory compliance

### Why Automated PDF Reports?

- Reduces administrative overhead
- Provides professional documentation
- Creates audit trail for compliance
- Easy to share with families and regulators

---

## 📊 Development Timeline

- **06/2024 - 08/2024**: Requirements gathering and design
- **08/2024 - 10/2024**: Core development and testing
- **10/2024 - 12/2024**: Production deployment and training
- **12/2024 - Present**: Maintenance and feature enhancements

---

## 🔒 Security & Compliance

### HIPAA Compliance (Production)

- Encrypted data storage
- Secure authentication
- Audit logging
- Access controls
- Data retention policies

### Demo Mode Security

- No real patient data
- Simulated workflows only
- No persistent storage
- Safe for public demonstration

---

## 📈 Impact

### Before SmartChart Pro

- ❌ Paper-based documentation
- ❌ Illegible handwriting issues
- ❌ Lost or misplaced forms
- ❌ Time-consuming manual reports
- ❌ Difficult to track compliance

### After SmartChart Pro

- ✅ Digital documentation
- ✅ Clear, typed entries
- ✅ Centralized data storage
- ✅ Automated report generation
- ✅ Easy compliance tracking

---

## 🚀 Deployment

### Production Deployment (Original)

- **Platform**: AWS (EC2, RDS, S3, VPC)
- **Database**: PostgreSQL on RDS
- **Storage**: S3 for PDF reports
- **Security**: VPC with security groups, encrypted storage

### Demo Deployment (Portfolio)

- **Platform**: Vercel
- **Database**: None (mock data)
- **Storage**: None (client-side PDF generation)
- **Cost**: Free tier

---

## 📝 License

This is a portfolio project. All rights reserved.

---

## 👤 Contact

**Your Name**

- Portfolio: [your-portfolio.com](#)
- LinkedIn: [linkedin.com/in/yourprofile](#)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

Built for a real assisted living facility to solve real operational challenges. This demo version showcases the technical implementation while protecting sensitive healthcare data.

---

**Note**: This is a portfolio demonstration. The production version includes additional security features, database integration, and HIPAA compliance measures not shown in this demo.
