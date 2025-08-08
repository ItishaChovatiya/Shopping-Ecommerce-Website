import React from 'react';
import men from '../../../assets/men.jpg';
import Rating from '@mui/material/Rating';
import { getData } from '../../../utils/Api';

const DisplayReview = () => {
  // getData(`/user/GetReviewData?productId=${props.productId}`).then((res) => {
  //   console.log(res);

  // })
  return (
    <div className="border bg-white shadow-md rounded-2xl max-h-[450px] overflow-y-auto p-4">
      <div key={idx} className="w-full mb-4 border-b pb-4 last:border-b-0">
        <div className="flex items-start gap-4">
          <img
            src={men}
            alt="Reviewer"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-base text-gray-800">Rinku Verma</p>
                <p className="text-sm text-gray-500">2024-12-01</p>
              </div>
              <Rating name="read-only" value={4} readOnly size="small" />
            </div>
            <p className="mt-2 text-gray-700 text-sm md:text-base leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayReview;