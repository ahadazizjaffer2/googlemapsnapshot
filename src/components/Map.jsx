import React, { useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import html2canvas from 'html2canvas';

const Map = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        });

        loader
            .importLibrary('maps')
            .then(({ Map }) => {
                if (mapRef.current) {
                    mapInstanceRef.current = new Map(mapRef.current, {
                        center: { lat: 24.8607, lng: 67.0011 },
                        zoom: 12,
                    });

                    google.maps.event.addListenerOnce(mapInstanceRef.current, 'idle', () => {
                        console.log('Map tiles loaded');
                    });
                }
            })
            .catch((error) => console.error('Google Maps API failed to load:', error));
    }, []);

    const captureMapSnapshot = () => {
        if (mapRef.current) {
            html2canvas(mapRef.current, { useCORS: true }).then((canvas) => {
                const link = document.createElement('a');
                link.download = 'map_snapshot.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div ref={mapRef} className="w-full w-[700px] h-[500px] rounded-lg shadow-md" />
            <button
                onClick={captureMapSnapshot}
                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-300"
            >
                Save Snapshot
            </button>
        </div>
    );
};

export default Map;

