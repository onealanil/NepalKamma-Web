"use client";

import { useState } from 'react';
import { Lightbulb, Target, Star, TrendingUp, Users, DollarSign } from 'lucide-react';

const CreateGigTips = () => {
    const [activeTab, setActiveTab] = useState('tips');

    const tips = [
        {
            icon: <Target className="w-5 h-5" />,
            title: "Clear Title",
            description: "Use specific, searchable keywords that describe exactly what you offer."
        },
        {
            icon: <Star className="w-5 h-5" />,
            title: "Quality Images",
            description: "Upload high-quality images that showcase your work and attract clients."
        },
        {
            icon: <DollarSign className="w-5 h-5" />,
            title: "Competitive Pricing",
            description: "Research market rates and price your services competitively."
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Detailed Description",
            description: "Explain your process, what's included, and delivery timeline clearly."
        }
    ];

    const bestPractices = [
        "Start with lower prices to build reviews",
        "Respond to messages within 24 hours",
        "Deliver work on time or early",
        "Ask for feedback and reviews",
        "Update your gig regularly"
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-900">Gig Creation Guide</h3>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('tips')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        activeTab === 'tips' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Tips
                </button>
                <button
                    onClick={() => setActiveTab('practices')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        activeTab === 'practices' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Best Practices
                </button>
            </div>

            {activeTab === 'tips' ? (
                <div className="space-y-4">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                {tip.icon}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{tip.title}</h4>
                                <p className="text-gray-600 text-xs leading-relaxed">{tip.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {bestPractices.map((practice, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">{practice}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 p-3 bg-gradient-to-r from-primary/10 to-green-50 rounded-lg">
                <p className="text-sm text-gray-700 font-medium">💡 Pro Tip</p>
                <p className="text-xs text-gray-600 mt-1">
                    Gigs with detailed descriptions get 40% more orders than basic ones.
                </p>
            </div>
        </div>
    );
};

export default CreateGigTips;