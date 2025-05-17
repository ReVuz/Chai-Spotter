import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import RandomButton from './components/RandomButton';
import StallList from './components/StallList';
import SelectedStallInfo from './components/SelectedStallInfo';
import DarkModeToggle from './components/DarkModeToggle';
import { teaStalls } from './data/stalls';
import { TeaStall } from './types';
import { Coffee as Mug } from 'lucide-react';
import { getTeaStalls, TeaStallDB } from './lib/supabase';

function App() {
  const [selectedStall, setSelectedStall] = useState<TeaStall | null>(null);
  const [supabaseStalls, setSupabaseStalls] = useState<TeaStallDB[]>([]);

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

  // Convert Supabase stalls to TeaStall format for the list view
  const convertedSupabaseStalls: TeaStall[] = supabaseStalls.map((stall) => ({
    id: stall.id,
    name: stall.stall_name,
    location: 'User Added Location',
    description: 'A community-added tea spot',
    specialties: stall.specialties_text ? stall.specialties_text.split(', ') : [],
    position: [stall.latitude, stall.longitude],
    rating: stall.rating,
    imageUrl: 'https://images.pexels.com/photos/1493088/pexels-photo-1493088.jpeg'
  }));

  // Combine both static and Supabase stalls
  const allStalls = [...teaStalls, ...convertedSupabaseStalls];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="absolute top-4 right-4">
          <DarkModeToggle />
        </div>
        
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-3">Discover Tea Spots Worldwide</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Explore tea experiences from around the world! Click anywhere on the map to add your favorite tea spot
                and help others discover great places for a perfect cup of tea.
              </p>
              <div className="flex justify-center md:justify-start">
                <RandomButton stalls={allStalls} setSelectedStall={setSelectedStall} />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Mug className="w-24 h-24 text-green-700 dark:text-green-500 opacity-80" />
            </div>
          </div>
        </section>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <section id="map-section" className="lg:w-2/3">
            <Map 
              stalls={allStalls}
              selectedStall={selectedStall} 
              setSelectedStall={setSelectedStall}
            />
          </section>
          
          <section className="lg:w-1/3">
            {selectedStall ? (
              <SelectedStallInfo 
                stall={selectedStall} 
                onClose={() => setSelectedStall(null)}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full flex items-center justify-center transition-colors">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a tea stall from the map or use the "Surprise Me!" button to explore random spots.
                </p>
              </div>
            )}
          </section>
        </div>
        
        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">Featured Tea Spots</h2>
          </div>
          <StallList 
            stalls={allStalls}
            selectedStall={selectedStall} 
            setSelectedStall={setSelectedStall}
          />
        </section>
      </main>
      
      <footer className="bg-green-800 dark:bg-gray-900 text-white py-8 mt-16 transition-colors">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-bold mb-2">Chaya Spotter</h2>
          <p className="text-green-200 dark:text-green-400 mb-4">Discover the best tea experiences worldwide</p>
          <p className="text-sm text-green-300 dark:text-green-500">© 2025 Chaya Spotter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;