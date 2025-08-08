import React, { useContext, useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import { FaRegImage } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from '../../../App';
import { getData, putData } from '../../../utils/Api';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [ProductVal, setProductVal] = useState({
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
        pro_rating: "",
        isFeatured: false,
        pro_RAM: [],
        pro_Size: [],
        pro_Weight: [],
    })
    const [catVal, setCatVal] = useState('')
    const [SubcatVal, setSubCatVal] = useState('')
    const [thirdcatVal, setThirdCatVal] = useState('')
    const [isFreatured, setIsFreatured] = useState('')
    const [proRAM, setProRAM] = useState([])
    const [proSize, setProSize] = useState([])
    const [proWeight, setProWeight] = useState([])
    const [preview, setPreview] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [catData, setCatData] = useState([])
    const context = useContext(MyContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken")
    useEffect(() => {
        const data = context.catData;
        setCatData(data)
        const fetchProductData = async () => {
            getData(`/v1/product/GetSingleProduct/${id}?token=${token}`).then((res) => {
                setProductVal(res.product);
                setProRAM(res.product.pro_RAM)
                setProWeight(res.product.pro_Weight)
                setProSize(res.product.pro_Size)
                setIsFreatured(res.product.isFeatured)
            })
        }
        fetchProductData();
        fetchRAMData();
        fetchSizeData();
        fetchWeightData();
    }, [context.catData]);

    const fetchRAMData = async () => {
        getData(`/v1/product/GetproductRAM?token=${token}`).then((res) => {
            setProRAM(res.products)
        })
    }
    const fetchWeightData = async () => {
        getData(`/v1/product/GetproductWeight?token=${token}`).then((res) => {
            setProWeight(res.products)
        })
    }
    const fetchSizeData = async () => {
        getData(`/v1/product/GetproductSize?token=${token}`).then((res) => {
            setProSize(res.products)
        })
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductVal({ ...ProductVal, [name]: value })
    }
    const handleCatChange = (e) => {
        setCatVal(e.target.value);
        ProductVal.pro_CatId = e.target.value;
    }
    const selectedCatName = (name) => {
        ProductVal.pro_CatName = name;
    }
    const handleSubCatChange = (e) => {
        setSubCatVal(e.target.value);
        ProductVal.pro_SubCatId = e.target.value;
    };
    const selectedSubCatName = (name) => {
        ProductVal.pro_SubCatName = name;
    };
    const handleThirdCatChange = (e) => {
        setThirdCatVal(e.target.value);
        ProductVal.pro_thirdSubCatId = e.target.value;
    }
    const selectedthirdCatName = (name) => {
        ProductVal.pro_thirdSubCat = name;
    };
    const handleIsFreaturedChange = (e) => {
        setIsFreatured(e.target.value);
        ProductVal.isFeatured = e.target.value;
    }
    const handleProRAMChange = (e) => {
        setProRAM(e.target.value);
        ProductVal.pro_RAM = e.target.value;
    }
    const handleProSizeChange = (e) => {
        setProSize(e.target.value);
        ProductVal.pro_Size = e.target.value;
    }
    const handleProWeightChange = (e) => {
        setProWeight(e.target.value);
        ProductVal.pro_Weight = e.target.value;
    }
    const ratingHandler = (e) => {
        setProductVal((ProductVal) => ({ ...ProductVal, pro_rating: e.target.value }))
    }
    const onChangeFile = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setPreview(previews);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        const requiredFields = [
            "pro_Name", "pro_price", "pro_discount", "pro_rating",
            "pro_CatName", "pro_SubCatName", "pro_old_price", "pro_stoke",
        ];

        const hasEmpty = requiredFields.some(field => !ProductVal[field]);
        if (hasEmpty) {
            context.alertBox("error", "Please enter all details related to the product.");
            setIsLoading(false);
            return;
        }
        // Append all product data
        for (const key in ProductVal) {
            formData.append(key, ProductVal[key]);
        }
        {
            for (const file of selectedFiles) {
                formData.append('pro_img', file);
            }
        }
        try {
            const token = localStorage.getItem('accessToken');
            const res = await putData(`/v1/product/UpdateProduct/${id}?token=${token}`, formData);
            if (res.success === true) {
                context.alertBox("success", "Product Updated Successfully...");
                navigate('/Product/List');
                setPreview([]);
                setSelectedFiles([]);
            }
        } catch (error) {
            context.alertBox("error", error.message || "Something went wrong.");
        }
        setIsLoading(false);
    };



    return (
        <div className="p-10">
            <h1 className='text-[35px] pb-2'>Update Product</h1>
            <hr />
            <form method='post' onSubmit={onSubmitHandler}>
                <div className='pt-5'>
                    <div className='flex gap-4 mb-3'>
                        <h3 className="text-[18px] font-semibold">Product Image</h3>
                        <p className='text-7px text-red-600'>{preview.length === 0 ? "* please first select Product Image" : " "}</p>
                    </div>
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
                                    onClick={() => {
                                        const newPreview = preview.filter((_, i) => i !== index);
                                        const newFiles = selectedFiles.filter((_, i) => i !== index);
                                        setPreview(newPreview);
                                        setSelectedFiles(newFiles);
                                    }}
                                    className="absolute top-1 right-1 text-red-600 text-[22px]"
                                >
                                    <IoMdCloseCircle />
                                </button>
                            </div>
                        ))}
                        <div className='p-3 rounded-md overflow-hidden border border-dashed border-[rgba(10,5,5,0.3)] w-[100%] h-[150px]
                    bg-gray-100 cursor-pointer hover:bg-gray-200 flex flex-col items-center justify-center relative'>
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
                        onChange={handleInputChange}
                        value={ProductVal.pro_Name}
                        className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="Enter product name"
                    />
                </div>


                <div className="grid grid-cols-1 mb-3">
                    <h3 className="text-[18px] font-[500] mb-1">Product Description</h3>
                    <input
                        type="text"
                        name="pro_desc"
                        onChange={handleInputChange}
                        value={ProductVal.pro_desc}
                        className="w-full  border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="Enter product description"
                    />
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                        <div className='flex gap-1 mb-3 items-center'>
                            <h3 className="text-[18px] font-medium">Product Category</h3>
                            <p className='text-[12px] text-red-600'>
                                {catVal ? "" : "* please select a Product Category"}
                            </p>
                        </div>

                        <Select
                            name="pro_CatName"
                            size="small"
                            value={catVal}
                            onChange={handleCatChange}
                            className="w-full"
                        >
                            {catData?.map((item) => (
                                <MenuItem key={item._id} value={item._id} onClick={() => selectedCatName(item.Name)}>
                                    {item.Name}
                                </MenuItem>
                            ))}
                        </Select>

                    </div>
                    <div>
                        <div className='flex gap-1 mb-3 items-center'>
                            <h3 className="text-[18px] font-medium">Product Sub Category</h3>
                        </div>
                        <Select
                            name="pro_SubCatName"
                            size="small"
                            value={SubcatVal}
                            onChange={handleSubCatChange}
                            className="w-full"
                        >
                            {catData.map((cat) =>
                                cat?.children?.map((subCat, index) => (
                                    <MenuItem key={subCat._id} value={subCat._id} onClick={() => selectedSubCatName(subCat.Name)}>
                                        {subCat.Name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </div>
                    <div>
                        <div className='flex gap-1 mb-3 items-center'>
                            <h3 className="text-[18px] font-medium">Product Third Level Category</h3>
                        </div>
                        <Select
                            name="pro_thirdSubCat"
                            size="small"
                            onChange={handleThirdCatChange}
                            value={thirdcatVal}
                            className="w-full"
                        >
                            {catData.map((cat) =>
                                cat?.children?.map((subCat) =>
                                    subCat?.children?.map((thirdLevelCat) => (
                                        <MenuItem
                                            key={thirdLevelCat._id}
                                            value={thirdLevelCat._id}
                                            onClick={() => selectedthirdCatName(thirdLevelCat.Name)}
                                        >
                                            {thirdLevelCat.Name}
                                        </MenuItem>
                                    ))
                                )
                            )}
                        </Select>

                    </div>
                    <div>
                        <h3 className="text-[18px] font-[500] mb-1">Product Price</h3>
                        <input
                            type="number"
                            name="pro_price"
                            onChange={handleInputChange}
                            value={ProductVal.pro_price}
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
                            onChange={handleInputChange}
                            value={ProductVal.pro_old_price}
                            className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter old price"
                        />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-[500] mb-1">Is Featured?</h3>
                        <Select
                            name="isFeatured"
                            size="small"
                            onChange={handleIsFreaturedChange}
                            value={isFreatured}
                            className="w-full"
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="true">True</MenuItem>
                            <MenuItem value="false">False</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <h3 className="text-[18px] font-[500] mb-1">Product Stoke</h3>
                        <input
                            type="number"
                            name="pro_stoke"
                            onChange={handleInputChange}
                            value={ProductVal.pro_stoke}
                            className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter product stock"
                        />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-[500] mb-1">Product Brand</h3>
                        <input
                            type="text"
                            name="pro_brand"
                            onChange={handleInputChange}
                            value={ProductVal.pro_brand}
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
                            onChange={handleInputChange}
                            value={ProductVal.pro_discount}
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
                            value={proRAM}
                            onChange={handleProRAMChange}
                            className="w-full"
                        >
                            <MenuItem value="">Select RAM</MenuItem>
                            {
                                proRAM?.map((item, index) => {
                                    return (
                                        <MenuItem value={item.ram} key={index}>{item.ram}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div>
                        <h3 className="text-[18px] font-[500] mb-1">Product Weight</h3>
                        <Select
                            name="pro_Weight"
                            size="small"
                            multiple
                            value={proWeight}
                            onChange={handleProWeightChange}
                            className="w-full"
                        >
                            <MenuItem value="">Select Weight</MenuItem> {
                                proWeight?.map((item, index) => {
                                    return (
                                        <MenuItem value={item.weight} key={index}>{item.weight}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div>
                        <h3 className="text-[18px] font-[500] mb-1">Product Size</h3>
                        <Select
                            name="pro_Size"
                            size="small"
                            multiple
                            value={proSize}
                            onChange={handleProSizeChange}
                            className="w-full"
                        >
                            <MenuItem value="">Select Size</MenuItem>{
                                proSize?.map((item, index) => {
                                    return (
                                        <MenuItem value={item.size} key={index}>{item.size}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <div className='flex gap-1 mb-3 mt-3 items-center'>
                            <h3 className="text-[18px] font-medium">Product Rating</h3>
                            <p className='text-[12px] text-red-600'>
                                {ProductVal.pro_rating ? "" : "* please select a Product Rating"}
                            </p>
                        </div>


                        <Rating name="half-rating" onChange={ratingHandler} value={ProductVal.pro_rating} defaultValue={1} precision={0.5} />
                    </div>
                </div>
                <div className="flex items-center justify-center my-5">
                    <Button
                        onClick={onSubmitHandler}
                        className="btn-blue !px-[35px] !py-[13px] !text-[17px] flex gap-3 w-[250px]"
                    >
                        {
                            isLoading === false ? (<> <FaCloudUploadAlt className="text-[20px]" />PUBLISH NOW</>) : (<>
                                <CircularProgress className='flex items-center justify-center !text-blue-50' /></>)
                        }
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default EditProduct