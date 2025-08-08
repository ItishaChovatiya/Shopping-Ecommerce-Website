import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientContext } from "../../../App";

const NavigationBar = () => {
  const context = useContext(ClientContext);
  const [hoveredCatId, setHoveredCatId] = useState(null);
  const [openThirdCat, setOpenThirdCat] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setHoveredCatId(null); // Hide subcategory menu
    setOpenThirdCat(null); // Hide third-category menu
  };

  return (
    <nav className="py-4 border-t bg-white">
      <div className="container px-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <div className="w-full lg:w-auto lg:block">
          <ul className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-start relative">
            {context?.catData?.length > 0 &&
              context?.catData?.slice(0, 9).map((cat) => (
                <li
                  key={cat._id}
                  className="relative"
                  onMouseEnter={() => setHoveredCatId(cat._id)}
                >
                  {/* Clickable main category */}
                  <button
                    onClick={() =>
                      handleNavigate(`/productListing?pro_CatId=${cat._id}`)
                    }
                    className="text-left text-[16px] font-[400] hover:text-green-600 block"
                  >
                    {cat.Name}
                  </button>

                  {/* Subcategories dropdown on hover */}
                  {hoveredCatId === cat._id && cat.children?.length > 0 && (
                    <ul
                      className="absolute top-full left-0 z-20 mt-2 w-56 bg-white border rounded shadow-md p-2"
                      onMouseLeave={() => {
                        setHoveredCatId(null);
                        setOpenThirdCat(null);
                      }}
                    >
                      {cat.children.map((sub) => (
                        <div key={sub._id} className="mb-2">
                          {/* Subcategory button */}
                          <button
                            onClick={() =>
                              handleNavigate(
                                `/productListing?pro_SubCatId=${sub._id}`
                              )
                            }
                            className="px-2 py-1 text-sm text-left w-full font-medium hover:bg-gray-100 hover:text-green-600"
                          >
                            {sub.Name}
                          </button>

                          {/* Third-level categories */}
                          {sub.children?.length > 0 && (
                            <ul className="ml-3">
                              {sub.children.map((third) => (
                                <li key={third._id}>
                                  <button
                                    onClick={() =>
                                      handleNavigate(
                                        `/productListing?pro_thirdSubCatId=${third._id}`
                                      )
                                    }
                                    className="pl-4 px-2 py-1 text-sm text-left w-full hover:bg-gray-100 hover:text-green-600"
                                  >
                                    {third.Name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
          </ul>
        </div>

        <div className="flex items-center w-full lg:w-auto mb-4 lg:mb-0 text-black gap-2 mr-10">
          <span className="text-gray-300 hidden lg:inline mx-3">|</span>
          <span className="text-[16px] font-medium">Shop by Categories</span>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
