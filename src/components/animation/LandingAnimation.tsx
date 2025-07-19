"use client";

import { useLottie, LottieOptions } from "lottie-react";
import { useEffect, useState } from "react";

const LandingAnimation = () => {
    const [animationData, setAnimationData] = useState<LottieOptions['animationData']>(null);

    useEffect(() => {
        // Dynamically import the animation data
        import("../../../public/animation/rocket.json")
            .then((data) => {
                setAnimationData(data.default);
            })
            .catch((error) => {
                console.error("Failed to load animation:", error);
            });
    }, []);

    const defaultOptions = {
        animationData: animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(defaultOptions);

    if (!animationData) {
        return <div className="text-white text-center py-20">Loading animation...</div>;
    }

    return (
        <div className="flex justify-center items-center py-20">
            <div style={{ width: 200, height: 200 }} className="rounded-lg shadow-lgbg-opacity-50 p-4">
                {View}
            </div>
        </div>
    );
};

export default LandingAnimation;
