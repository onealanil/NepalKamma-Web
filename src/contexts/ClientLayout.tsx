
"use client";


import OfflineBanner from "@/components/OfflineBanner";
import { ReactNode } from "react";


export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <OfflineBanner />
            {children}
        </>
    );
}