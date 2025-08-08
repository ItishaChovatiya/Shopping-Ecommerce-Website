import React, { useContext, useEffect, useState } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@mui/material';
import { MyContext } from '../../../App';
import { MdModeEdit, MdDelete } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { DeleteData, getData, postData, putData } from '../../../utils/Api';

const AddProductRAM = () => {
    const [RAM, setRAM] = useState({ ram: "" });
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const [ramData, setRamData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchRAM();
    }, []);

    const fetchRAM = async () => {
        const res = await getData(`/v1/product/GetproductRAM?token=${token}`);
        setRamData(res?.products || []);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRAM({ ...RAM, [name]: value });
    };

    const onSubmitHandler = async () => {
        setIsLoading(true);
        try {
            let res;
            if (editMode) {
                res = await putData(`/v1/product/UpdateProductRAM/${currentId}?token=${token}`, RAM);
            } else {
                res = await postData(`/v1/product/CreateRAM?token=${token}`, RAM);
            }

            if (res?.success) {
                context?.alertBox("success", editMode ? "RAM updated successfully" : "RAM created successfully");
                setRAM({ ram: "" });
                setEditMode(false);
                setCurrentId(null);
                fetchRAM();
            } else {
                context?.alertBox("error", res.message || "Something went wrong");
            }
        } catch (error) {
            context?.alertBox("error", "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const updateHandler = (ramData) => {
        setEditMode(true);
        setRAM({ ram: ramData.ram });
        setCurrentId(ramData._id);
    };

    const deleteHandler = async (id) => {
        try {
            const res = await DeleteData(`/v1/product/DeleteProductRAM/${id}?token=${token}`, {});
            if (res.success) {
                context?.alertBox("success", "RAM deleted successfully");
                fetchRAM();
            } else {
                context?.alertBox("error", res?.message || "Delete failed");
            }
        } catch (err) {
            context?.alertBox("error", "Error deleting RAM");
        }
    };

    return (
        <div>
            <h1 className='text-[30px] pb-2'>Add Product RAMs</h1>
            <hr />
            <form method='post'>
                <div className='pt-5'>
                    <div className="mb-3">
                        <h3 className="text-[18px] font-[500] mb-1 mt-3">Product RAM</h3>
                        <input
                            type="text"
                            name="ram"
                            value={RAM?.ram}
                            onChange={handleInputChange}
                            className="w-[50%] h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter RAM size (e.g., 16 GB)"
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
                                {editMode ? "UPDATE RAM" : "PUBLISH NOW"}
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <table className="min-w-[50%] bg-white rounded-lg">
                <thead className="bg-gray-100 border border-gray-500">
                    <tr>
                        <th className="px-6 py-3 text-center w-[65%] border-r border-gray-500">RAM</th>
                        <th className="px-6 py-3 text-center w-[35%]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ramData?.length > 0 ? (<>
                            {ramData?.map((item, index) => (
                                <tr className="border border-gray-500" key={index}>
                                    <td className="px-6 py-4 font-[500] text-gray-800 border-r border-gray-500">{item?.ram}</td>
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
                            ))}
                        </>) : (
                            <tr>
                                <td colSpan={2} className="text-center py-4 text-gray-500">No Data found</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AddProductRAM;
