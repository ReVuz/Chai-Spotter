import { useState, useEffect } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import { Icon, LeafletMouseEvent } from 'leaflet';
import { Plus, X, MapPin, Crosshair } from 'lucide-react';
import { addTeaStall } from '../lib/supabase';

const teaIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  namedetails?: {
    name?: string;
  };
  address?: {
    cafe?: string;
    restaurant?: string;
    shop?: string;
  };
  extratags?: {
    amenity?: string;
    cuisine?: string;
  };
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  name?: string;
  amenity?: string;
  cuisine?: string;
}

export function AddTeaSpot() {
  const map = useMap();
  const [isAdding, setIsAdding] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [stallName, setStallName] = useState('');
  const [rating, setRating] = useState(5);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleLocationSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Search with more detailed parameters
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(query)}` +
        `&addressdetails=1&extratags=1&namedetails=1` +
        `&limit=5`
      );
      const data: NominatimResult[] = await response.json();
      
      // Filter and transform results
      const transformedResults: SearchResult[] = data.map((result) => ({
        display_name: result.display_name,
        lat: result.lat,
        lon: result.lon,
        type: result.type,
        name: result.namedetails?.name || result.address?.cafe || result.address?.restaurant || result.address?.shop,
        amenity: result.type === 'amenity' ? result.extratags?.amenity : undefined,
        cuisine: result.extratags?.cuisine,
      }));

      setSearchResults(transformedResults);
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Failed to search location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchQuery) {
      const timeout = setTimeout(() => {
        handleLocationSearch(searchQuery);
      }, 300);
      setSearchTimeout(timeout);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery]);

  const handleSearchResultClick = async (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setPosition([lat, lon]);
    setSearchResults([]);
    
    // If the result appears to be a tea/coffee place, autofill the name and add relevant specialties
    if (result.name || (result.amenity && ['cafe', 'restaurant', 'tea'].includes(result.amenity))) {
      // Set the name if available
      if (result.name) {
        setStallName(result.name);
      }

      // Add cuisine as specialty if available
      if (result.cuisine) {
        const cuisineSpecialties = result.cuisine
          .split(';')
          .map(c => c.trim())
          .filter(c => c.length > 0);
        
        if (cuisineSpecialties.length > 0) {
          setSpecialties(prev => {
            const newSpecialties = [...new Set([...prev, ...cuisineSpecialties])];
            return newSpecialties;
          });
        }
      }

      // Add default tea-related specialties based on the place type
      if (result.amenity === 'cafe' || result.type === 'cafe') {
        setSpecialties(prev => {
          const defaultSpecialties = ['Tea', 'Coffee'];
          const newSpecialties = [...new Set([...prev, ...defaultSpecialties])];
          return newSpecialties;
        });
      }
    }

    setSearchQuery('');
    map.setView([lat, lon], 16);
  };

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (isAdding) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setSearchResults([]);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          map.setView([latitude, longitude], 16);
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Failed to get current location. Please try again or search for a location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    setSpecialties(specialties.filter(s => s !== specialtyToRemove));
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
        specialties_text: specialties.join(', '),
      });

      // Reset form
      setStallName('');
      setRating(5);
      setPosition(null);
      setIsAdding(false);
      setSpecialties([]);
      setSpecialtyInput('');
      setSearchQuery('');
      
      // Refresh the page to show new marker
      window.location.reload();
    } catch (error) {
      console.error('Error adding tea stall:', error);
      alert('Failed to add tea stall. Please try again.');
    }
  };

  // Add click listener when component mounts
  useEffect(() => {
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, isAdding]);

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
          
          <div className="mb-4 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a place or address..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pr-8"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                  </div>
                )}
              </div>
              <button
                onClick={handleCurrentLocation}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                title="Use current location"
              >
                <Crosshair size={20} />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium text-sm">
                      {result.name || result.display_name.split(',')[0]}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {result.display_name}
                    </div>
                    {(result.amenity || result.type) && (
                      <div className="text-xs text-green-600 mt-1">
                        {result.amenity || result.type}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {position 
              ? 'Fill in the details below'
              : 'Search for a place, use current location, or click on the map'}
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialties
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    placeholder="Add a specialty..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpecialty();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialty}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
                {specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialty(specialty)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
              {specialties.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Specialties:</p>
                  <p className="text-sm text-gray-600">{specialties.join(', ')}</p>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
} 