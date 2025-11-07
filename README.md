# 🌿 UDAL Waste Management System

**Urban & District Asset Logic** - An AI-powered waste weight estimation system designed for Gram Panchayat level integration in India.

## 🎯 Features

### Core Features
- **📸 Photo-based Waste Weight Estimation** - Upload a photo and get instant AI-powered weight calculations
- **🤖 Gemini AI Integration** - Advanced image analysis for material type and volume estimation  
- **📊 Multi-material Support** - Identifies 11+ waste categories (plastic, paper, organic, e-waste, etc.)
- **📍 GPS Tracking** - Geo-location enabled for transparent collection tracking
- **🏛️ Administrative Hierarchy** - Complete support for Zilla → Block → Gram Panchayat → Ward structure

### Additional Features
- Real-time analytics and dashboards
- Confidence scoring for estimations
- Container fullness detection
- Moisture level assessment
- Contamination level detection
- Collection scheduling and logs
- Verification workflow
- QR code and RFID support for bins

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (via Prisma ORM)
- **AI**: Google Gemini 1.5 Flash API
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Basic understanding of Next.js and React

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd "c:\Users\prane\OneDrive\Desktop\All Projects\UDAL-Waste\udal-waste-app"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Gemini API Key (REQUIRED - Get from https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=your_actual_gemini_api_key_here
```

⚠️ **IMPORTANT**: Replace `your_actual_gemini_api_key_here` with your real Gemini API key!

### 4. Set Up the Database

The database has already been created and seeded, but if you need to reset it:

```bash
# Reset database
npx prisma db push

# Seed with demo data
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 📱 How to Use

### For Quick Testing (Demo Mode)

1. Navigate to `/estimate` or click "Start Estimation" on the homepage
2. Upload a waste photo (any image will work for testing)
3. Leave the IDs as default (they'll use demo data)
4. Optionally fill in container type and volume
5. Click "Estimate Weight"
6. View AI-powered results with confidence scores

### Demo Credentials

The system comes pre-seeded with test data:
- **Panchayat**: Demo Panchayat (For Testing)
- **Wards**: Ward 1 - Central, Ward 2 - East
- **Collectors**: Ramesh Kumar, Priya Shetty
- **Supervisor**: Suresh Nayak

## 🗂️ Project Structure

```
udal-waste-app/
├── app/
│   ├── api/
│   │   ├── estimate/route.ts        # Main AI estimation endpoint
│   │   ├── estimations/route.ts     # Fetch estimation history
│   │   └── panchayats/route.ts      # Panchayat management
│   ├── estimate/
│   │   └── page.tsx                 # Estimation form UI
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Homepage
│   └── globals.css                  # Global styles
├── lib/
│   ├── gemini.ts                    # Gemini AI configuration
│   └── prisma.ts                    # Prisma client
├── prisma/
│   ├── schema.prisma                # Database schema
│   ├── seed.ts                      # Seed script
│   └── dev.db                       # SQLite database
└── public/
    └── uploads/                     # Uploaded waste images
```

## 📊 Database Schema

The system uses a comprehensive schema supporting:

- **ZillaPanchayat** → District level
- **Block** → Taluk/Block level
- **GramPanchayat** → Village level
- **Ward** → Ward/Zone level
- **Collector** → Waste collection personnel
- **WasteEstimation** → AI estimation results
- **CollectionLog** → Collection schedule tracking
- **Container** → Bin/container registry

## 🔑 Key API Endpoints

### POST `/api/estimate`
Main estimation endpoint - uploads image and returns weight calculation

### GET `/api/estimations`
Fetch estimation history with filters

### GET `/api/panchayats`
Fetch all Gram Panchayats

## 🧪 Material Types & Densities

The system uses real-world bulk density values (kg/L):

| Material | Density (kg/L) |
|----------|----------------|
| Mixed MSW | 0.15 |
| Plastic | 0.04 |
| Paper | 0.12 |
| Glass | 0.50 |
| Metal | 0.35 |
| Organic | 0.60 |
| Textiles | 0.10 |
| E-waste | 0.40 |
| Construction Debris | 0.80 |

## 🚦 Next Steps

- Dashboard with analytics
- User authentication
- Mobile app
- Report generation
- Multi-language support

## 👨‍💻 Developer

Built as an internship project for **Zilla Panchayat** waste management initiative.

---

**Built with ❤️ using Next.js & Google Gemini AI**

