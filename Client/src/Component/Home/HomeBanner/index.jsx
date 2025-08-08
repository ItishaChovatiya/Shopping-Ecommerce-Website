import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect } from 'react';
import { getData } from '../../../utils/Api';


const Carousel = () => {
    const [data, setData] = React.useState([]);
    useEffect(() => {
        getData("/v1/HomeBanner/getBanners").then((res) => {
            setData(res.BannerData)
        })
    }, [])
    return (
        <div className="w-full h-full">
            <Swiper loop={data.length > 1} navigation={true} modules={[Navigation, Autoplay]} autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }} className="mySwiper h-full">
                {
                    data?.length > 0 && data.map((item, index) => {
                        return (
                            <SwiperSlide className="h-full" key={index}>
                                <div className=' rounded-md '>
                                    <img src={item.image} alt='causal' className='w-full h-full object-cover' />
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}
export default Carousel
