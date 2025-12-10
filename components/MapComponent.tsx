import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Company } from '../types';
import { COMPANIES, INITIAL_LAT, INITIAL_LNG, INITIAL_ZOOM } from '../constants';

// Fix for default marker icons in React Leaflet
// Using CDN URLs because direct PNG import fails in pure ESM browser environments
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  selectedCompanyId?: string;
}

// Component to handle map movement when selection changes
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    // Check for valid coordinates to prevent "Invalid LatLng object: (NaN, NaN)" error
    if (Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center[0], center[1], zoom, map]); // Deconstruct center array to primitives to check for actual value changes

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ companies, onSelectCompany, selectedCompanyId }) => {
  const selected = companies.find(c => c.id === selectedCompanyId);
  
  // Robust fallback logic
  const defaultLat = Number.isFinite(INITIAL_LAT) ? INITIAL_LAT : 46.06;
  const defaultLng = Number.isFinite(INITIAL_LNG) ? INITIAL_LNG : 13.23;

  const lat = selected?.lat;
  const lng = selected?.lng;

  // Determine center: use selected company if coordinates are valid, otherwise default
  const center: [number, number] = (selected && typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng))
    ? [lat, lng] 
    : [defaultLat, defaultLng];
  
  const zoom = selected ? 14 : INITIAL_ZOOM;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[defaultLat, defaultLng]} 
        zoom={INITIAL_ZOOM} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        zoomControl={false} // We can add custom controls if needed
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} zoom={zoom} />

        {companies
          // Filter out any companies with invalid coordinates to prevent crashes
          .filter(c => Number.isFinite(c.lat) && Number.isFinite(c.lng))
          .map((company) => (
            <Marker 
              key={company.id} 
              position={[company.lat, company.lng]}
              eventHandlers={{
                click: () => onSelectCompany(company),
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-terrefvg-green">{company.name}</h3>
                  <p className="text-xs text-gray-600">{company.category}</p>
                </div>
              </Popup>
            </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;