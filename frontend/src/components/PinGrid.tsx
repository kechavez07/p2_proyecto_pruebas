import PinCard from './PinCard';
import { useEffect, useState } from 'react';
import React from 'react';

const PinGrid = () => {
  const [pins, setPins] = useState<any[]>([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/pins/getPins')
      .then((res) => res.json())
      .then((data) => setPins(data));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {pins.map((pin) => (
          <div key={pin.id} className="break-inside-avoid mb-4">
            <PinCard
              id={pin.id}
              imageUrl={pin.imageUrl}
              title={pin.title}
              description={pin.description}
              author={{
                name: pin.authorName,
                avatar: pin.authorAvatar
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinGrid;