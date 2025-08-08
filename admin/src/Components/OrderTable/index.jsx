import React, { useState, useContext } from "react";
import { Button, MenuItem, Select } from "@mui/material";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// import Badge from "../../Component/Badge";
import axios from "axios";
import { MyContext } from "../../App";
import Pagination from "@mui/material/Pagination";

const AllOrdersTable = (props) => {
  const context = useContext(MyContext);
  const [isShowProduct, setIsShowProduct] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; 
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const filteredOrders = context?.order?.filter(
    (item) =>
      item?._id?.includes(props.searchText) ||
      item?.paymentId?.includes(props.searchText) ||
      item?.order_status
        ?.toLowerCase()
        .includes(props.searchText?.toLowerCase())
  );

  const paginatedOrders = filteredOrders?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const isShowOrderProduct = (index) => {
    setIsShowProduct((prev) => (prev === index ? null : index));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));

    try {
      await axios.put(
        "http://localhost:3001/v1/Order/UpdateStatus",
        {
          orderId,
          order_status: newStatus,
        }
      );
      context.alertBox("success", "Order Status Updated..");
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="border border-gray-200 rounded-lg shadow-md min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr className="border-b text-[14px] font-[300]">
              <th className="px-4 py-2 ">&nbsp;</th>
              <th className="px-4 py-2 whitespace-nowrap">Order ID</th>
              <th className="px-4 py-2 whitespace-nowrap">Payment ID</th>
              <th className="px-4 py-2 whitespace-nowrap">Name</th>
              <th className="px-4 py-2 whitespace-nowrap">Phone Number</th>
              <th className="px-4 py-2 whitespace-nowrap">Address</th>
              <th className="px-4 py-2 whitespace-nowrap">Pincode</th>
              <th className="px-4 py-2 whitespace-nowrap">Total Amount</th>
              <th className="px-4 py-2 whitespace-nowrap">Email</th>
              <th className="px-4 py-2 whitespace-nowrap">User ID</th>
              <th className="px-4 py-2 whitespace-nowrap">Order Status</th>
              <th className="px-4 py-2 whitespace-nowrap">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders?.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="!p-0 !m-0 border-b text-[15px]">
                  <td className="px-4">
                    <Button
                      className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                      onClick={() => isShowOrderProduct(index)}
                    >
                      {isShowProduct === index ? (
                        <FaAngleDown className="text-[18px]" />
                      ) : (
                        <FaAngleUp className="text-[18px]" />
                      )}
                    </Button>
                  </td>
                  <td className="px-4">{item._id}</td>
                  <td className="px-4">{item.paymentId}</td>
                  <td className="px-4 whitespace-nowrap">
                    {context?.userData?.fullName || "John Doe"}
                  </td>
                  <td className="px-4">{context?.userData?.mobile || "Not Added"}</td>
                  <td className="px-4">
                    <span className="block w-[300px]">
                      {item.delivery_address?.address_line},{" "}
                      {item.delivery_address?.landMark},{" "}
                      {item.delivery_address?.city},{" "}
                      {item.delivery_address?.state}
                    </span>
                  </td>
                  <td className="px-4">{item.delivery_address?.pincode}</td>
                  <td className="px-4">₹{item.totalAmount}</td>
                  <td className="px-4">
                    <span className="block">
                      {context?.userData?.email || "user@gmail.com"}
                    </span>
                  </td>
                  <td className="px-4">
                    <span className="block">
                      {context?.userData?._id || "123456user"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {/* <Badge status={item.order_status} /> */}
                    <Select
                      value={statusMap[item._id] || item.order_status}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      className="!text-xs !bg-white !mt-1"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confairm">Confirmed</MenuItem>
                      <MenuItem value="deliverd">Delivered</MenuItem>
                    </Select>
                  </td>
                  <td className="px-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>

                {isShowProduct === index && (
                  <tr>
                    <td colSpan={12} className="pl-20 bg-gray-50">
                      <div className="overflow-x-auto p-4">
                        <table className="bg-white border border-gray-200 rounded-lg shadow-md">
                          <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr className="border-b text-[14px] font-[300]">
                              <th className="px-4 py-1 whitespace-nowrap">
                                Product ID
                              </th>
                              <th className="px-4 py-1 whitespace-nowrap">
                                Image
                              </th>
                              <th className="px-4 py-1 whitespace-nowrap">
                                Quantity
                              </th>
                              <th className="px-4 py-1 whitespace-nowrap">
                                Price
                              </th>
                              <th className="px-4 py-1 whitespace-nowrap">
                                Subtotal
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.products?.map((product, i) => (
                              <tr key={i} className="border-b text-[15px]">
                                <td className="px-4 py-1">
                                  {product.productId}
                                </td>
                                <td className="px-4 py-1">
                                  <img
                                    src={product.image}
                                    alt="product"
                                    className="w-[40px] h-[40px] rounded object-cover"
                                  />
                                </td>
                                <td className="px-4 py-1">
                                  {product.quantity}
                                </td>
                                <td className="px-4 py-1">₹{product.price}</td>
                                <td className="px-4 py-1">
                                  ₹{product.subTotal}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-3  flex justify-center">
        <Pagination
          count={Math.ceil((filteredOrders?.length || 0) / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default AllOrdersTable;
