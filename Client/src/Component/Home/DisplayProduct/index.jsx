import React, { useContext, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Product from './HomePageProductCart';
import { ClientContext } from '../../../App';
import { getData } from '../../../utils/Api';

const DisplayProduct = () => {
    const context = useContext(ClientContext);
    const [value, setValue] = useState(0);
    const [filterData, setFilterData] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false); 

    const handleChange = (newValue) => {
        setValue(newValue);    // newValue get automatically index by material UI 
    };

    const filterProductByCatId = (catId) => {
        getData(`/v1/product/GetProByCatId/${catId}`).then((res) => {
            setFilterData(res.products || []);
            setIsFiltered(true);
        });
    };

    return (
        <div>
            <section className="bg-white my-5 !mt-[70px]">
                <div className="container px-4 md:px-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="w-full md:w-auto">
                            <h1 className="text-xl md:text-2xl font-semibold">Popular Product</h1>
                            <p className="text-sm text-gray-600">Don't miss offer to buy your product</p>
                        </div>
                        <div className="w-full md:w-[60%] lg:w-[45%]">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                {context?.catData.map((category, index) => (
                                    <Tab
                                        key={category._id || index}
                                        label={category.Name}
                                        onClick={() => filterProductByCatId(category._id)}
                                        sx={{
                                            color: value === index ? 'primary.main' : 'text.secondary',
                                            fontWeight: value === index ? 'bold' : 'normal',
                                            borderBottom: value === index ? '2px solid #1976d2' : 'none',
                                        }}
                                    />
                                ))}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container">
                <Swiper
                    slidesPerView={5}
                    spaceBetween={15}
                    modules={[Navigation]}
                    navigation={true}
                    className="mySwiper"
                >
                    {
                        isFiltered
                            ? filterData.map((product, index) => (
                                <SwiperSlide key={index}>
                                    <Product data={product} />
                                </SwiperSlide>
                              ))
                            : context.productsData.map((product, index) => (
                                <SwiperSlide key={index}>
                                    <Product data={product} />
                                </SwiperSlide>
                              ))
                    }
                </Swiper>
            </div>
        </div>
    );
};

export default DisplayProduct;
