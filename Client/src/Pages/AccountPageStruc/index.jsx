import React from 'react'
import { Outlet } from 'react-router-dom'
import AccountSideBar from '../../Component/AccountSidebar'

const AccountPageStucture = () => {
    return (
        <div className="bg-gray-100 py-10 w-full">
            <div className='container flex flex-col sm:flex-row gap-5'>
                <div className='lg:w-[20%] sm:w-[100%] md:w-[50%]'>
                    <AccountSideBar />
                </div>
                <div className='lg:w-[80%] md:w-[50%] sm:w-[100%] p-5 shadow-md rounded-md bg-white'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AccountPageStucture
