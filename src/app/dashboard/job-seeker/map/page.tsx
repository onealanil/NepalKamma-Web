"use clint";

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map/Map'));

export default function Home() {
    const jobLocation = {
        lat: 27.7172,
        lon: 85.324,
    };

    return (
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: '#1a365d'
            }}>
                Next.js with Mapbox GL (TypeScript)
            </h1>

            <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
            }}>
                <Map />
            </div>
        </main>
    );
}
