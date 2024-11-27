import React, { useState } from "react";

const InputSelect = ({ label, value, onChange, options, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-4 relative">
      <label className="mb-2 font-bold text-sm flex items-center justify-between">
        {label}
        <span
          className="ml-2 cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          🛈
          {showTooltip && (
            <div className="absolute bg-glass2 text-white text-xs rounded py-1 px-2 z-50" style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
              {tooltip}
            </div>
          )}
        </span>
      </label>
      <select
        value={value}
        onChange={onChange}
        className="p-2 rounded w-full bg-transparent text-xs border border-gray-300"
      >
        {options.map(([name, val]) => (
          <option key={val} value={val}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;