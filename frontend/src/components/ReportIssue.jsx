import React, { useState } from 'react';
import { CheckCircle, UploadCloud, Camera, Loader2, Sparkles } from 'lucide-react';

function ReportIssue({ onBack }) {
    const [submitted, setSubmitted] = useState(false);
    const [fileName, setFileName] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // State to hold our form values
    const [formData, setFormData] = useState({
        category: 'Broken Streetlight',
        location: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setIsAnalyzing(true); // Start the loading animation

        // Convert the image to a Base64 string to send to our backend
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64String = reader.result;

            try {
                const response = await fetch('http://localhost:5000/api/analyze-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: base64String })
                });

                const data = await response.json();

                // Auto-fill the form with Gemini's Vision analysis
                if (data.category && data.description) {
                    setFormData(prev => ({
                        ...prev,
                        category: data.category,
                        description: data.description
                    }));
                }
            } catch (error) {
                console.error("Vision AI Error:", error);
            } finally {
                setIsAnalyzing(false); // Stop loading animation
            }
        };
    };

    if (submitted) {
        return (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Reported Successfully!</h2>
                <p className="text-gray-600 mb-8">
                    Your complaint has been logged and assigned tracking ID: <strong className="text-blue-600 bg-blue-50 px-2 py-1 rounded">#IND-{Math.floor(Math.random() * 10000)}</strong>
                </p>
                <button onClick={onBack} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Report an Issue
                        {isAnalyzing && <Sparkles className="text-amber-500 animate-pulse" size={20} />}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Upload a photo, and our AI will auto-fill the details.</p>
                </div>
                <button onClick={onBack} className="text-sm font-medium text-gray-400 hover:text-gray-600 bg-gray-50 px-3 py-1 rounded-full transition-colors">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Multimodal Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">1. Upload Photo Evidence</label>
                    <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center cursor-pointer group ${isAnalyzing ? 'border-amber-400 bg-amber-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isAnalyzing} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" />

                        {isAnalyzing ? (
                            <div className="flex flex-col items-center text-amber-600">
                                <Loader2 className="animate-spin mb-3" size={32} />
                                <span className="font-bold text-sm">AI is analyzing your image...</span>
                            </div>
                        ) : (
                            <>
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    {fileName ? <Camera size={24} /> : <UploadCloud size={24} />}
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    {fileName ? <span className="text-blue-600">{fileName}</span> : "Click to upload or drag & drop"}
                                </p>
                                {!fileName && <p className="text-xs text-gray-400 mt-1">AI will automatically categorize the issue.</p>}
                            </>
                        )}
                    </div>
                </div>

                {/* Modern Select Dropdown */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Issue Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                        <option>Broken Streetlight</option>
                        <option>Pothole / Road Damage</option>
                        <option>Water Supply Issue</option>
                        <option>Garbage Collection</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Location Input */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location Details</label>
                    <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Street name, landmark, or GPS coordinates"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                {/* Description Textarea */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                        required
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide any additional details..."
                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${isAnalyzing ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}
                    ></textarea>
                </div>

                <button type="submit" disabled={isAnalyzing} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit Official Report
                </button>
            </form>
        </div>
    );
}

export default ReportIssue;