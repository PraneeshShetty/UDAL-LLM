"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Upload, MapPin, Loader2, CheckCircle, AlertCircle, ArrowLeft, Leaf } from "lucide-react";

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
  
  // Form fields
  const [panchayatId, setPanchayatId] = useState("");
  const [wardId, setWardId] = useState("");
  const [collectorId, setCollectorId] = useState("");
  const [containerType, setContainerType] = useState("");
  const [containerVolume, setContainerVolume] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);

  // For demo purposes - in production, fetch from API
  const [panchayats, setPanchayats] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      alert("Please select an image");
      return;
    }

    // For demo, use placeholder IDs if not provided
    const demoCollectorId = collectorId || "demo-collector-1";
    const demoPanchayatId = panchayatId || "demo-panchayat-1";
    const demoWardId = wardId || "demo-ward-1";

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("collectorId", demoCollectorId);
    formData.append("panchayatId", demoPanchayatId);
    formData.append("wardId", demoWardId);
    
    if (containerType) formData.append("containerType", containerType);
    if (containerVolume) formData.append("containerVolumeLiters", containerVolume);
    if (address) formData.append("address", address);
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
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold">UDAL Waste</span>
            </Link>
            <h2 className="text-lg font-semibold hidden sm:block text-gray-900">Waste Weight Estimation</h2>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <Camera className="h-6 w-6 text-green-600" />
                Upload Waste Photo
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Waste Image *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={reset}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700"
                        >
                          Select Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Panchayat ID</label>
                    <input
                      type="text"
                      value={panchayatId}
                      onChange={(e) => setPanchayatId(e.target.value)}
                      placeholder="Optional (demo mode)"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Ward ID</label>
                    <input
                      type="text"
                      value={wardId}
                      onChange={(e) => setWardId(e.target.value)}
                      placeholder="Optional (demo mode)"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Collector ID</label>
                  <input
                    type="text"
                    value={collectorId}
                    onChange={(e) => setCollectorId(e.target.value)}
                    placeholder="Optional (demo mode)"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Container Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Container Type</label>
                    <select
                      value={containerType}
                      onChange={(e) => setContainerType(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select type</option>
                      <option value="60L_bin">60L Bin</option>
                      <option value="120L_bin">120L Bin</option>
                      <option value="240L_bin">240L Bin</option>
                      <option value="bag">Bag</option>
                      <option value="pile">Pile/Heap</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Volume (Liters)</label>
                    <input
                      type="number"
                      value={containerVolume}
                      onChange={(e) => setContainerVolume(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Address/Location</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* GPS Coordinates */}
                {location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedImage || loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-5 w-5" />
                      Estimate Weight
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Best Results</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting and clear visibility of waste</li>
                <li>• Capture the full container or pile in the frame</li>
                <li>• Include a reference object if possible (like a standard bin)</li>
                <li>• Avoid shadows and obstructions</li>
                <li>• Take multiple photos from different angles for better accuracy</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            {result && (
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                {result.success && result.data ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                      <h3 className="text-2xl font-bold">Estimation Complete!</h3>
                    </div>

                    {/* Main Result */}
                    <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                      <div className="text-center">
                        <p className="text-gray-600 mb-2">Estimated Weight</p>
                        <p className="text-5xl font-bold text-green-600">
                          {result.data.estimatedWeightKg}
                          <span className="text-2xl ml-2">kg</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          ({result.data.estimatedVolumeLiters} liters)
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <DetailCard
                        label="Material Type"
                        value={result.data.materialType.replace(/_/g, " ").toUpperCase()}
                      />
                      <DetailCard
                        label="Confidence"
                        value={`${(result.data.confidence * 100).toFixed(0)}%`}
                        color={result.data.confidence > 0.7 ? "green" : result.data.confidence > 0.5 ? "yellow" : "red"}
                      />
                      {result.data.fullnessPercent && (
                        <DetailCard
                          label="Container Fullness"
                          value={`${result.data.fullnessPercent}%`}
                        />
                      )}
                      {result.data.moistureLevel && (
                        <DetailCard
                          label="Moisture Level"
                          value={result.data.moistureLevel.toUpperCase()}
                        />
                      )}
                      <DetailCard
                        label="Image Quality"
                        value={result.data.imageQuality.toUpperCase()}
                      />
                      {result.data.contaminationLevel !== null && (
                        <DetailCard
                          label="Contamination"
                          value={`${(result.data.contaminationLevel * 100).toFixed(0)}%`}
                        />
                      )}
                    </div>

                    {/* AI Reasoning */}
                    {result.data.aiReasoning && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">AI Analysis:</p>
                        <p className="text-sm text-gray-600">{result.data.aiReasoning}</p>
                      </div>
                    )}

                    {/* Location Info */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Panchayat:</strong> {result.data.gramPanchayat.name}</p>
                      <p><strong>Ward:</strong> {result.data.ward.name}</p>
                      <p><strong>Collector:</strong> {result.data.collector.name}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={reset}
                        className="flex-1 border-2 border-green-600 text-green-600 py-2 rounded-lg font-semibold hover:bg-green-50"
                      >
                        New Estimation
                      </button>
                      <Link
                        href="/dashboard"
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 text-center"
                      >
                        View Dashboard
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Estimation Failed</h3>
                    <p className="text-gray-600">{result.error || "An error occurred"}</p>
                    <button
                      onClick={reset}
                      className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {!result && !loading && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-500">
                  Upload a waste image and fill in the details to get an AI-powered weight estimation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value, color = "gray" }: { label: string; value: string; color?: string }) {
  const colorClasses = {
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800",
    gray: "bg-gray-50 border-gray-200 text-gray-800",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-xs font-medium opacity-75 mb-1">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
