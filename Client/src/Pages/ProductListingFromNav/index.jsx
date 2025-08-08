import React, { useState } from "react";
import ProductFilter from "../../Component/DisplayPro_filter";
import Product from "../../Component/Home/DisplayProduct/HomePageProductCart";
import { IoIosMenu } from "react-icons/io";
import { IoGrid } from "react-icons/io5";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ProductListView from "../../Component/ProductListView";
import { postData } from "../../utils/Api";

const ProductListing = () => {
  const [isView, setIsView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSortedVal, setSelectedSortedVal] = useState("Name, A to Z");

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSortBy = (order, sortKey, products, label) => {
    setSelectedSortedVal(label);
    postData("/v1/product/SortedBy", {
      order: order,
      sortBy: sortKey,
      products: products,
    }).then((res) => {
      setProductData(res.products);
      setAnchorEl(null);
    });
  };

  return (
    <div className="py-5">
      <div className="flex flex-row">
        <div className="w-[20%] h-full">
          <ProductFilter
            productData={productData}
            setProductData={setProductData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            page={page}
            setTtotalPages={setTotalPages}
          />
        </div>

        <div className="w-[80%] bg-white">
          <div className="flex items-center justify-between bg-[#f1f1f1] py-3 mb-10">
            <div className="pl-6 flex items-center gap-2 viewbtnAction">
              <Button
                className={`!text-[25px] !text-black ${
                  isView === "list" && "active"
                }`}
                onClick={() => setIsView("list")}
              >
                <IoIosMenu />
              </Button>
              <Button
                className={`!text-[20px] !text-black ${
                  isView === "grid" && "active"
                }`}
                onClick={() => setIsView("grid")}
              >
                <IoGrid />
              </Button>
              <span className="pt-2">
                There are {productData.length} Products.
              </span>
            </div>

            <div className="flex gap-3 pr-4">
              <span className="pt-1">Sort By:</span>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="!bg-white !text-[14px] !text-[#000] !capitalize !border !border-[#000]"
              >
                {selectedSortedVal}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() =>
                    handleSortBy("asc", "pro_Name", productData, "Name, A to Z")
                  }
                >
                  Name : A to Z
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleSortBy(
                      "desc",
                      "pro_Name",
                      productData,
                      "Name, Z to A"
                    )
                  }
                >
                  Name : Z to A
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleSortBy(
                      "desc",
                      "pro_price",
                      productData,
                      "Price : High to Low"
                    )
                  }
                >
                  Price : High to Low
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleSortBy(
                      "asc",
                      "pro_price",
                      productData,
                      "Price : Low to High"
                    )
                  }
                >
                  Price : Low to High
                </MenuItem>
              </Menu>
            </div>
          </div>

          <div
            className={`grid ${
              isView === "grid" ? "grid-cols-4 mx-5" : "grid-cols-1"
            } gap-4`}
          >
            {productData && productData.length > 0 ? (
              productData.map((product, index) =>
                isView === "grid" ? (
                  <Product key={index} data={product} />
                ) : (
                  <ProductListView key={index} data={product} />
                )
              )
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
