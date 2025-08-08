import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { ClientContext } from '../../App';
import { postData } from '../../utils/Api';


const CartPage = () => {
  const context = useContext(ClientContext);
  const data = context.cartData;
  const [localQuantities, setLocalQuantities] = useState({});

  const handleRemove = (id) => {
    postData('/v1/Cart/deleteCartQty', {
      productId: id,
      userId: context.userData._id,
    }).then((res) => {
      if (res.success === true) {
        context.alertBox('success', res.message);
        context.CartDataHandler();
      }
    });
  };

  useEffect(() => {
    const initialQuantities = {};
    context.cartData.forEach(item => {
      initialQuantities[item._id] = item.quantity || 1;
    });
    setLocalQuantities(initialQuantities);
  }, [context.cartData]);

  const handleQuantityUpdate = (productId, qty) => {
    if (!qty || isNaN(qty) || parseInt(qty) < 1) {
      context.alertBox('error', 'Please enter a valid quantity');
      return;
    }

    const updateCartObj = {
      productId,
      userId: context.userData._id,
      qty: parseInt(qty),
    };

    postData("/v1/Cart/IncreaseCartQty", updateCartObj).then((res) => {
      if (res.success === true) {
        context.alertBox('success', res.message);
        context.CartDataHandler();
      } else {
        context.alertBox('error', res.message);
      }
    });
  };


  const calculateTotal = () => {
    return context.cartData
      .map((item) => parseInt(item.price || 0) * (item.quantity || 1))
      .reduce((acc, val) => acc + val, 0)
      .toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-1">Your Cart</h2>
          <p className="text-sm text-gray-600 mb-5">
            There are
            <span className="text-green-500 font-bold">{data?.length}</span>{' '}
            products in your cart
          </p>

          {data?.map((item, index) => {
            return (

              <div key={index} className="flex gap-4 border-b mb-2">
                <Link to={`/productDetail/${item?.productId}`} className="w-[20%]">
                  <img
                    src={item?.image}
                    alt="Product"
                    className="h-[80px] object-contain rounded w-full"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/productDetail/${item?.productId}`}>
                    <h3>{item.productName.substr(0,55)}...</h3>
                  </Link>

                  {/* Quantity and Update button */}
                  <div className="mt-2 text-sm flex flex-col gap-2 mb-4">
                    <span className="font-semibold">
                      Price: ₹{item?.price}
                    </span>
                    <span className="font-semibold">
                      Quantity:
                      <input
                        type="number"
                        defaultValue={item?.quantity || 1}
                        onChange={(e) =>
                          setLocalQuantities((prev) => ({
                            ...prev,
                            [item?._id]: e.target.value,
                          }))
                        }
                        className="ml-2 w-[60px] h-[35px] border border-black p-2 rounded outline-none"
                        min={1}
                      />
                      <button
                        onClick={() => handleQuantityUpdate(item?.productId, localQuantities[item?._id] || item?.quantity)}
                        className="ml-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                      >
                        Update Qty
                      </button>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item?.productId)}
                  className="text-gray-500 hover:text-red-600 transition-all text-xl"
                  title="Remove from cart"
                >
                  <IoClose />
                </button>
              </div>


            );
          })}
        </div>


        <div className="w-full lg:w-1/3 bg-white p-6 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-4">Cart Totals</h3>
          <div className="flex justify-between border-b py-2">
            <span>Subtotal</span>
            <span className="font-semibold text-green-500">
              {calculateTotal()}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span>Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span>Estimate for</span>
            <span className="font-medium">India</span>
          </div>
          <div className="flex justify-between border-b py-2 font-semibold">
            <span>Total</span>
            <span className="text-green-500">{calculateTotal()}</span>
          </div>
          <Link to={'/checkout'}>
            <button className="mt-5 w-full btn py-2 rounded font-semibold">
              CHECKOUT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;