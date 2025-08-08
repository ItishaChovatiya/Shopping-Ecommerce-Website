import React, { useContext, useState } from "react";
import DashBoardBoxes from "../../Components/DashBoardBox";
import banner1 from "../../assets/banner1.avif";
import { Button } from "@mui/material";
import ProductTable from "../../Components/ProductTable";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { MdAddToPhotos } from "react-icons/md";
import Chart from "../../Components/DashBoardChart";
import OrderPage from "../Order";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const DashBoard = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [catFillter, setCatFillter] = useState("");
  const handleChangeCategoeryF = (event) => {
    setCatFillter(event.target.value);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full px-4 sm:px-8 lg:px-12 border  border-[rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-5">
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-[35px] font-bold leading-snug mb-3">
            Good Morning,
            <br className="hidden md:block" /> cameron 👋
          </h1>
          <p className="text-sm sm:text-base max-w-md mx-auto md:mx-0">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit inventore.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <img
            src={banner1}
            alt="banner1"
            className="w-[180px] sm:w-[220px] lg:w-[250px] object-cover mx-auto md:mx-0"
          />
        </div>
      </div>
      <div>
        <DashBoardBoxes />
        <OrderPage />
      </div>

      <div className="flex  flex-col">
        <h2 className="text-[20px] font-[600] pb-5">Product List</h2>
        <div className="flex items-center justify-between w-full">
          <div className="w-[20%]">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={catFillter}
                label="Category"
                onChange={handleChangeCategoeryF}
                className="text-black"
              >
                {context?.catData?.length > 0 &&
                  context?.catData?.map((item, index) => {
                    return (
                      <MenuItem value={item.Name} key={index}>
                        {item.Name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="btn-blue flex gap-3"
              onClick={() => navigate("/AddProduct")}
            >
              <MdAddToPhotos />
              Add Product
            </Button>
          </div>
        </div>
      </div>
      <div>
        <ProductTable selectedCat={catFillter}/>
      </div>

      <div className="pl-5">
        <h1 className="text-[25px] font-[500]">Total User & Sale</h1>
        <div className="flex gap-2 items-center">
          <span className="w-[8px] h-[8px] rounded-full bg-green-700 inline-block"></span>
          <p className="text-[15px] font-[400]">Total User</p>
          <span className="w-[8px] h-[8px] rounded-full bg-blue-700 inline-block"></span>
          <p className="text-[15px] font-[400]">Total Saler</p>
        </div>
      </div>
      <div className="w-[100%] h-[300px] my-10">
        <Chart />
      </div>
    </div>
  );
};

export default DashBoard;
