import React, { useContext, useState, useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { MyContext } from "../../../App";
import { Button } from "@mui/material";
import UpdateSubCategory from "../UpdateSubCategory";
import { useNavigate } from "react-router-dom";

const ListSubCategoery = () => {
  const context = useContext(MyContext);
  const [show, setShow] = useState(null);
  const [catData, setCatData] = useState([]);

  useEffect(() => {
    if (Array.isArray(context.catData)) {
      setCatData(context.catData);
    }
  }, [context.catData]);

  const expend = (index) => {
    setShow(show === index ? null : index);
  };

  const handleDelete = (idToDelete) => {
    const recursiveDelete = (categories) =>
      categories
        .filter((item) => item._id !== idToDelete)
        .map((item) => ({
          ...item,
          children: item.children ? recursiveDelete(item.children) : [],
        }));

    setCatData((prev) => recursiveDelete(prev));
  };
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-col gap-4 py-4 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Banners</h1>
          <button
            onClick={() => navigate("/AddSubCategoery")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            <HiPlus className="text-base" />
            Add Sub Categoery
          </button>
        </div>
      </div>

      <div className="p-10 bg-[#f3f2f2] flex flex-col">
        {catData?.map((item, index) => (
          <div key={item?._id} className="p-5 w-full bg-white m-2">
            <div
              onClick={() => expend(index)}
              className="flex justify-between items-center"
            >
              <h2 className="text-[20px]">{item?.Name}</h2>
              <Button className="min-w-[40px]">
                {show === index ? (
                  <MdKeyboardArrowUp className="text-[25px]" />
                ) : (
                  <MdKeyboardArrowDown className="text-[25px]" />
                )}
              </Button>
            </div>

            {show === index && (
              <div className="mt-4 ml-6">
                {(item?.children || []).map((secondLevelCat) => (
                  <div key={secondLevelCat?._id || ""} className="mb-2">
                    <UpdateSubCategory
                      Name={secondLevelCat?.Name || ""}
                      catData={catData || ""}
                      id={secondLevelCat?._id || ""}
                      selectedCatId={secondLevelCat?.parentCatId || ""}
                      selectedCatName={secondLevelCat?.parentCatName || ""}
                      onDelete={() => handleDelete(secondLevelCat?._id) || ""}
                    />
                    {secondLevelCat?.children?.length > 0 && (
                      <div className="ml-10 mt-2 pl-4">
                        {(secondLevelCat?.children || []).map(
                          (thirdLevelCat) => (
                            <div key={thirdLevelCat?._id || ""}>
                              <UpdateSubCategory
                                Name={thirdLevelCat?.Name}
                                catData={item?.children}
                                selectedCatId={thirdLevelCat?.parentCatId}
                                selectedCatName={thirdLevelCat?.parentCatName}
                                id={thirdLevelCat?._id}
                                onDelete={() =>
                                  handleDelete(thirdLevelCat?._id)
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSubCategoery;
