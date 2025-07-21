'use client'

interface WhoProps {
    setWho: (role: string) => void;
}

export default function Who({ setWho }: WhoProps) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[90%] max-w-md">
                {/* Title */}
                <div className="w-full flex flex-row gap-x-3 items-center justify-center mb-12">
                    <h1 className="text-black text-5xl font-bold">I</h1>
                    <h1 className="text-primary text-5xl font-bold">AM</h1>
                </div>

                {/* Role Selection */}
                <div className="w-full flex flex-row items-center justify-center gap-x-8">
                    {/* Job Seeker */}
                    <div className="w-[50%] flex items-center justify-center p-5">
                        <button
                            onClick={() => setWho('job_seeker')}
                            className="flex flex-col items-center gap-y-4 p-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/5 group"
                        >
                            {/* Job Seeker Icon */}
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                                <svg className="w-12 h-12 text-primary transition-all duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </div>
                            <span className="text-black font-semibold text-lg transition-all duration-300 group-hover:text-primary group-hover:scale-105">Job Seeker</span>
                        </button>
                    </div>

                    {/* Job Provider */}
                    <div className="w-[50%] flex items-center justify-center p-5">
                        <button
                            onClick={() => setWho('job_provider')}
                            className="flex flex-col items-center gap-y-4 p-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/5 group"
                        >
                            {/* Job Provider Icon */}
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                                <svg className="w-12 h-12 text-primary transition-all duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                                </svg>
                            </div>
                            <span className="text-black font-semibold text-lg transition-all duration-300 group-hover:text-primary group-hover:scale-105">Job Provider</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
