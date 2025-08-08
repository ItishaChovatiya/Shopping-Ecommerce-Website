import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';


const CatSlider = (props) => {

  return (
    <div className="container">
      <Swiper
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          480: { slidesPerView: 3, spaceBetween: 10 },
          768: { slidesPerView: 4, spaceBetween: 15 },
          1024: { slidesPerView: 5, spaceBetween: 20 },
        }}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {props.catData.map((category, index) => (
          <SwiperSlide
            key={index}
            className="border border-gray-300 rounded-md px-4 py-4 bg-white !w-[10%] !h-[180px] flex items-center justify-center"
          >
            <img src={category.images} alt={category.name} className='w-full h-[70%]' />
            <Link to="/" className="block w-full h-full text-center hover:text-green-500 text-wrap mt-2 mb-2">
              {category.Name}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CatSlider;
