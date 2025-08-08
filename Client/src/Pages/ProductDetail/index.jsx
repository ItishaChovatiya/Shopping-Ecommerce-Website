import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ProductZoom from '../../Component/ProductDetail/ProductZoomCom';
import ProductDescription from '../../Component/ProductDetail/ProductDescription';
import ProductReview from '../../Component/ProductDetail/ProductReview';
import ProductDetailComponent from '../../Component/ProductDetail/ProductDetailComponent';
import { getData } from '../../utils/Api';
import { ClientContext } from '../../App';
import Product from '../../Component/Home/DisplayProduct/HomePageProductCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


const ProductDetail = () => {
  const [setCompo, setSetCompo] = useState(0);
  const { id } = useParams();
  const [productData, setProductData] = useState(0);
  const context = useContext(ClientContext)
  const token = localStorage.getItem("accessToken")
  const [relatedData, setRelatedData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0)
    getData(`/v1/product/getsingleProduct/${id}?token=${token}`)
      .then((res) => {
        setProductData(res.product);
        getData(`/v1/product/GetProBySubCatId/${res.product.pro_SubCatId}`).then((res) => {
          setRelatedData(res.products);
        })
      })
      .catch(err => {
        console.error("Error fetching product:", err);
      });
  }, [id])
  return (
    <>
      <section className='bg-white'>
        <div className='container mx-auto px-4 flex flex-col lg:flex-row gap-6'>
          <div className='w-full lg:w-[40%]'>
            <ProductZoom data={productData} />
          </div>
          <div className='w-full lg:w-[60%]'>
            <ProductDetailComponent data={productData} />
          </div>
        </div>

        <div className='container mx-auto  pt-10'>
          <div className='flex flex-wrap gap-3'>
            <Button variant={setCompo === 0 ? 'contained' : 'outlined'} onClick={() => setSetCompo(0)}>
              Description
            </Button>
            <Button variant={setCompo === 1 ? 'contained' : 'outlined'} onClick={() => setSetCompo(1)}>
              Review
            </Button>

          </div>
        </div>

        <div className='container mx-auto  pt-5'>
          <div className='border bg-[#f9f9f9] rounded-md'>
            {setCompo === 0 && <ProductDescription data={productData} />}
            {setCompo === 1 && <ProductReview userId={context?.userData?._id} productId={productData?._id} />}
          </div>
        </div>

        <div>
          <section className="bg-white my-5 mt-[18px]">
            <div className="container px-4 md:px-0">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="w-full md:w-auto">
                  <h1 className="text-xl md:text-3xl font-semibold">Related Product</h1>
                               </div>
              </div>
            </div>
          </section>
          <div className='container'>
            <Swiper
              slidesPerView={5}
              spaceBetween={15}
              modules={[Navigation]}
              navigation={true}
              className="mySwiper"
            >
              {
                relatedData?.map((data, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Product data={data} />
                    </SwiperSlide>
                  )
                })
              }
            </Swiper>
          </div>

        </div>

      </section>
    </>
  );
};

export default ProductDetail;
