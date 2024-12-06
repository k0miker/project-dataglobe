import React, { useState } from "react";

const InputCheckbox = ({ id, label, checked, onChange, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-0">
      <label htmlFor={id} className="mb-2 font-bold text-sm flex items-center justify-end cursor-pointer">
        <span className="mr-2 text-xs text-left w-full">{label}</span>
        <div className="relative justify-self-start ">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div
            className={`block ${checked ? "bg-green-600" : "bg-red-600"} w-7 h-4 rounded-full`}
          ></div>
          <div
            className={`dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition transform ${checked ? "translate-x-full bg-red-500" : ""}`}
          ></div>
        </div>
        <span
          className="ml-2 cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <span className="text-xs font-thin hover:text-red-600">🛈</span>
          {showTooltip && (
            <div className="absolute bg-glass2 text-white text-xs rounded py-1 px-2 z-50 text-center" style={{ top: '100%', left: '50%', transform: 'translateX(-60%) translateY(-350%)' }}>
            {tooltip}
          </div>
          )}
        </span>
      </label>
    </div>
  );
};

export default InputCheckbox;
