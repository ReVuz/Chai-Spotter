import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TeaStall } from '../types';
import TeaStallCard from './TeaStallCard';
import { AddTeaSpot } from './AddTeaSpot';
import { getTeaStalls, TeaStallDB } from '../lib/supabase';

// Fix for default marker icons in Leaflet with React
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Workaround for Leaflet icon issue
const DefaultIcon = new Icon({
  iconUrl: marker,
  iconRetinaUrl: marker2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom tea cup icon
const teaIcon = new Icon({
  iconUrl: 'https://img.icons8.com/color/96/000000/tea-cup.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

interface MapProps {
  stalls: TeaStall[];
  selectedStall: TeaStall | null;
  setSelectedStall: (stall: TeaStall | null) => void;
}

const MapRecenter = ({ position, zoom }: { position: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, zoom);
  }, [position, zoom, map]);
  return null;
};

const Map: React.FC<MapProps> = ({ stalls, selectedStall, setSelectedStall }) => {
  const keralaCenterPosition: [number, number] = [10.3528, 76.5604]; // Center of Kerala
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [supabaseStalls, setSupabaseStalls] = useState<TeaStallDB[]>([]);
  
  // Effect for getting user location if allowed
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Fetch tea stalls from Supabase
  useEffect(() => {
    const fetchSupabaseStalls = async () => {
      try {
        const data = await getTeaStalls();
        setSupabaseStalls(data || []);
      } catch (error) {
        console.error("Error fetching tea stalls:", error);
      }
    };

    fetchSupabaseStalls();
  }, []);

  return (
    <div className="h-[500px] sm:h-[600px] md:h-[700px] w-full rounded-lg overflow-hidden shadow-lg border-2 border-green-700 dark:border-green-600">
      <MapContainer
        center={keralaCenterPosition}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        className="dark:invert-[.85] dark:hue-rotate-180"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {selectedStall && (
          <MapRecenter 
            position={selectedStall.position} 
            zoom={13} 
          />
        )}
        
        {/* Static stalls from data file */}
        {stalls.map((stall) => (
          <Marker 
            key={stall.id} 
            position={stall.position} 
            icon={teaIcon}
            eventHandlers={{
              click: () => {
                setSelectedStall(stall);
              },
            }}
          >
            <Popup className="stall-popup">
              <TeaStallCard stall={stall} compact={true} />
            </Popup>
          </Marker>
        ))}

        {/* Supabase stalls */}
        {supabaseStalls.map((stall) => (
          <Marker 
            key={stall.id} 
            position={[stall.latitude, stall.longitude]} 
            icon={teaIcon}
          >
            <Popup className="stall-popup">
              <div className="p-2 max-w-[250px]">
                <h3 className="font-bold text-lg text-green-800 dark:text-green-400">
                  {stall.stall_name}
                </h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium dark:text-gray-300">
                    Rating: {stall.rating}/5
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={DefaultIcon}
          >
            <Popup>You are here!</Popup>
          </Marker>
        )}

        <AddTeaSpot />
      </MapContainer>
    </div>
  );
};

export default Map;