import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

const ChipInput = ({ label, name, placeholder, register, errors, setValue, getValues }) => {
  const [chips, setChips] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Initialize chips from form value
    const currentValue = getValues(name);
    if (currentValue && Array.isArray(currentValue) && currentValue.length > 0) {
      setChips(currentValue);
    }
  }, []);

  useEffect(() => {
    // Update form value when chips change
    setValue(name, chips);
  }, [chips, name, setValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addChip();
    }
  };

  const addChip = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !chips.includes(trimmedValue)) {
      setChips([...chips, trimmedValue]);
      setInputValue('');
    }
  };

  const removeChip = (indexToRemove) => {
    setChips(chips.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label htmlFor={name} className="block text-richblack-5 text-sm font-medium mb-2">
        {label} <span className="text-pink-200">*</span>
      </label>
      
      <div className={`w-full bg-richblack-700 border ${
        errors[name] ? 'border-pink-200' : 'border-richblack-600'
      } rounded-lg p-2 focus-within:ring-2 focus-within:ring-caribbeangreen-300 transition-all`}>
        
        {/* Display chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {chips.map((chip, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-yellow-100 text-richblack-900 px-3 py-1 rounded-full text-sm font-medium"
              >
                <span>{chip}</span>
                <button
                  type="button"
                  onClick={() => removeChip(index)}
                  className="hover:text-pink-500 transition"
                >
                  <MdClose size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input field */}
        <input
          type="text"
          id={name}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addChip}
          placeholder={placeholder}
          className="w-full bg-transparent text-richblack-5 outline-none px-2 py-1"
        />
      </div>

      {errors[name] && (
        <p className="text-pink-200 text-sm mt-1">{errors[name].message}</p>
      )}
      
      <p className="text-richblack-400 text-xs mt-1">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
};

export default ChipInput;
