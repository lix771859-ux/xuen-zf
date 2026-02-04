'use client';

import Link from 'next/link';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  lat: number;
  lng: number;
  bedrooms: number;
}

// Flushing, Queens, NY mock data aligned with /api/properties
const properties: Property[] = [
  { id: 1, title: 'Modern Studio - Near Main St', price: 1800, address: '133-25 Roosevelt Ave', lat: 40.7599, lng: -73.8303, bedrooms: 0 },
  { id: 2, title: 'Luxury 3BR Townhouse', price: 4500, address: '41-20 Murray St', lat: 40.7613, lng: -73.8197, bedrooms: 3 },
  { id: 3, title: 'Cozy 1BR Near Subway', price: 1600, address: '153-40 Northern Blvd', lat: 40.7644, lng: -73.8099, bedrooms: 1 },
  { id: 4, title: 'Family Apartment - Great Schools', price: 2800, address: '25-21 Bowne St', lat: 40.7662, lng: -73.8273, bedrooms: 2 },
  { id: 5, title: 'Elegant 2BR Condo', price: 2200, address: '38-02 Union St', lat: 40.7648, lng: -73.8300, bedrooms: 2 },
  { id: 6, title: 'Spacious 3BR House', price: 3600, address: '45-88 Bell Blvd', lat: 40.7698, lng: -73.7808, bedrooms: 3 },
  { id: 7, title: 'Contemporary Studio', price: 1500, address: '35-16 Parsons Blvd', lat: 40.7637, lng: -73.8245, bedrooms: 0 },
  { id: 8, title: 'Waterfront 2BR', price: 3200, address: '201 Willets Point Blvd', lat: 40.7593, lng: -73.8439, bedrooms: 3 },
];

// Map bounds to project lat/lng into a simple 2D view
const center = { lat: 40.7645, lng: -73.824 }; // Flushing core
const latRange = 0.04; // ~4.4km
const lngRange = 0.06; // ~5.2km

const projectToPercent = (lat: number, lng: number) => {
  const x = ((lng - (center.lng - lngRange / 2)) / lngRange) * 100;
  const y = ((lat - (center.lat - latRange / 2)) / latRange) * 100;
  // clamp to container
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
};

export default function MapView() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/?tab=profile" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Flushing Map</h1>
            <p className="text-xs text-gray-500">Live view of all listings in Flushing, Queens, NY</p>
          </div>
          <div className="text-sm text-gray-600 hidden sm:block">
            {properties.length} homes · USD pricing
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Grid background */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Property markers */}
            {properties.map((property, index) => {
              const pos = projectToPercent(property.lat, property.lng);
              return (
                <div
                  key={property.id}
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-3 w-56 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{property.title}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{property.address}</p>
                      <p className="text-blue-600 font-bold text-sm mt-1">${property.price.toLocaleString()}/mo</p>
                      <p className="text-gray-500 text-xs">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</p>
                      <Link
                        href={`/property/${property.id}`}
                        className="mt-2 inline-flex items-center justify-center w-full text-xs py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <p className="text-sm font-semibold text-gray-900 mb-2">Legend</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Available rentals (USD)</span>
            </div>
            <p className="text-gray-500 mt-2">Hover markers to preview · Click to open listing</p>
          </div>
        </div>

        {/* Overview pill */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow">
          <span className="text-sm text-gray-700">Flushing · {properties.length} homes</span>
        </div>
      </div>
    </div>
  );
}
