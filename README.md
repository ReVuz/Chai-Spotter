# Chai Spotter

Discover finest tea stalls and chai spots with **Chai Spotter**!  
A web app to explore, locate, and celebrate the unique chai culture across Kerala, India.

<img src="https://img.icons8.com/color/96/000000/tea-cup.png" alt="Chaya Spotter Logo" width="48" />

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Chai Spotter** helps tea lovers and travelers discover authentic tea stalls ("chaya kada") across the world.  
Find the perfect spot for your next cup of chai using an interactive map and curated list of the best stalls.

> _"Find your next tea spot ☕"_

---

## Features

- 🗺️ **Interactive Map**: Browse Kerala's tea stalls by location.
- 🎲 **Surprise Me!**: Explore a random tea spot with a single click.
- 🏆 **Featured Chai Spots**: See a curated list of must-visit stalls.
- 🌗 **Dark Mode**: Seamless light/dark theme toggle.
- ⭐ **Ratings & Specialties**: Discover each stall's unique offerings and user ratings.
- 📱 **Responsive Design**: Works beautifully on desktop and mobile.

---


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/ReVuz/Chai-Spotter.git
cd Chai-Spotter
npm install
# or
yarn install
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (or the port specified in your terminal).

---

## Usage

- **Explore** the map to find tea stalls near you or across Kerala.
- **Click** on a marker or a stall card to view details, specialties, and get Google Maps directions.
- **Try "Surprise Me!"** for a random tea adventure.
- **Switch** between light and dark mode using the toggle button.

---

## Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Map**: [React-Leaflet](https://react-leaflet.js.org/)
- **Icons**: Lucide React, Icons8

---

## Data Model

Each tea stall is defined as:

```typescript
interface TeaStall {
  id: number;
  name: string;
  location: string;
  description: string;
  specialties: string[];
  position: [number, number]; // [latitude, longitude]
  rating: number; // 1-5
  imageUrl: string;
}
```

---

## Contributing

Pull requests are welcome!  
If you have suggestions for new tea spots, features, or bug fixes, please open an issue or PR.

**To contribute:**
1. Fork this repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

&copy; 2025 Chai Spotter.  

---

> _Discover the best tea experiences in Kerala with Chai Spotter!_
