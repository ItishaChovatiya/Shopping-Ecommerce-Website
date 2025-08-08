import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { ClientContext } from '../../App';
import AccountSideBar from '../../Component/AccountSidebar';
import { IoClose } from "react-icons/io5";
import { Rating } from '@mui/material';
import { Button } from 'antd';
import { getData } from '../../utils/Api';
import Empty_List from "../../assets/Empty_List.jpg"


const MyListPage = () => {
    const context = useContext(ClientContext)
    const token = localStorage.getItem("accessToken")

    const [myListData, setMyListData] = useState([]);

    const removeMyListItemHadler = (id) => {
        context.removeMyListItemHadler(id)
    }

    useEffect(() => {
        getData(`/v1/MyList/GetMyList?token=${token}`).then((res) => {
            setMyListData(res.data);
        })
    }, [myListData])


    return (

        <div className="w-full">
            <div className='container gap-5'>
                <div>
                    {
                        myListData?.length === 0 ? (
                            <img src={Empty_List} className="w-full h-[380px] object-fill" alt='List IS Empty' />
                        ) : (
                            <div>
                                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
                                    <div className="w-[100%] m-auto  !text-gray-900 p-6 rounded-md shadow-md">
                                        <h2 className="text-xl font-semibold mb-1">My List</h2>
                                        <p className="text-sm text-gray-500 mb-5">
                                            There are <span className="text-green-500 font-bold">{context?.myListData?.length}</span> products in My List
                                        </p>
                                        {
                                            myListData?.map((item, index) => {
                                                return (
                                                    <div key={index} className="flex gap-4 border-b mb-2">
                                                        <img src={item.image} alt="Product" className="w-[20%] h-[100px] object-contain rounded" />
                                                        <div className="flex-1">
                                                            <h3 className="text-[18px] font-600">{item.productName}</h3>
                                                            <div className="mt-2 text-sm">
                                                                <span className="font-semibold mr-1 text-[17px]">Price :- {item.price}</span>
                                                                <span className="line-through text-gray-300 mr-2">{item.oldPrice}</span>
                                                                <span className="text-green-800 text-[20px] mr-2">{item.discount}%</span>
                                                            </div>
                                                            <Rating value={item.rating} readOnly className='mt-2' />
                                                        </div>
                                                        <Button><IoClose onClick={() => removeMyListItemHadler(item.productId)} /></Button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default MyListPage
