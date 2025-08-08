import React, { useEffect, useState } from 'react';
import { getData } from '../../../utils/Api';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const BlogItem = () => {
    const [blog, setBlog] = useState([]);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        getData(`/v1/Blog/GetBlogData?token=${token}`).then((res) => {
            setBlog(res.Blog);
        });
    }, []);

    return (
        <div className="container my-10">
            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                    768: {
                        slidesPerView: 2
                    }
                }}
            >
                {blog.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className="shadow border h-[470px]">
                            <div className="mb-4  overflow-hidden">
                                <img
                                    src={item.image?.[0]}
                                    alt={item.Name}
                                    className="w-full h-[300px] object-cover"
                                />
                            </div>
                            <div className='p-3'>
                                <h3 className="text-xl font-semibold mb-2">{item.Name.slice(0, 50)}...</h3>
                                <p className="text-gray-600 line-clamp-3 mb-4">{item.description.slice(0,100)}...</p>
                                <Link
                                    to={`/Blog/Details/${item._id}`}
                                    className="inline-block text-blue-600 hover:underline font-medium"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BlogItem;
