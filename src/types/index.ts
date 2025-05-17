export interface TeaStall {
  id: number;
  name: string;
  location: string;
  description: string;
  specialties: string[];
  position: [number, number]; // [latitude, longitude]
  rating: number;
  imageUrl: string;
}