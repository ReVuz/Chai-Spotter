import { useState } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import { Icon, LeafletMouseEvent } from 'leaflet';
import { Plus, X } from 'lucide-react';
import { addTeaStall } from '../lib/supabase';

const teaIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export function AddTeaSpot() {
  const map = useMap();
  const [isAdding, setIsAdding] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [stallName, setStallName] = useState('');
  const [rating, setRating] = useState(5);

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (isAdding) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) return;

    try {
      await addTeaStall({
        stall_name: stallName,
        latitude: position[0],
        longitude: position[1],
        rating: rating,
      });

      // Reset form
      setStallName('');
      setRating(5);
      setPosition(null);
      setIsAdding(false);
      
      // Refresh the page to show new marker
      window.location.reload();
    } catch (error) {
      console.error('Error adding tea stall:', error);
      alert('Failed to add tea stall. Please try again.');
    }
  };

  // Add click listener when component mounts
  map.on('click', handleMapClick);

  return (
    <>
      <button
        onClick={() => setIsAdding(!isAdding)}
        className="absolute z-[1000] top-4 right-4 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg"
        title={isAdding ? 'Cancel adding' : 'Add new tea spot'}
      >
        {isAdding ? <X size={24} /> : <Plus size={24} />}
      </button>

      {isAdding && (
        <div className="absolute z-[1000] top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="text-lg font-semibold mb-2">Add New Tea Spot</h3>
          <p className="text-sm text-gray-600 mb-4">
            {position 
              ? 'Fill in the details below'
              : 'Click on the map to select location'}
          </p>

          {position && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tea Spot Name
                </label>
                <input
                  type="text"
                  value={stallName}
                  onChange={(e) => setStallName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Save Tea Spot
              </button>
            </form>
          )}
        </div>
      )}

      {position && (
        <Marker position={position} icon={teaIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">{stallName || 'New Tea Spot'}</p>
              <p className="text-sm text-gray-600">
                Rating: {rating}/5
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
} 