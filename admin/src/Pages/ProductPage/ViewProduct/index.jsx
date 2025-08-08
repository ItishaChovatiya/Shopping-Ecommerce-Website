import React from 'react'
import ProductZoom from '../../../Components/ProductDetailsComponent/ProductZoom'
import ProductDetail from '../../../Components/ProductDetailsComponent/ProductData'
import { useParams } from 'react-router-dom'

const ViewProduct = () => {
    const { id } = useParams()
    return (
        <div>
            <div className='container mx-auto px-4 flex flex-col lg:flex-row gap-6'>
                <div className='w-full lg:w-[40%]'>
                    <ProductZoom id={id} />
                </div>
                <div className='w-full lg:w-[60%]'>
                    <ProductDetail id={id}/>
                </div>
            </div>
        </div>
    )
}

export default ViewProduct
