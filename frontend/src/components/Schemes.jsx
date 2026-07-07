import React from 'react';
import { Landmark, ArrowRight } from 'lucide-react';

function Schemes({ onBack }) {
    // A mock list of relevant government schemes
    const schemesList = [
        {
            name: "PM-KISAN Samman Nidhi",
            category: "Agriculture",
            desc: "Direct income support of ₹6,000 per year to farmer families to support agricultural needs.",
            tag: "Central Scheme"
        },
        {
            name: "YSR Rythu Bharosa",
            category: "Agriculture",
            desc: "Financial assistance to farmers, including tenant farmers, across Andhra Pradesh.",
            tag: "State Scheme"
        },
        {
            name: "Ayushman Bharat PM-JAY",
            category: "Healthcare",
            desc: "Health insurance cover of ₹5 lakhs per family per year for secondary and tertiary care.",
            tag: "Central Scheme"
        },
        {
            name: "PM Mudra Yojana",
            category: "Business",
            desc: "Accessible loans up to ₹10 lakhs for non-corporate, non-farm small/micro enterprises.",
            tag: "Central Scheme"
        }
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Schemes for You</h2>
                <button onClick={onBack} className="text-sm text-blue-600 hover:underline">Back to Dashboard</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schemesList.map((scheme, index) => (
                    <div key={index} className="p-5 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-md transition-shadow group flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                                    {scheme.category}
                                </span>
                                <span className="text-xs text-gray-500 font-medium bg-white border border-gray-200 px-2 py-1 rounded-md">
                                    {scheme.tag}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{scheme.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{scheme.desc}</p>
                        </div>

                        <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700 w-fit">
                            Check Eligibility <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Schemes;