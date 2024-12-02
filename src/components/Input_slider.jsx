import React, { useState } from "react";

const InputSlider = ({ id, label, value, onChange, min, max, step, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-2 relative">
      <label htmlFor={id} className="mb-2 font-bold text-sm flex items-center justify-between">
        {label}
        <span
          className="ml-2 cursor-pointer relative hover:text-red-600"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span className="text-xs font-thin hover:text-red-600">🛈</span>
          {showTooltip && (
            <div className="absolute text-white text-xs rounded p-4 z-50 text-center" style={{ top: '100%', left: '50%', transform: 'translateX(30px) translateY(-100%)' }}>
              {tooltip}
            </div>
          )}
        </span>
      </label>
      <input
        id={id}
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="p-2 rounded w-full  bg-glass2 text-white accent-red-500 focus:ring-2 focus:ring-red-300"
      />
    </div>
  );
};

export default InputSlider;
