import React, { useState } from "react";

const InputSelect = ({ id, label, value, onChange, options, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-2 relative">
      <label htmlFor={id} className="flex justify-between mb-2 text-sm font-medium  text-gray-900 dark:text-white">
        {label}
        <span
          className="ml-2 cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <span className="text-xs font-thin hover:text-red-600">🛈</span>
          {showTooltip && (
            <div className="absolute bg-glass2 text-white text-xs rounded py-1 px-2 z-50 text-center" style={{ top: '100%', left: '50%', transform: 'translateX(105px) translateY(-50%)' }}>
              {tooltip}
            </div>
          )}
        </span>
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="bg-gray-50 p-1 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full bg-transparent dark:border-gray-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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