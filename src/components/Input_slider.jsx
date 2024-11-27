import React, { useState } from "react";

const InputSlider = ({ label, value, onChange, min, max, step, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-4 relative">
      <label className="mb-2 font-bold text-sm flex items-center justify-between">
        {label}
        <span
          className="ml-2 cursor-pointer relative hover:text-red-600"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          🛈
          {showTooltip && (
            <div className="absolute  bg-glass2 text-white text-xs rounded py-1 px-2 z-50" style={{ top: '100%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>
              {tooltip}
            </div>
          )}
        </span>
      </label>
      <input
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
