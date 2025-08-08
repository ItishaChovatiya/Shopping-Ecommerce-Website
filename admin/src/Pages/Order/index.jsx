import React from "react";
import AllOrdersTable from "../../Components/OrderTable";
import { useState } from "react";

const OrderPage = () => {
  const [searchOrderId, setSearchOrderId] = useState("");
  return (
    <div>
      <div className="flex items-center justify-between p-5">
        <h2 className="text-[20px] font-[600]">Recent Order</h2>
        <div className="flex justify-end items-center mb-4">
          <input
            type="text"
            placeholder="Search by Order ID,Payment ID, Order Status..."
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-72 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
      <div>
        <AllOrdersTable  searchText={searchOrderId}/>
      </div>
    </div>
  );
};

export default OrderPage;
