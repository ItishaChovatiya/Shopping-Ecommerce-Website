import React from "react";
const ProgressBar = ({ value, type }) => {
  return (
    <div className='w-[100px] h-auto  rounded-md overflow-hidden bg-[#f1f1f1]'>
      <span
        style={{ width: `${value}%` }}
        className={`flex items-center h-[8px] ${type === 'success' ? 'bg-green-600' : ''}`}
      />
    </div>
  );
};

export default ProgressBar
