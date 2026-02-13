import React, { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';

const RequirementsField = ({ label, name, placeholder, errors, setValue, getValues }) => {
  const [requirements, setRequirements] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Initialize from form value (newline-separated string)
    const currentValue = getValues(name);
    if (currentValue && typeof currentValue === 'string' && currentValue.trim()) {
      setRequirements(currentValue.split('\n').filter(req => req.trim()));
    }
  }, []);

  useEffect(() => {
    // Update form value as newline-separated string
    setValue(name, requirements.join('\n'));
  }, [requirements, name, setValue]);

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      setRequirements([...requirements, trimmedValue]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeRequirement = (indexToRemove) => {
    setRequirements(requirements.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label htmlFor={name} className="block text-richblack-5 text-sm font-medium mb-2">
        {label} <span className="text-pink-200">*</span>
      </label>

      <div className={`w-full bg-richblack-700 border ${
        errors[name] ? 'border-pink-200' : 'border-richblack-600'
      } rounded-lg p-4 space-y-3`}>
        
        {/* Input field with Add button */}
        <div className="flex gap-2">
          <input
            type="text"
            id={name}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-richblack-800 text-richblack-5 border border-richblack-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caribbeangreen-300 transition-all"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded font-semibold hover:bg-yellow-100 transition-all"
          >
            Add
          </button>
        </div>

        {/* List of requirements */}
        {requirements.length > 0 && (
          <div className="space-y-2">
            {requirements.map((requirement, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-richblack-800 p-3 rounded border border-richblack-600 group hover:border-caribbeangreen-300 transition-all"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-caribbeangreen-300 text-richblack-900 flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="flex-1 text-richblack-5 text-sm">{requirement}</p>
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-richblack-400 hover:text-pink-200 transition"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {requirements.length === 0 && (
          <p className="text-richblack-400 text-sm text-center py-4">
            No learning points added yet
          </p>
        )}
      </div>

      {errors[name] && (
        <p className="text-pink-200 text-sm mt-1">{errors[name].message}</p>
      )}
      
      <p className="text-richblack-400 text-xs mt-1">
        Add what students will learn from this course
      </p>
    </div>
  );
};

export default RequirementsField;
