import React, { useRef, useState, useEffect } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductZoom = (props) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const smallSlider = useRef(null);
    const bigSlider = useRef(null);

    const images = props?.data?.pro_img || [];

    const goto = (index) => {
        setSlideIndex(index);
        if (smallSlider.current?.swiper && bigSlider.current?.swiper) {
            smallSlider.current.swiper.slideTo(index);
            bigSlider.current.swiper.slideTo(index);
        }
    };

    useEffect(() => {
        if (smallSlider.current?.swiper && bigSlider.current?.swiper) {
            smallSlider.current.swiper.slideTo(slideIndex);
            bigSlider.current.swiper.slideTo(slideIndex);
        }
    }, [slideIndex]);

    return (
        <div className='flex flex-col md:flex-row gap-3'>
            {/* Thumbnail Slider */}
            <div className='slider w-full md:w-[15%] order-2 md:order-1 mt-3 md:mt-0'>
                <Swiper
                    ref={smallSlider}
                    direction='vertical'
                    slidesPerView={4}
                    spaceBetween={3}
                    modules={[Navigation]}
                    navigation={true}
                    className="zoomProductThumbs h-[500px] overflow-hidden"
                >
                    {images.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className={`item cursor-pointer group ${slideIndex === index ? 'opacity-1' : 'opacity-30'}`}
                                onClick={() => goto(index)}
                            >
                                <img src={item} alt={`thumb-${index}`} className='w-full transition-all group-hover:scale-105' />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Zoom Image Slider */}
            <div className='innerZoom w-full md:w-[85%] h-[400px] md:h-[500px] overflow-hidden order-1 md:order-2'>
                <Swiper
                    ref={bigSlider}
                    slidesPerView={1}
                    spaceBetween={0}
                    navigation={false}
                >
                    {images.map((item, index) => (
                        <SwiperSlide key={index}>
                            <InnerImageZoom src={item} zoomType='hover' zoomScale={1.5} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ProductZoom;
