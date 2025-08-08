import React, { useState, useEffect, useContext } from 'react';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Button, Select, MenuItem } from '@mui/material';
import { MyContext } from '../../../App';
import axios from 'axios';


const UpdateSubCategory = (props) => {
    const context = useContext(MyContext);

    const [editMode, setEditMode] = useState(false);
    const [selectedCatName, setSelectedCatName] = useState('');
    const [formFiled, setFormFiled] = useState({
        Name: '',
        parentCatId: '',
        parentCatName: ''
    });

    useEffect(() => {
        setFormFiled({
            Name: props?.Name || '',
            parentCatId: props?.selectedCatId || '',
            parentCatName: props?.selectedCatName || ''
        });
        setSelectedCatName(props?.selectedCatId || '');
    }, [props]);

   const handleChange = (event) => {
    const value = event.target.value;
    const selectedCat = props.catData.find(cat => cat._id === value);
    setSelectedCatName(value);
    setFormFiled(prev => ({
        ...prev,
        parentCatId: value,
        parentCatName: selectedCat ? selectedCat.Name : ''
    }));
};


    const inputHandler = (e) => {
        const { name, value } = e.target;
        setFormFiled((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const deleteHandler = () => {
        axios.delete(`http://localhost:3001/v1/category/deleteCat?id=${props.id}`)
            .then((response) => {
                context.alertBox("success", "Category Deleted Successfully....")
                if (props.onDelete) props.onDelete();
            })
            .catch((error) => {
                context.alertBox("error", response?.messege || "Category not Deleted!!")
            });
    };
    
    const handleEditSubmit = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.put(
            `http://localhost:3001/v1/category/update/${props.id}?token=${token}`,
            formFiled
        );
        if (res.data?.success) {
            context.alertBox("success", "Updated Successfully");
            window.location.reload();
        } else {
            context.alertBox("error", res.error );
        }
    } catch (error) {
        context.alertBox("error", error?.response?.data?.message || "Error while updating");
    }
};

    return (
        <form className="w-full flex items-center gap-3 p-0 px-4">
            {!editMode ? (
                <>
                    <span className="text-[18px]">{props?.Name}</span>
                    <div className="flex items-center ml-auto gap-4">
                        <Button
                            className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black !text-[30px]"
                            onClick={() => setEditMode(true)}
                        >
                            <MdOutlineModeEditOutline />
                        </Button>
                        <Button className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black !text-[20px]"
                            onClick={deleteHandler}>
                            <FaRegTrashAlt />
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <Select
                        value={selectedCatName}
                        onChange={handleChange}
                        displayEmpty
                        className="min-w-[180px] max-h-[40px] !border-[#b4b3b3]"
                    >
                        <MenuItem value="" disabled>Select category</MenuItem>
                        {
                            Array.isArray(props?.catData) &&
                            props.catData.map((item) => (
                                <MenuItem value={item._id} key={item._id}>
                                    {item?.Name}
                                </MenuItem>
                            ))
                        }
                    </Select>

                    <input
                        type="text"
                        name="Name"
                        value={formFiled.Name}
                        onChange={inputHandler}
                        className="border p-2 rounded border-[#b4b3b3]"
                    />
                    <div className="flex items-center gap-2 ml-auto">
                        <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                            Edit
                        </Button>
                        <Button variant="outlined" onClick={() => setEditMode(false)}>
                            Cancel
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
};

export default UpdateSubCategory;
