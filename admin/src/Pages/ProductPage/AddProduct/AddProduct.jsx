import React, { useContext, useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import { FaRegImage } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from '../../../App';
import { getData, postData } from '../../../utils/Api';
import CircularProgress from '@mui/material/CircularProgress';

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [addProductVal, setAddProductVal] = useState({
    pro_Name: "",
    pro_desc: "",
    pro_brand: "",
    pro_price: "",
    pro_old_price: "",
    pro_discount: "",
    pro_CatName: "",
    pro_CatId: "",
    pro_SubCatName: "",
    pro_SubCatId: "",
    pro_thirdSubCat: "",
    pro_thirdSubCatId: "",
    pro_stoke: "",
    pro_rating: 0,
    isFeatured: "false",
    pro_RAM: [],
    pro_Size: [],
    pro_Weight: [],
  });

  const [catData, setCatData] = useState([]);
  const context = useContext(MyContext);
  const [catVal, setCatVal] = useState('');
  const [subCatVal, setSubCatVal] = useState('');
  const [thirdCatVal, setThirdCatVal] = useState('');
  const [isFeaturedVal, setIsFeaturedVal] = useState('false');
  const [ramOptions, setRamOptions] = useState([]);
  const [weightOptions, setWeightOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const token = localStorage.getItem("accessToken");

  const [preview, setPreview] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);



  useEffect(() => {
    if (context.catData && context.catData.length > 0) {
      setCatData(context.catData);
    }
    fetchRAMData();
    fetchSizeData();
    fetchWeightData();
  }, [context.catData]);

  const fetchRAMData = async () => {
    try {
      const res = await getData(`/v1/product/GetproductRAM?token=${token}`);
      if (res.products) {
        setRamOptions(res.products);
      }
    } catch (error) {
      console.error("Error fetching RAM data:", error);
      context.alertBox("error", "Failed to fetch RAM options.");
    }
  };

  const fetchWeightData = async () => {
    try {
      const res = await getData(`/v1/product/GetproductWeight?token=${token}`);
      if (res.products) {
        setWeightOptions(res.products);
      }
    } catch (error) {
      console.error("Error fetching Weight data:", error);
      context.alertBox("error", "Failed to fetch Weight options.");
    }
  };

  const fetchSizeData = async () => {
    try {
      const res = await getData(`/v1/product/GetproductSize?token=${token}`);
      if (res.products) {
        setSizeOptions(res.products);
      }
    } catch (error) {
      console.error("Error fetching Size data:", error);
      context.alertBox("error", "Failed to fetch Size options.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddProductVal(prev => ({ ...prev, [name]: value }));
  };

  const handleCatChange = (e) => {
    const selectedId = e.target.value;
    setCatVal(selectedId);
    const selectedCategory = catData.find(item => item._id === selectedId);
    setAddProductVal(prev => ({
      ...prev,
      pro_CatId: selectedId,
      pro_CatName: selectedCategory ? selectedCategory.Name : ""
    }));
    setSubCatVal('');
    setThirdCatVal('');
    setAddProductVal(prev => ({
      ...prev, pro_SubCatId: "", pro_SubCatName: "", pro_thirdSubCatId: "", pro_thirdSubCat: ""
    }));
  };

  const handleSubCatChange = (e) => {
    const selectedId = e.target.value;
    setSubCatVal(selectedId);
    const selectedCategory = catData
      .flatMap(cat => cat.children || [])
      .find(subCat => subCat._id === selectedId);
    setAddProductVal(prev => ({
      ...prev,
      pro_SubCatId: selectedId,
      pro_SubCatName: selectedCategory ? selectedCategory.Name : ""
    }));
    setThirdCatVal('');
    setAddProductVal(prev => ({
      ...prev,
      pro_thirdSubCatId: "", pro_thirdSubCat: ""
    }));
  };

  const handleThirdCatChange = (e) => {
    const selectedId = e.target.value;
    setThirdCatVal(selectedId); // Update local state for MUI Select
    const selectedCategory = catData
      .flatMap(cat => cat.children || [])
      .flatMap(subCat => subCat.children || [])
      .find(thirdCat => thirdCat._id === selectedId);
    setAddProductVal(prev => ({
      ...prev,
      pro_thirdSubCatId: selectedId,
      pro_thirdSubCat: selectedCategory ? selectedCategory.Name : ""
    }));
  };

  const handleIsFeaturedChange = (e) => {
    const value = e.target.value;
    setIsFeaturedVal(value); // Update local state for MUI Select
    setAddProductVal(prev => ({ ...prev, isFeatured: value }));
  };

  const handleProRAMChange = (e) => {
    const { value } = e.target;
    setAddProductVal(prev => ({ ...prev, pro_RAM: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleProSizeChange = (e) => {
    const { value } = e.target;
    setAddProductVal(prev => ({ ...prev, pro_Size: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleProWeightChange = (e) => {
    const { value } = e.target;
    setAddProductVal(prev => ({ ...prev, pro_Weight: typeof value === 'string' ? value.split(',') : value }));
  };

  const ratingHandler = (e) => {
    setAddProductVal(prev => ({ ...prev, pro_rating: parseFloat(e.target.value) }));
  };

  const onChangeFile = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);
  };

  const removeImage = (indexToRemove) => {
    setPreview(prev => prev.filter((_, i) => i !== indexToRemove));
    setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- Client-side Validation ---
    if (selectedFiles.length === 0) {
      context.alertBox("error", "Please choose at least one image for the product.");
      setIsLoading(false);
      return;
    }

    const requiredFields = [
      { key: "pro_Name", label: "Product Name" },
      { key: "pro_desc", label: "Product Description" },
      { key: "pro_brand", label: "Product Brand" },
      { key: "pro_price", label: "Product Price" },
      { key: "pro_old_price", label: "Product Old Price" },
      { key: "pro_discount", label: "Product Discount" },
      { key: "pro_CatId", label: "Product Category" },
      { key: "pro_stoke", label: "Product Stock" },
      { key: "pro_rating", label: "Product Rating" },
      { key: "isFeatured", label: "Is Featured" },
    ];

    for (const field of requiredFields) {
      if (addProductVal[field.key] === "" || addProductVal[field.key] === null || addProductVal[field.key] === undefined) {
        context.alertBox("error", `Please enter ${field.label}.`);
        setIsLoading(false);
        return;
      }
    }

    const formData = new FormData();
    for (const key in addProductVal) {
      if (Array.isArray(addProductVal[key])) {
        addProductVal[key].forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, addProductVal[key]);
      }
    }

    for (const file of selectedFiles) {
      formData.append('pro_img', file);
    }

    try {
      const res = await postData('/v1/product/createProduct', formData);

      if (res && res.success === true) {
        context.alertBox("success", "Product created successfully!");
        window.location.href = '/Product/List';
        setAddProductVal({
          pro_Name: "", pro_desc: "", pro_brand: "", pro_price: "",
          pro_old_price: "", pro_discount: "", pro_CatName: "", pro_CatId: "",
          pro_SubCatName: "", pro_SubCatId: "", pro_thirdSubCat: "", pro_thirdSubCatId: "",
          pro_stoke: "", pro_rating: 0, isFeatured: "false", pro_RAM: [], pro_Size: [], pro_Weight: [],
        });
        setCatVal('');
        setSubCatVal('');
        setThirdCatVal('');
        setIsFeaturedVal('false');
        setPreview([]);
        setSelectedFiles([]);

      } else {
        context.alertBox("error", res?.message || "Failed to create product. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      context.alertBox("error", error.message || "An unexpected error occurred during product creation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className='text-[35px] pb-2'>Create Product</h1>
      <hr />
      <form method='post' onSubmit={onSubmitHandler}>
        <div className='pt-5'>
          <h3 className="text-[18px] font-semibold mb-2">Product Image</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {preview.map((imgSrc, index) => (
              <div
                key={index}
                className="relative w-full h-[150px] border border-dashed border-gray-400 rounded-md overflow-hidden bg-gray-100"
              >
                <img
                  src={imgSrc}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 text-red-600 text-[22px]"
                >
                  <IoMdCloseCircle />
                </button>
              </div>
            ))}
            <div className='p-3 rounded-md overflow-hidden border border-dashed border-[rgba(10,5,5,0.3)] w-[100%] h-[150px] bg-gray-100 cursor-pointer hover:bg-gray-200 flex flex-col items-center justify-center relative'>
              <FaRegImage className='text-[50px] opacity-35 pointer-events-none' />
              <h4 className='pointer-events-none'>Image Upload</h4>
              <input
                type='file'
                multiple={true}
                accept='image/*'
                onChange={onChangeFile}
                name='pro_img'
                className='absolute top-0 left-0 w-full h-full z-50 opacity-0'
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 mb-3">
          <h3 className="text-[18px] font-[500] mb-1 mt-3">Product Name</h3>
          <input
            type="text"
            name="pro_Name"
            value={addProductVal.pro_Name}
            onChange={handleInputChange}
            className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
            placeholder="Enter product name"
          />
        </div>

        <div className="grid grid-cols-1 mb-3">
          <h3 className="text-[18px] font-[500] mb-1">Product Description</h3>
          <textarea
            rows={5}
            name="pro_desc"
            value={addProductVal.pro_desc}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
            placeholder="Enter product description"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Category</h3>
            <Select
              name="pro_CatId"
              size="small"
              value={catVal}
              onChange={handleCatChange}
              className="w-full"
            >
              <MenuItem value="">Select Category</MenuItem> {/* Added a default placeholder */}
              {catData?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.Name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Sub Category</h3>
            <Select
              name="pro_SubCatId"
              size="small"
              value={subCatVal}
              onChange={handleSubCatChange}
              className="w-full"
              disabled={!catVal} // Disable if no parent category selected
            >
              <MenuItem value="">Select Sub Category</MenuItem>
              {catData.find(cat => cat._id === catVal)?.children?.map((subCat) => (
                <MenuItem key={subCat._id} value={subCat._id}>
                  {subCat.Name}
                </MenuItem>
              ))
              }
            </Select>
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Third Level Category</h3>
            <Select
              name="pro_thirdSubCatId"
              size="small"
              value={thirdCatVal}
              onChange={handleThirdCatChange}
              className="w-full"
              disabled={!subCatVal} // Disable if no parent sub-category selected
            >
              <MenuItem value="">Select Third Level Category</MenuItem>
              {catData.find(cat => cat._id === catVal)
                ?.children?.find(subCat => subCat._id === subCatVal)
                ?.children?.map((thirdLevelCat) => (
                  <MenuItem key={thirdLevelCat._id} value={thirdLevelCat._id}>
                    {thirdLevelCat.Name}
                  </MenuItem>
                ))
              }
            </Select>
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Price</h3>
            <input
              type="number"
              name="pro_price"
              value={addProductVal.pro_price}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter product price"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Old Price</h3>
            <input
              type="number"
              name="pro_old_price"
              value={addProductVal.pro_old_price}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter old price"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Is Featured?</h3>
            <Select
              name="isFeatured"
              size="small"
              onChange={handleIsFeaturedChange}
              value={isFeaturedVal}
              className="w-full"
            >
              <MenuItem value="false">False</MenuItem>
              <MenuItem value="true">True</MenuItem>
            </Select>
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Stock</h3>
            <input
              type="number"
              name="pro_stoke"
              value={addProductVal.pro_stoke}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter product stock"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Brand</h3>
            <input
              type="text"
              name="pro_brand"
              value={addProductVal.pro_brand}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter product brand"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Discount</h3>
            <input
              type="number"
              name="pro_discount"
              value={addProductVal.pro_discount}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter discount"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product RAM</h3>
            <Select
              name="pro_RAM"
              multiple
              size="small"
              value={addProductVal.pro_RAM} // Use addProductVal directly
              onChange={handleProRAMChange}
              className="w-full"
            >
              {ramOptions.map((item, index) => (
                <MenuItem value={item.ram} key={index}>
                  {item.ram}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Weight</h3>
            <Select
              name="pro_Weight"
              size="small"
              multiple
              value={addProductVal.pro_Weight} // Use addProductVal directly
              onChange={handleProWeightChange}
              className="w-full"
            >
              {weightOptions?.map((item, index) => (
                <MenuItem value={item.weight} key={index}>{item.weight}</MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1">Product Size</h3>
            <Select
              name="pro_Size"
              size="small"
              multiple
              value={addProductVal.pro_Size} // Use addProductVal directly
              onChange={handleProSizeChange}
              className="w-full"
            >
              {sizeOptions?.map((item, index) => (
                <MenuItem value={item.size} key={index}>{item.size}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h3 className="text-[18px] font-[500] mb-1 mt-2">Product Rating</h3>
            <Rating
              name="pro_rating"
              value={addProductVal.pro_rating} // Use addProductVal directly
              onChange={ratingHandler}
              precision={0.5}
            />
          </div>
        </div>
        <div className="flex items-center justify-center my-5">
          <Button
            type="submit" // Set type to submit for form submission
            className="btn-blue !px-[35px] !py-[13px] !text-[17px] flex gap-3 w-[250px]"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <CircularProgress size={24} className='flex items-center justify-center !text-white' />
            ) : (
              <> <FaCloudUploadAlt className="text-[20px]" />PUBLISH NOW</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;