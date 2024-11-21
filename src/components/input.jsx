import React from 'react';

function Input({ onSelectChange }) {
  return (
    <div className="flex flex-col justify-center items-center w-1/5 absolute left-0 z-50 bottom-[10%] top-[10%] bg-glass rounded-r-3xl">
      <label htmlFor="world-select" className="mb-2">Wähle ein World-Bild:</label>
      <select id="world-select" onChange={(e) => onSelectChange(e.target.value)} className="p-2 rounded w-2/3 bg-transparent">
        <option value="earthDark">Dunkle Erde</option>
        <option value="earthMarble">Blaue Marmor Erde</option>
        <option value="earthNight">Nacht Erde</option>
        <option value="earthWater">Wasser Erde</option>
        <option value="earthHighRes">Hochauflösende Erde</option>
      </select>
    </div>
  );
}

export default Input;
