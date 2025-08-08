import React, { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { Button } from '@mui/material';
import { getData } from '../../utils/Api';

const ProductDetail = (props) => {
    const [added, setAdded] = useState(false);
    const handleClick = () => {
        setAdded(!added);
    };
    const [productData, setProductData] = useState();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const fetchData = async () => {
            try {
                const data = await getData(`/v1/product/GetSingleProduct/${props.id}?token=${token}`);
                setProductData(data.product);
                // console.log(data.product);
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        fetchData();
    }, [props.id]);

    return (
        <div className='px-3 md:px-5 flex flex-col'>
            <h1 className='text-[22px] md:text-[25px] font-semibold'>{productData?.pro_Name}</h1>

            <div className='flex flex-wrap items-center gap-2 text-[15px] md:text-[17px] text-gray-400 pb-3'>
                <span>Brand name: <span className='text-black'>{productData?.pro_brand}</span></span>
                <Rating name="simple-controlled" value={productData?.pro_rating ?? 0} readOnly />
                <span className='text-black'>Review({productData?.pro_rating ?? 0})</span>
            </div>

            <p className='pb-3 text-sm md:text-base'>
                About: {productData?.pro_desc}
            </p>

            <div className='flex flex-wrap items-center pb-2 text-sm md:text-base'>
                <p className='line-through pr-3 text-gray-400'>{productData?.pro_old_price}</p>
                <p className='text-[18px] font-medium text-[rgba(105,216,105)]'>{productData?.pro_price}</p>
            </div>

            <p className='text-sm md:text-base'>Available In Stock: <span className='text-[rgba(105,216,105)]'>{productData?.pro_stoke} Items</span></p>

           
        </div>
    );
};

export default ProductDetail;
