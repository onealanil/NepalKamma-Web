"use client";

import { useRouter } from "next/navigation";

export default function unauthorized() {
    const router = useRouter();

    return (
        <>
            <h1> This is unauthorized page</h1>

            <button onClick={() => router.push('/auth/signin')}>
                Go to login page
            </button>
        </>
    )
}