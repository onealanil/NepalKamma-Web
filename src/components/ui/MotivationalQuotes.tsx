"use client";

import React from "react";

export const MotivationalQuotes = ({ isProvider }: {isProvider:boolean}) => {
    const quotes = [
        {
            text: "Your skills are your currency. Keep investing in yourself.",
            author: "Career Success"
        },
        {
            text: "Every completed project is a step towards your dream career.",
            author: "Professional Growth"
        },
        {
            text: "Quality work speaks louder than any advertisement.",
            author: "Excellence Mindset"
        },
        {
            text: "Build your reputation one satisfied client at a time.",
            author: "Trust Building"
        },
        {
            text: "Continuous learning is the key to staying relevant.",
            author: "Skill Development"
        }
    ];

    const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState<number>(0);

    const handleNextQuote = () => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    };

    return (
        <div className="space-y-6">
            {/* Daily Motivation */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Daily Motivation
                </h3>
                <div className="bg-primary/5 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 italic text-center mb-2">
                        "{quotes[currentQuoteIndex].text}"
                    </p>
                    <p className="text-primary font-semibold text-center text-sm">
                        - {quotes[currentQuoteIndex].author}
                    </p>
                </div>
                <button
                    onClick={handleNextQuote}
                    className="w-full bg-primary/10 text-primary py-2 rounded-lg font-medium hover:bg-primary/20 transition-colors"
                >
                    Next Quote
                </button>
            </div>

            {/* Profile Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Profile Tips
                </h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">
                            Add a professional profile picture to increase trust
                        </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">
                            {
                                isProvider ?
                                    "Complete your job listings to attract more freelancers" :
                                    "Complete your skills section to get better job matches"

                            }
                        </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">
                            Write a compelling bio that showcases your expertise
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Your Progress
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Profile Completion</span>
                        <span className="text-sm font-semibold text-primary">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                            <p className="text-2xl font-bold text-primary">0</p>
                            <p className="text-xs text-gray-600">Jobs Applied</p>
                        </div>
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                            <p className="text-2xl font-bold text-primary">0</p>
                            <p className="text-xs text-gray-600">Profile Views</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};