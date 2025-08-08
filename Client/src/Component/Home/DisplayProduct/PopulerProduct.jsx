import React, { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Product from './HomePageProductCart';
import { ClientContext } from '../../../App';


const DisplayPopulerProduct = () => {

    const context = useContext(ClientContext)

    return (
        <div>
            <section className="bg-white my-5 mt-[18px]">
                <div className="container px-4 md:px-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="w-full md:w-auto">
                            <h1 className="text-xl md:text-3xl font-semibold">Popular Product</h1>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container flex gap-4 overflow-x-auto no-scrollbar w-full px-2">
                {
                    context?.productsData?.slice(5, 10)?.map((product, index) => (
                        <div key={index} >
                            <Product data={product} />
                        </div>
                    ))
                }
            </div>



        </div>
    )
}

export default DisplayPopulerProduct
