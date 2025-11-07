import Link from "next/link";
import { Scale, Leaf, BarChart3, Users, MapPin, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">UDAL Waste</h1>
              <p className="text-xs text-gray-600">Urban & District Asset Logic</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-700 hover:text-green-600">
              Features
            </Link>
            <Link href="/estimate" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Start Estimation
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Gram Panchayat Integrated Solution</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Waste Weight Estimation
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Revolutionary photo-based waste management system for Gram Panchayats. 
            Simply capture a photo and let AI calculate the waste weight instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/estimate" 
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Scale className="h-5 w-5" />
              Estimate Waste Now
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;5s</div>
              <div className="text-gray-600">Processing Time</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl font-bold text-green-600 mb-2">11+</div>
              <div className="text-gray-600">Waste Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Scale className="h-8 w-8 text-green-600" />}
              title="AI Weight Estimation"
              description="Advanced Gemini AI analyzes photos to estimate waste weight with high accuracy"
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-green-600" />}
              title="Geo-Location Tracking"
              description="GPS-enabled collection tracking for complete transparency and accountability"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-green-600" />}
              title="Real-time Analytics"
              description="Live dashboards showing collection statistics, trends, and performance metrics"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-green-600" />}
              title="Multi-Level Hierarchy"
              description="Supports Zilla → Block → Gram Panchayat → Ward structure"
            />
            <FeatureCard
              icon={<Leaf className="h-8 w-8 text-green-600" />}
              title="Material Classification"
              description="Identifies 11+ waste types: plastic, paper, organic, e-waste, and more"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-green-600" />}
              title="Quality Assurance"
              description="Confidence scores, verification workflow, and quality control measures"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Capture Photo"
              description="Collectors take a photo of the waste using their mobile device"
            />
            <StepCard
              number="2"
              title="AI Analysis"
              description="Gemini AI analyzes the image to identify material type and estimate volume"
            />
            <StepCard
              number="3"
              title="Get Results"
              description="Receive instant weight calculation with detailed breakdown and confidence score"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Waste Management?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the revolution in rural waste management. Get started with UDAL Waste today.
          </p>
          <Link 
            href="/estimate" 
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-green-500" />
            <span className="text-xl font-bold text-white">UDAL Waste</span>
          </div>
          <p className="mb-4">AI-Powered Waste Management for Gram Panchayats</p>
          <p className="text-sm text-gray-400">
            Built with Next.js & Google Gemini AI • © 2025 UDAL Waste
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2 text-gray-900">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h4 className="text-xl font-semibold mb-2 text-gray-900">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

