import React, { useEffect, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getData } from "../../utils/Api";

const ProductZoom = (props) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const smallSlider = useRef();
  const bigSlider = useRef();
  const [productImageData, setProductImageData] = useState();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const fetchData = async () => {
      try {
        const data = await getData(
          `/v1/product/GetSingleProduct/${props.id}?token=${token}`
        );
        setProductImageData(data.product.pro_img);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchData();
  }, [props.id]);

  const goto = (index) => {
    setSlideIndex(index);
    smallSlider.current.swiper.slideTo(index);
    bigSlider.current.swiper.slideTo(index);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 h-[800px]">
      {/* swiper slider image */}
      <div className="slider w-full md:w-[15%] order-2 md:order-1 mt-3 md:mt-0">
        <Swiper
          ref={smallSlider}
          direction={"vertical"}
          slidesPerView={4}
          spaceBetween={3}
          modules={[Navigation]}
          navigation={true}
          className="zoomPructThumbs h-[600px] overflow-hidden"
        >
          {productImageData?.map((imgData, index) => (
            <SwiperSlide key={index}>
              <div
                className={`cursor-pointer ${
                  slideIndex === index ? "opacity-100" : "opacity-30"
                }`}
                onClick={() => goto(index)}
              >
                <img
                  src={imgData}
                  alt={`thumb-${index}`}
                  className="w-full transition-all group-hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* big image display */}
      <div className="w-full md:w-[85%] h-[800px] md:h-[500px] order-1 md:order-2">
        <Swiper
          ref={bigSlider}
          slidesPerView={1}
          spaceBetween={0}
          navigation={false}
        >
          {productImageData?.map((imgData, index) => (
            <SwiperSlide key={index}>
              <InnerImageZoom
                src={imgData}
                zoomType="hover"
                zoomScale={1.5}
                alt={`product-${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductZoom;
