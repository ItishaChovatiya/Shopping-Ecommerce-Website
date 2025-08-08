import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { MyContext } from "../../../App";
import { postData } from "../../../utils/Api";

const AddSubCategoery = () => {
  const context = useContext(MyContext);
  const [parentCatSelect, setParentCatSelect] = useState("");
  const [formFiled, setFormField] = useState({
    Name: "",
    parentCatId: null,
    parentCatName: null,
  });

  const [parentCatData, setParentCatData] = useState([]);
  useEffect(() => {
    if (context?.catData) {
      setParentCatData(context.catData);
    }
  }, [context?.catData]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormField({ ...formFiled, [name]: value });
  };

  const handleChange = (event) => {
    setParentCatSelect(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formFiled.Name) {
      context?.alertBox("error", "Please enter a category name");
      return;
    }

    if (!parentCatSelect) {
      context?.alertBox("error", "Please select parent category name");
      return;
    }

    const selectedCat = parentCatData.find(
      (cat) => cat.Name === parentCatSelect
    );
    if (!selectedCat) {
      context?.alertBox("error", "Selected parent category not found");
      return;
    }

    const formData = new FormData();
    formData.append("Name", formFiled.Name);
    formData.append("parentCatName", selectedCat.Name);
    formData.append("parentCatId", selectedCat._id);

    try {
      const res = await postData("/v1/category/CraeteCategoery", formData);
      if (res && res.success) {
        context?.alertBox("success", "Category created successfully");
        window.location.href = "/SubCategoery/List";
      } else {
        context?.alertBox("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      console.error("API error:", err);
      context?.alertBox("error", "Failed to create category");
    }
  };

  const [parentCatSelect2, setParentCatSelect2] = useState("");
  const [formFiled2, setFormField2] = useState({
    Name: "",
    parentCatId: null,
    parentCatName: null,
  });

  const [subParentCatData, setSubParentCatData] = useState([]);
  useEffect(() => {
    if (context?.catData) {
      const allChildren = context.catData.flatMap((cat) => cat.children || []);
      setSubParentCatData(allChildren);
    }
  }, [context?.catData]);

  const inputHandler2 = (e) => {
    const { name, value } = e.target;
    setFormField2({ ...formFiled2, [name]: value });
  };

  const handleChange2 = (event) => {
    setParentCatSelect2(event.target.value);
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    if (!formFiled2.Name) {
      context?.alertBox("error", "Please enter a category name");
      return;
    }

    if (!parentCatSelect2) {
      context?.alertBox("error", "Please select parent category name");
      return;
    }

    const selectedCat = subParentCatData.find(
      (cat) => cat.Name === parentCatSelect2
    );
    if (!selectedCat) {
      context?.alertBox("error", "Selected parent category not found");
      return;
    }

    const formData2 = new FormData();
    formData2.append("Name", formFiled2.Name);
    formData2.append("parentCatName", selectedCat.Name);
    formData2.append("parentCatId", selectedCat._id);

    try {
      const res = await postData(
        "/v1/category/CraeteCategoery",
        formData2,
        true
      );
      if (res && res.success) {
        context?.alertBox("success", "Category created successfully");
        window.location.href = "/SubCategoery/List";
      } else {
        context?.alertBox("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      console.error("API error:", err);
      context?.alertBox("error", "Failed to create category");
    }
  };

  return (
    <div className="p-5">
      <form className="py-3 px-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="w-[75%]">
            <h2 className="text-[28px] font-600 mt-5 mb-3">
              Add Second Level Category
            </h2>
            <hr />
            <div className="flex flex-col">
              <label className="text-[18px] font-medium mb-2 mt-10">
                Parent Category Name
              </label>
              <Select
                value={parentCatSelect}
                onChange={handleChange}
                displayEmpty
                style={{ height: "40px" }}
              >
                {parentCatData.map((cat, index) => (
                  <MenuItem key={index} value={cat.Name}>
                    {cat.Name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col mt-7">
              <label className="text-[18px] font-medium mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="Name"
                onChange={inputHandler}
                value={formFiled.Name}
                className="h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter Sub Category name"
              />
            </div>
            <div className="flex items-center justify-center my-5 mt-[50px]">
              <Button
                type="submit"
                onClick={handleSubmit}
                className="btn-blue !px-[35px] !py-[13px] !text-[17px] flex gap-3"
              >
                <FaCloudUploadAlt className="text-[20px]" /> PUBLISH NOW
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6 w-[75%]">
            <div className="flex flex-col">
              <h2 className="text-[28px] font-600 mt-5 mb-3">
                Add Third Level Category
              </h2>
              <hr />
              <label className="text-[18px] font-medium mb-2 mt-10">
                Parent Category Name
              </label>
              <Select
                value={parentCatSelect2}
                onChange={handleChange2}
                displayEmpty
                style={{ height: "40px" }}
              >
                {subParentCatData.map((cat, index) => (
                  <MenuItem key={index} value={cat.Name}>
                    {cat.Name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-[18px] font-medium mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="Name"
                onChange={inputHandler2}
                value={formFiled2.Name}
                className="h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter Sub Category name"
              />
            </div>
            <div className="flex items-center justify-center my-5">
              <Button
                type="submit"
                onClick={handleSubmit2}
                className="btn-blue !px-[35px] !py-[13px] !text-[17px] flex gap-3"
              >
                <FaCloudUploadAlt className="text-[20px]" /> PUBLISH NOW
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSubCategoery;
