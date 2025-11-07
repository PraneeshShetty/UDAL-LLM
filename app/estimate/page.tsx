"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Upload, MapPin, Loader2, CheckCircle, AlertCircle, ArrowLeft, Leaf, X, Info, Zap } from "lucide-react";

interface EstimationResult {
  success: boolean;
  data?: {
    id: string;
    estimatedWeightKg: number;
    estimatedVolumeLiters: number;
    materialType: string;
    confidence: number;
    imageQuality: string;
    fullnessPercent: number | null;
    moistureLevel: string | null;
    contaminationLevel: number | null;
    aiReasoning: string;
    gramPanchayat: { name: string };
    ward: { name: string };
    collector: { name: string };
  };
  error?: string;
}

export default function EstimatePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user location
  const getLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedImage);
    
    // Demo mode - these will be auto-filled by API
    formData.append("collectorId", "");
    formData.append("panchayatId", "");
    formData.append("wardId", "");
    
    if (location) {
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lng.toString());
    }

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2d9f5c] to-[#218548] rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">UDAL Waste</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2d9f5c]" />
              <span className="text-sm font-medium text-gray-700">AI Estimation</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Waste Weight Estimation
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a photo of waste and get instant AI-powered weight estimation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Upload Section */}
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upload Photo</h2>
                {selectedImage && (
                  <button
                    onClick={reset}
                    className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#2d9f5c] transition-colors cursor-pointer bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#e8f5ed] rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-[#2d9f5c]" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <button className="bg-[#2d9f5c] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#218548] transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose File
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-xl object-cover max-h-96"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-700 hover:text-red-600" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2d9f5c]" />
                  <h3 className="font-semibold text-gray-900">Location</h3>
                </div>
                {!location && (
                  <button
                    onClick={getLocation}
                    disabled={locationLoading}
                    className="text-sm text-[#2d9f5c] hover:text-[#218548] font-medium"
                  >
                    {locationLoading ? "Getting..." : "Enable"}
                  </button>
                )}
              </div>
              {location ? (
                <div className="bg-[#e8f5ed] rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Coordinates:</span>{" "}
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  GPS location will be captured automatically
                </p>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || loading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                !selectedImage || loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#2d9f5c] to-[#218548] hover:shadow-xl hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Estimate Weight
                </>
              )}
            </button>
          </div>

          {/* Right Column - Results Section */}
          <div>
            {!result && !loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Info className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Results Yet
                </h3>
                <p className="text-gray-600 max-w-sm">
                  Upload a waste photo and click "Estimate Weight" to see AI-powered analysis results
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <Loader2 className="w-16 h-16 text-[#2d9f5c] animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analyzing Image...
                </h3>
                <p className="text-gray-600">
                  AI is processing your image and calculating waste weight
                </p>
              </div>
            )}

            {result && !result.success && (
              <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Estimation Failed
                    </h3>
                    <p className="text-gray-600 mb-4">{result.error}</p>
                    <button
                      onClick={reset}
                      className="text-[#2d9f5c] hover:text-[#218548] font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {result && result.success && result.data && (
              <div className="space-y-6">
                {/* Success Header */}
                <div className="bg-gradient-to-br from-[#2d9f5c] to-[#218548] rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Analysis Complete</h3>
                      <p className="text-white/90 text-sm">AI-powered estimation results</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-white/80 text-sm mb-1">Estimated Weight</p>
                      <p className="text-3xl font-bold">{result.data.estimatedWeightKg.toFixed(2)} kg</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-white/80 text-sm mb-1">Confidence</p>
                      <p className="text-3xl font-bold">{result.data.confidence}%</p>
                    </div>
                  </div>
                </div>

                {/* Details Cards */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Material Type" value={result.data.materialType} />
                    <DetailItem label="Volume" value={`${result.data.estimatedVolumeLiters.toFixed(1)} L`} />
                    <DetailItem label="Image Quality" value={result.data.imageQuality} />
                    {result.data.fullnessPercent && (
                      <DetailItem label="Fullness" value={`${result.data.fullnessPercent}%`} />
                    )}
                  </div>

                  {result.data.moistureLevel && (
                    <div className="pt-4 border-t border-gray-100">
                      <DetailItem label="Moisture Level" value={result.data.moistureLevel} />
                    </div>
                  )}

                  {result.data.contaminationLevel !== null && (
                    <div className="pt-4 border-t border-gray-100">
                      <DetailItem 
                        label="Contamination" 
                        value={`${result.data.contaminationLevel}%`} 
                      />
                    </div>
                  )}
                </div>

                {/* AI Reasoning */}
                {result.data.aiReasoning && (
                  <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      AI Analysis
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {result.data.aiReasoning}
                    </p>
                  </div>
                )}

                {/* Location Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Collection Info</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Panchayat:</span>{" "}
                      {result.data.gramPanchayat.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Ward:</span>{" "}
                      {result.data.ward.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Collector:</span>{" "}
                      {result.data.collector.name}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={reset}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    New Estimation
                  </button>
                  <button className="flex-1 bg-[#2d9f5c] text-white py-3 rounded-xl font-medium hover:bg-[#218548] transition-colors">
                    Save Result
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-gray-900 capitalize">{value}</p>
    </div>
  );
}
