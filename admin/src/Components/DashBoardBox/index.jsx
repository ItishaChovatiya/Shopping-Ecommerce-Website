import React from "react";
import { FaGift } from "react-icons/fa6";
import { IoStatsChartSharp } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { AiOutlinePieChart } from "react-icons/ai";
import { RiBankLine } from "react-icons/ri";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { useContext } from "react";
import { MyContext } from "../../App";


const DashBoardBoxes = () => {
  const context = useContext(MyContext);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
      {/* Orders Card */}
      <div className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 border border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <FaGift className="text-blue-500 text-xl" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Orders</h3>
              <p className="text-xl font-bold text-gray-800">
                {context?.order?.length}
              </p>
            </div>
          </div>
          <IoStatsChartSharp className="text-[40px] text-blue-500 opacity-20" />
        </div>
        <div className="mt-4 flex items-center text-green-600 text-sm font-medium gap-2">
          <FaArrowUpRightDots className="text-sm" />
          +32.40%
          <span className="text-gray-500 font-normal ml-1">
            from last month
          </span>
        </div>
      </div>

      {/* Sales Card */}
      <div className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 border border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <AiOutlinePieChart className="text-emerald-500 text-xl" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Total User</h3>
              <p className="text-xl font-bold text-gray-800">
                {context?.Users?.length}
              </p>
            </div>
          </div>
          <IoStatsChartSharp className="text-[40px] text-emerald-500 opacity-20" />
        </div>
        <div className="mt-4 flex items-center text-green-600 text-sm font-medium gap-2">
          <FaArrowUpRightDots className="text-sm" />
          +32.40%
          <span className="text-gray-500 font-normal ml-1">
            from last month
          </span>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 border border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-xl">
              <RiBankLine className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Total Review</h3>
              <p className="text-xl font-bold text-gray-800">
                {context?.reviews?.length}
              </p>
            </div>
          </div>
          <IoStatsChartSharp className="text-[40px] text-purple-600 opacity-20" />
        </div>
        <div className="mt-4 flex items-center text-green-600 text-sm font-medium gap-2">
          <FaArrowUpRightDots className="text-sm" />
          +32.40%
          <span className="text-gray-500 font-normal ml-1">
            from last month
          </span>
        </div>
      </div>
      {/* Products Card */}
      <div className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 border border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-xl">
              <AiFillProduct className="text-pink-400 text-xl" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Products</h3>
              <p className="text-xl font-bold text-gray-800">
                {context?.Products?.length}
              </p>
            </div>
          </div>
          <IoStatsChartSharp className="text-[40px] text-purple-600 opacity-20" />
        </div>
        <div className="mt-4 flex items-center text-green-600 text-sm font-medium gap-2">
          <FaArrowUpRightDots className="text-sm" />
          +32.40%
          <span className="text-gray-500 font-normal ml-1">
            from last month
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashBoardBoxes;
