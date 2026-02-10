import React from 'react';
import { FiCheck } from 'react-icons/fi';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Course Information' },
    { number: 2, title: 'Course Builder' },
    { number: 3, title: 'Publish' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-caribbeangreen-700 text-caribbeangreen-50'
                    : currentStep === step.number
                    ? 'bg-yellow-50 text-richblack-900 ring-4 ring-yellow-50/20'
                    : 'bg-richblack-700 text-richblack-300'
                }`}
              >
                {currentStep > step.number ? (
                  <FiCheck size={20} />
                ) : (
                  step.number
                )}
              </div>
              <p
                className={`mt-2 text-sm font-medium transition-colors ${
                  currentStep >= step.number
                    ? 'text-richblack-5'
                    : 'text-richblack-400'
                }`}
              >
                {step.title}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 mb-8">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-caribbeangreen-700'
                      : 'bg-richblack-700'
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
