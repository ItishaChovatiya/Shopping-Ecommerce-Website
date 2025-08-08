import React, { useContext, useEffect, useState } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Tooltip } from '@mui/material';
import { MdModeEdit, MdDelete } from "react-icons/md";
import { MyContext } from '../../../App';
import { getData, postData, putData, DeleteData } from '../../../utils/Api';

const AddProductWeight = () => {
    const [weight, setWeight] = useState({ weight: "" });
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const [weightData, setWeightData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchWeight();
    }, []);

    const fetchWeight = async () => {
        const res = await getData(`/v1/product/GetproductWeight?token=${token}`);
        setWeightData(res?.products || []);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWeight({ ...weight, [name]: value });
    };

    const onSubmitHandler = async () => {
        setIsLoading(true);
        try {
            let res;
            if (editMode) {
                res = await putData(`/v1/product/UpdateProductWeight/${currentId}?token=${token}`, weight);
            } else {
                res = await postData(`/v1/product/CreateWeight?token=${token}`, weight);
            }

            if (res.success) {
                context?.alertBox("success", editMode ? "Weight updated successfully" : "Weight created successfully");
                setWeight({ weight: "" });
                setEditMode(false);
                setCurrentId(null);
                fetchWeight();
            } else {
                context?.alertBox("error", res.message || "Something went wrong");
            }
        } catch (error) {
            context?.alertBox("error", "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const updateHandler = (data) => {
        setEditMode(true);
        setWeight({ weight: data?.weight });
        setCurrentId(data._id);
    };

    const deleteHandler = async (id) => {
        try {
            const res = await DeleteData(`/v1/product/DeleteProductWeight/${id}?token=${token}`, {});
            if (res?.success) {
                context?.alertBox("success", "Weight deleted successfully");
                fetchWeight();
            } else {
                context?.alertBox("error", res?.message || "Delete failed");
            }
        } catch (err) {
            context?.alertBox("error", "Error deleting weight");
        }
    };

    return (
        <div>
            <h1 className='text-[30px] pb-2'>Add Product Weights</h1>
            <hr />
            <form method='post'>
                <div className='pt-5'>
                    <div className="mb-3">
                        <h3 className="text-[18px] font-[500] mb-1 mt-3">Product Weight</h3>
                        <input
                            type="text"
                            name="weight"
                            value={weight?.weight}
                            onChange={handleInputChange}
                            className="w-[50%] h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter weight (e.g., 1.5 kg)"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center my-5">
                    <Button
                        onClick={onSubmitHandler}
                        className="btn-blue !px-[35px] !py-[13px] !text-[17px] flex gap-3 w-[250px]"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <CircularProgress size={24} />
                            </div>

                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[20px]" />
                                {editMode ? "UPDATE WEIGHT" : "PUBLISH NOW"}
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <table className="min-w-[50%] bg-white rounded-lg">
                <thead className="bg-gray-100 border border-gray-500">
                    <tr>
                        <th className="px-6 py-3 text-center w-[65%] border-r border-gray-500">Weight</th>
                        <th className="px-6 py-3 text-center w-[35%]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {weightData?.length > 0 ? (<>
                        {weightData?.map((item, index) => (
                            <tr className="border border-gray-500" key={index}>
                                <td className="px-6 py-4 font-[500] text-gray-800 border-r border-gray-500">{item.weight}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <Tooltip title="Edit">
                                            <Button
                                                onClick={() => updateHandler(item)}
                                                className="!w-9 !h-9 !bg-green-600 !text-black !text-xl"
                                            >
                                                <MdModeEdit />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <Button
                                                onClick={() => deleteHandler(item._id)}
                                                className="!w-9 !h-9 !bg-red-600 !text-black !text-xl"
                                            >
                                                <MdDelete />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}</>) : (
                        <tr>
                            <td colSpan={2} className="text-center py-4 text-gray-500">No weights found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AddProductWeight;