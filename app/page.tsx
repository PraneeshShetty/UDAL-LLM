import Link from "next/link";
import { Camera, MapPin, BarChart3, Leaf, Users, CheckCircle2, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2d9f5c] to-[#218548] rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">UDAL Waste</div>
                <div className="text-[10px] text-gray-500 -mt-1">Smart Waste Management</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[#2d9f5c] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#2d9f5c] transition-colors">
                How it Works
              </a>
              <Link 
                href="/estimate"
                className="bg-[#2d9f5c] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#218548] transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern & Clean */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#e8f5ed] rounded-full text-sm font-medium text-[#2d9f5c] mb-6">
                <Zap className="w-4 h-4" />
                <span>Powered by Google Gemini AI</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Waste Management<br />
                <span className="text-[#2d9f5c]">Made Simple</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                No more guesswork. Snap a photo, get instant weight estimates powered by AI. 
                Built for Gram Panchayats to modernize waste collection tracking.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  href="/estimate"
                  className="inline-flex items-center justify-center gap-2 bg-[#2d9f5c] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#218548] transition-all shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
                >
                  <Camera className="w-5 h-5" />
                  Try It Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <button className="inline-flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all border border-gray-200">
                  Watch Demo
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900">11+</div>
                  <div className="text-sm text-gray-600">Waste Types</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">&lt;5s</div>
                  <div className="text-sm text-gray-600">Processing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">95%+</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-[#e8f5ed] to-[#d1e7dd] rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#2d9f5c] rounded-xl flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Quick Estimation</div>
                      <div className="text-sm text-gray-600">Just snap & analyze</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl h-48 flex items-center justify-center mb-4">
                    <div className="text-center text-gray-400">
                      <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">Upload waste photo</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#e8f5ed] rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Estimated Weight</span>
                      <span className="text-lg font-bold text-[#2d9f5c]">4.5 kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Material Type</span>
                      <span className="text-sm font-semibold text-blue-700">Mixed Plastic</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#ff9800] rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#2d9f5c] rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Card Grid */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete solution for modern waste management in rural India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="w-6 h-6" />}
              title="AI-Powered Analysis"
              description="Advanced computer vision analyzes waste photos to estimate weight instantly"
              color="green"
            />
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="GPS Tracking"
              description="Automatic location capture for complete collection route transparency"
              color="blue"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-Time Analytics"
              description="Live dashboards showing collection trends and waste statistics"
              color="purple"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Multi-Level Access"
              description="Hierarchical system from Zilla Panchayat to Ward level management"
              color="orange"
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Quality Assurance"
              description="Confidence scores and validation checks ensure data accuracy"
              color="green"
            />
            <FeatureCard
              icon={<Leaf className="w-6 h-6" />}
              title="11+ Waste Types"
              description="Identifies plastic, organic, metal, paper, and more waste categories"
              color="teal"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Three simple steps to estimate waste weight</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <Step 
              number="1"
              title="Capture Photo"
              description="Take a clear photo of the waste using your phone camera"
            />
            <Step 
              number="2"
              title="AI Analysis"
              description="Our AI identifies waste type and estimates volume in seconds"
            />
            <Step 
              number="3"
              title="Get Results"
              description="Receive accurate weight estimate with confidence score"
            />
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/estimate"
              className="inline-flex items-center gap-2 bg-[#2d9f5c] text-white px-10 py-4 rounded-xl font-semibold hover:bg-[#218548] transition-all shadow-lg"
            >
              Start Estimating Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2d9f5c] to-[#218548]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Modernize Your Waste Management?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join forward-thinking Gram Panchayats using AI for efficient waste tracking
          </p>
          <Link 
            href="/estimate"
            className="inline-flex items-center gap-2 bg-white text-[#2d9f5c] px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Leaf className="h-6 w-6 text-[#2d9f5c]" />
              <span className="text-lg font-bold">UDAL Waste</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 UDAL Waste Management System. Built for Dakshina Kannada Zilla Panchayat.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    teal: 'bg-teal-50 text-teal-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Step Component
function Step({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#2d9f5c] to-[#218548] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
          {number}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
