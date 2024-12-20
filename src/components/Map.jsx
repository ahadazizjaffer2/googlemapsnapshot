// import React, { useRef, useEffect } from 'react';
// import { Loader } from '@googlemaps/js-api-loader';
// import html2canvas from 'html2canvas';

// const Map = () => {
//     // Create refs to store the map container and map instance
//     const mapRef = useRef(null);
//     const mapInstanceRef = useRef(null);
//     const markerRef = useRef(null);

//     useEffect(() => {
//         // Initialize the Google Maps API loader with the API key and version
//         const loader = new Loader({
//             apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//             version: 'weekly',
//         });

//         // Load the Google Maps library and create a new map instance
//         loader
//             .importLibrary('maps')
//             .then(({ Map }) => {
//                 if (mapRef.current) {
//                     // Create a new map instance and store it in the ref
//                     mapInstanceRef.current = new Map(mapRef.current, {
//                         center: { lat: 24.8607, lng: 67.0011 }, // Set the initial center of the map
//                         zoom: 12, 
//                     });

//                     // Add a marker to the map and store it in the ref
//                     markerRef.current = new google.maps.Marker({
//                         position: { lat: 24.8607, lng: 67.0011 },
//                         map: mapInstanceRef.current,
//                     });

//                     // Update the marker position when the map center changes
//                     mapInstanceRef.current.addListener('center_changed', () => {
//                         if (markerRef.current) {
//                             markerRef.current.setPosition(mapInstanceRef.current.getCenter());
//                         }
//                     });
//                 }
//             })
//             .catch((error) => console.error('Google Maps API failed to load:', error));
//     }, []);

//     // Function to capture a snapshot of the map and download it as an image
//     const captureMapSnapshot = () => {
//         if (mapRef.current) {
//             html2canvas(mapRef.current, { useCORS: true }).then((canvas) => {
//                 const link = document.createElement('a');
//                 link.download = 'map_snapshot.png'; // Filename for the downloaded image
//                 link.href = canvas.toDataURL(); // Convert the canvas to a data URL
//                 link.click();
//             });
//         }
//     };

//     return (
//         <div className="flex flex-col items-center p-4">
//             <div ref={mapRef} className="w-full w-[900px] h-[500px] rounded-lg shadow-md" />
//             <button
//                 onClick={captureMapSnapshot}
//                 className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-300"
//             >
//                 Save Snapshot
//             </button>
//         </div>
//     );
// };

// export default Map;


import React, { useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = () => {
    // Create refs to store the map container and map instance
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        // Initialize the Google Maps API loader with the API key and version
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        });

        // Load the Google Maps library and create a new map instance
        loader
            .importLibrary('maps')
            .then(({ Map }) => {
                if (mapRef.current) {
                    // Create a new map instance and store it in the ref
                    mapInstanceRef.current = new Map(mapRef.current, {
                        center: { lat: 24.8607, lng: 67.0011 }, // Set the initial center of the map
                        zoom: 12, 
                    });

                    // Add a marker to the map and store it in the ref
                    markerRef.current = new google.maps.Marker({
                        position: { lat: 24.8607, lng: 67.0011 },
                        map: mapInstanceRef.current,
                    });

                    // Update the marker position when the map center changes
                    mapInstanceRef.current.addListener('center_changed', () => {
                        if (markerRef.current) {
                            markerRef.current.setPosition(mapInstanceRef.current.getCenter());
                        }
                    });
                }
            })
            .catch((error) => console.error('Google Maps API failed to load:', error));
    }, []);

    // Function to capture a snapshot of the map using Google Static Maps API and download it as an image
    const captureMapSnapshot = () => {
        if (mapInstanceRef.current) {
            const center = mapInstanceRef.current.getCenter();
            const zoom = mapInstanceRef.current.getZoom();
            const mapType = mapInstanceRef.current.getMapTypeId();
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

            const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat()},${center.lng()}&zoom=${zoom}&size=900x500&maptype=${mapType}&markers=color:red%7C${center.lat()},${center.lng()}&key=${apiKey}`;

            fetch(staticMapUrl)
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'map_snapshot.png'; // Filename for the downloaded image
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                })
                .catch(error => console.error('Failed to capture map snapshot:', error));
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div ref={mapRef} className="w-full w-[900px] h-[500px] rounded-lg shadow-md" />
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
