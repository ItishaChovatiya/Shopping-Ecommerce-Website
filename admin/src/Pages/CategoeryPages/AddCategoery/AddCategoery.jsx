import React, { useContext } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { IoMdCloseCircle } from 'react-icons/io';
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useState } from 'react';
import { FaRegImage } from "react-icons/fa";
import { postData } from '../../../utils/Api';
import { MyContext } from '../../../App';


const AddCategoery = () => {

  const [data, setData] = useState({ Name: "", images: [] })

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value })
  }

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState([]); //used to display image preview
  const [selectedFiles, setSelectedFiles] = useState([]); //Used to strore selected images 
  const context = useContext(MyContext)

  const onChangeFile = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);
  };

  const onSubmitHandler = async () => {
    setIsLoading(true);
    try {
      if (!data.Name) {
        context?.alertBox("error", "Please enter a category name");
        return;
      }

      if (!selectedFiles.length) {
        context?.alertBox("error", "Please upload at least one image");
        return;
      }

      const formData = new FormData();
      formData.append("Name", data.Name);
      selectedFiles.forEach(file => {
        formData.append("images", file);
      });



      const res = await postData('/v1/category/CraeteCategoery', formData);
      if (res.success) {
        context?.alertBox("success", "Category created successfully");
        setData({ Name: "", images: [] });
        setPreview([]);
        setSelectedFiles([]);
        window.location.href = '/Categoery/List';
        setIsLoading(false)
      } else {
        context?.alertBox("error", res.message || "Something went wrong");
        setIsLoading(false)
      }

    } catch (error) {
      context?.alertBox("error", "Something went wrong during upload");
      console.error("Submit Error:", error);
    }

  };

  return (
    <div className="p-5">
      <form className="py-3 px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-[18px] font-medium mb-2">Category Name</label>
            <input
              type="text"
              name="Name"
              value={data.Name}
              onChange={inputHandler}
              className="w-[60%] h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter Category name"
            />
          </div>


          <div >
            <h3 className="text-[18px] font-semibold mb-2">Category Image</h3>
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
                  multiple={false}
                  onChange={onChangeFile}
                  name='images'
                  accept='image/*'
                  className='absolute top-0 left-0 w-full h-full z-50 opacity-0'
                />

              </div>

            </div>
          </div>
        </div>

      </form>


      <div className="flex items-center justify-center my-5">
        <Button
          onClick={onSubmitHandler}
          className="btn-blue !px-[35px] !py-[13px] !text-[17px] flex gap-3 w-[250px]"
        >
          {
            isLoading === false ? (<> <FaCloudUploadAlt className="text-[20px]" /> PUBLISH NOW</>) : (<>
              <CircularProgress className='flex items-center justify-center' /></>)
          }
        </Button>

      </div>
    </div>
  )
}

export default AddCategoery
