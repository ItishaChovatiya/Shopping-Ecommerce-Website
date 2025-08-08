import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import Badge from "../../Component/Badge";
import { ClientContext } from "../../App";
import image from "../../assets/p5.jpeg";

const MyOrder = () => {
  const [isShowProduct, setIsshowProduct] = useState(null);
  const context = useContext(ClientContext);

  const isShowOrderProduct = (index) => {
    setIsshowProduct((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full">
      <div className="container py-5">
        <div className="mb-4">
          <h2 className="text-xl font-semibold pb-2">My Profile</h2>
          <p>
            There are{" "}
            <span className="text-[#4cca4c] font-bold">
              {context?.order?.length || 0}
            </span>{" "}
            orders in your account.
          </p>
        </div>

        <div className="grid gap-6">
          {context?.order?.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-semibold text-gray-800">{item.paymentId}</p>
                </div>
                <div className="text-right">
                  <Badge status={item.order_status} />
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">User Contact</p>
                  <p className="font-medium">
                    {context?.userData?.mobile || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium">
                    {item.delivery_address?.address_line},{" "}
                    {item.delivery_address?.landMark},{" "}
                    {item.delivery_address?.city},{" "}
                    {item.delivery_address?.state} -{" "}
                    {item.delivery_address?.pincode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-semibold text-green-600">
                    ₹{item.totalAmount}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  className="!rounded-lg !bg-blue-100 !text-blue-600 !text-sm !px-4 !py-1"
                  onClick={() => isShowOrderProduct(index)}
                >
                  {isShowProduct === index ? "Hide Products" : "View Products"}
                </Button>
              </div>

              {isShowProduct === index && (
                <div className="mt-4">
                  <h3 className="text-[15px] font-semibold mb-2">
                    Ordered Products
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Product</th>
                          <th className="px-4 py-2 text-left">Quantity</th>
                          <th className="px-4 py-2 text-left">Price</th>
                          <th className="px-4 py-2 text-left">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.products.map((product, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-4 py-2 flex items-center gap-2">
                              <img
                                src={product.image || image}
                                alt="product"
                                className="w-10 h-10 rounded object-cover"
                              />
                              <span>{product.productTitle}</span>
                            </td>
                            <td className="px-4 py-2">{product.quantity}</td>
                            <td className="px-4 py-2">₹{product.price}</td>
                            <td className="px-4 py-2">₹{product.subTotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
