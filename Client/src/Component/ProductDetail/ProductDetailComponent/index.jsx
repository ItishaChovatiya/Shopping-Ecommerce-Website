import React, { useContext, useRef, useState } from "react";
import Rating from "@mui/material/Rating";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { Button } from "@mui/material";
import { ClientContext } from "../../../App";

const ProductDetailComponent = ({ data }) => {
  const context = useContext(ClientContext);
  const qtyRef = useRef();

  const [selectedOptions, setSelectedOptions] = useState({
    ram: "",
    size: "",
    weight: "",
  });
  const [isShowTabs, setIsShowTabs] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleVariantSelect = (type, value) => {
    setSelectedOptions((prev) => ({ ...prev, [type]: value }));
  };

  const AddToCartHandler = () => {
    const quantity = parseInt(qtyRef?.current?.value) || 1;
    const user_id = context?.userData?._id;
    const hasVariants = data?.pro_Size?.length || data?.pro_RAM?.length;

    // Check if variant selection is required but not selected
    if (hasVariants && !selectedOptions.ram && !selectedOptions.size) {
      setIsShowTabs(true);
      return;
    }

    const productItem = {
      productId: data._id,
      user_id,
      quantity,
      price: parseInt(data.pro_price * quantity),
      productName: data.pro_Name,
      image: data.pro_img?.[0],
      subTotal: data.pro_price,
      countInStoke: data.pro_stoke,
      brand: data.pro_brand,
      size: data?.pro_Size?.length ? selectedOptions.size : "",
      ram: data?.pro_RAM?.length ? selectedOptions.ram : "",
      weight: data?.pro_Weight?.length ? selectedOptions.weight : "",
      discount: data.pro_discount,
      oldPrice: data.pro_old_price,
    };

    context.addToCartHandler(productItem, user_id, quantity);
    setIsAdded(true);
    setIsShowTabs(false);
  };

  const mylisthandler = (item) => {
    const alreadyInList = context?.myListData?.some(
      (x) => x.productId === String(item._id)
    );

    if (alreadyInList) {
      context.removeMyListItemHadler(item._id);
    } else {
      context.AddToMyListHandler(item);
    }
  };

  return (
    <div className="px-3 md:px-5 flex flex-col">
      <h1 className="text-[22px] md:text-[25px] font-semibold">
        Name: {data.pro_Name}
      </h1>

      <div className="flex flex-wrap items-center gap-2 text-[15px] md:text-[17px] text-gray-400 pb-3">
        <span>
          Brand: <span className="text-black">{data.pro_brand}</span>
        </span>
        <Rating
          name="read-only"
          value={parseFloat(data.pro_rating)}
          precision={0.5}
          readOnly
        />
        <span className="text-black">Review(5)</span>
      </div>

      <div className="flex flex-wrap items-center pb-2 text-sm md:text-base">
        <p className="line-through pr-3 text-gray-400">
          &#8377;{data.pro_old_price}
        </p>
        <p className="text-[18px] font-medium text-[rgba(105,216,105)]">
          &#8377;{data.pro_price}
        </p>
      </div>

      <p className="text-sm md:text-base">
        Available In Stock:{" "}
        <span className="text-[rgba(105,216,105)]">{data.pro_stoke} Items</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <input
          ref={qtyRef}
          type="number"
          name="qty"
          className="w-[100px] h-[40px] border p-2 outline-none"
          defaultValue={1}
          min={1}
        />
        <Button
          variant="contained"
          className="w-full sm:w-auto"
          onClick={AddToCartHandler}
        >
          ADD TO CART
        </Button>
      </div>

      {isShowTabs && (
        <div className="mt-4 flex flex-col sm:flex-row gap-5">
          {/* RAM */}
          {data.pro_RAM?.length > 0 && (
            <div>
              <h2 className="text-md font-semibold text-gray-700 mb-2">
                Select RAM
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.pro_RAM.map((item, index) => (
                  <span
                    key={index}
                    onClick={() => handleVariantSelect("ram", item)}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer border ${
                      selectedOptions.ram === item
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-blue-100 text-blue-700 border-blue-300"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {data.pro_Size?.length > 0 && (
            <div>
              <h2 className="text-md font-semibold text-gray-700 mb-2">
                Select Size
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.pro_Size.map((item, index) => (
                  <span
                    key={index}
                    onClick={() => handleVariantSelect("size", item)}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer border ${
                      selectedOptions.size === item
                        ? "bg-green-500 text-white border-green-600"
                        : "bg-green-100 text-green-700 border-green-300"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weight */}
          {data.pro_Weight?.length > 0 && (
            <div>
              <h2 className="text-md font-semibold text-gray-700 mb-2">
                Select Weight
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.pro_Weight.map((item, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer border bg-yellow-500 text-white border-yellow-600`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-4">
        <p className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
          <Button
            onClick={() => mylisthandler(data)}
            className="!bg-white !rounded-full !w-10 !h-10 !p-0 !text-black"
          >
            {context?.myListData?.some(
              (item) => item.productId === String(data._id)
            ) ? (
              <FaHeart className="text-[18px] text-red-500" />
            ) : (
              <FaRegHeart className="text-[18px]" />
            )}
          </Button>
          Add to Wishlist
        </p>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
