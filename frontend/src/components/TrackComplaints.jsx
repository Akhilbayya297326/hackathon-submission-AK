import React, { useState } from 'react';
import { Search, Clock, CheckCircle, MapPin } from 'lucide-react';

function TrackComplaints({ onBack }) {
    const [trackingId, setTrackingId] = useState('');
    const [status, setStatus] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (trackingId.trim() !== '') {
            // Simulating fetching data from the backend
            setStatus('in-progress');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Track Complaint Status</h2>
                <button onClick={onBack} className="text-sm text-blue-600 hover:underline">Back to Dashboard</button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID (e.g., #IND-1234)"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Search size={18} />
                    Track
                </button>
            </form>

            {/* Status Timeline (Only shows after searching) */}
            {status && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6 flex items-start gap-3">
                        <MapPin className="text-blue-500 mt-1" size={20} />
                        <div>
                            <h3 className="font-semibold text-blue-900">Broken Streetlight</h3>
                            <p className="text-sm text-blue-700">Main Road, Sector 4</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">

                        {/* Step 1: Submitted */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <CheckCircle size={18} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-gray-900">Complaint Logged</h4>
                                    <span className="text-xs text-gray-500">Oct 24, 09:30 AM</span>
                                </div>
                                <p className="text-sm text-gray-600">Your issue has been successfully registered in the system.</p>
                            </div>
                        </div>

                        {/* Step 2: In Progress */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <Clock size={18} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-blue-200 bg-blue-50 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-blue-900">Under Review</h4>
                                    <span className="text-xs text-blue-700">Oct 25, 11:15 AM</span>
                                </div>
                                <p className="text-sm text-blue-800">Assigned to the local municipal electrical department.</p>
                            </div>
                        </div>

                        {/* Step 3: Resolved (Pending) */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-200 text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <CheckCircle size={18} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                                <h4 className="font-bold text-gray-400">Resolved</h4>
                                <p className="text-sm text-gray-400 mt-1">Awaiting final confirmation.</p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default TrackComplaints;