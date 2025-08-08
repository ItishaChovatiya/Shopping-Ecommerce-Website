import React from 'react';

const ProductDescription = (props) => {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-6">
      <h2 className="text-xl font-[500] mb-4 md:mb-6 border-b pb-2">
        Product Description
      </h2>
      <div className="space-y-5 md:space-y-6 text-gray-700 leading-relaxed text-sm md:text-base font-sans">
        <pre  className="mt-2 text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
          {props.data.pro_desc}
        </pre>
      </div>
    </div>
  );
};

export default ProductDescription;
