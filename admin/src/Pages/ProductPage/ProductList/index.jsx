// 👇 Imports are the same as before
import React, { useContext, useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { MyContext } from "../../../App";
import { DeleteData, deleteMultipleData, getData } from "../../../utils/Api";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const columns = [
  { id: "product", label: "PRODUCT", minWidth: 200 },
  { id: "pro_CatName", label: "CATEGORY", minWidth: 120, align: "left" },
  { id: "pro_SubCatName", label: "SUB.CATEGORY", minWidth: 120, align: "left" },
  { id: "pro_price", label: "PRICE", minWidth: 100, align: "left" },
  { id: "sale", label: "SALE", minWidth: 100, align: "left" },
  { id: "action", label: "ACTION", minWidth: 150, align: "center" },
];

const Product = () => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // <-- Loading for table
  const [multiDeleteLoading, setMultiDeleteLoading] = useState(false); // <-- Loading for multi-delete
  const [productData, setProductData] = useState([]);
  const [catList, setCatList] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSubCat, setSelectedSubCat] = useState("");
  const [selectedThirdCat, setSelectedThirdCat] = useState("");
  const [sortedIds, setSortedIds] = useState([]);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCatList(context.catData || []);

    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/v1/product/GetAllPro");
        if (res?.error === false) {
          setTimeout(() => {
            const productArr = res.products.map((product) => ({
              ...product,
              checked: false,
            }));
            setProductData(productArr);
            setIsLoading(false);
          }, 1000);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load products", error);
        setIsLoading(false);
      }
    };

    getProducts();
  }, [context.catData]);

  const handleCatChange = async (e) => {
    setSelectedThirdCat("");
    setSelectedSubCat("");
    const catName = e.target.value;
    setSelectedCat(catName);
    setIsLoading(true);
    try {
      const res = await getData(
        `/v1/product/GetProByCatName?pro_CatName=${catName}`
      );
      setProductData(res.products || []);
    } catch (err) {
      console.error("Failed to filter by category", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubCatChange = async (e) => {
    setSelectedThirdCat("");
    setSelectedCat("");
    const subCatName = e.target.value;
    setSelectedSubCat(subCatName);
    setIsLoading(true);
    try {
      const res = await getData(
        `/v1/product/GetProBySubCatName?pro_SubCatName=${subCatName}`
      );
      setProductData(res.products || []);
    } catch (err) {
      console.error("Failed to filter by sub-category", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThirdCatChange = async (e) => {
    setSelectedCat("");
    setSelectedSubCat("");
    const thirdCatName = e.target.value;
    setSelectedThirdCat(thirdCatName);
    setIsLoading(true);
    try {
      const res = await getData(
        `/v1/product/GetProBythirdCatName?pro_thirdCatName=${thirdCatName}`
      );
      setProductData(res.products || []);
    } catch (err) {
      console.error("Failed to filter by third-level category", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteProductHandler = async (id) => {
    setLoadingId(id);
    try {
      await DeleteData(`/v1/product/deleteProduct/${id}`);
      setProductData((prev) => prev.filter((product) => product._id !== id));
      context.alertBox("success", "Deleted product successfully.");
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setLoadingId(null);
    }
  };

  const updateHandler = (id) => {
    navigate(`/Product/Update/${id}`);
  };

  const productViewHandler = (id) => {
    navigate(`/Product/View/${id}`);
  };

  const paginatedData = productData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;

    const updated = productData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProductData(updated);
    setSortedIds(isChecked ? updated.map((i) => i._id) : []);
  };

  const handleCheckBoxChange = (e, id) => {
    const updated = productData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item
    );
    setProductData(updated);
    const selected = updated
      .filter((item) => item.checked)
      .map((item) => item._id);
    setSortedIds(selected);
  };

  const deleteMultipleProduct = async () => {
    setMultiDeleteLoading(true);
    try {
      await deleteMultipleData("/v1/product/DeleteAllProduct", {
        ids: sortedIds,
      });
      context.alertBox("success", "Products deleted successfully");
      setProductData((prev) =>
        prev.filter((product) => !sortedIds.includes(product._id))
      );
      setSortedIds([]);
    } catch {
      context.alertBox("error", "Something went wrong");
    } finally {
      setMultiDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-3">
          {sortedIds.length > 0 && (
            <button
              onClick={deleteMultipleProduct}
              className="flex items-center gap-2 border border-gray-300 px-5 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              {multiDeleteLoading ? (
                <CircularProgress size={18} className="text-white" />
              ) : (
                "Delete"
              )}
            </button>
          )}

          <button
            onClick={() => navigate("/AddProduct")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            <HiPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-between items-center w-full gap-4 mb-4">
        <div className="flex gap-4 w-[90%]">
          <div className="w-[250px]">
            <p className="text-[18px] font-medium mb-2">Category</p>
            <Select
              name="pro_CatName"
              size="small"
              value={selectedCat}
              onChange={handleCatChange}
              className="w-full"
              displayEmpty
            >
              {catList.map((item) => (
                <MenuItem key={item._id} value={item.Name}>
                  {item.Name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="w-[250px]">
            <p className="text-[18px] font-medium mb-2">Sub Category</p>
            <Select
              name="pro_SubCatName"
              size="small"
              value={selectedSubCat}
              onChange={handleSubCatChange}
              className="w-full"
              displayEmpty
            >
              {catList.flatMap((cat) =>
                cat?.children?.map((sub) => (
                  <MenuItem key={sub._id} value={sub.Name}>
                    {sub.Name}
                  </MenuItem>
                ))
              )}
            </Select>
          </div>
          <div className="w-[250px]">
            <p className="text-[18px] font-medium mb-2">Third Level Category</p>
            <Select
              name="pro_thirdSubCat"
              size="small"
              onChange={handleThirdCatChange}
              value={selectedThirdCat}
              className="w-full"
              displayEmpty
            >
              {catList.flatMap((cat) =>
                cat?.children?.flatMap((sub) =>
                  sub?.children?.map((third) => (
                    <MenuItem key={third._id} value={third.Name}>
                      {third.Name}
                    </MenuItem>
                  ))
                )
              )}
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 440 }} style={{ marginTop: "30px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  {...label}
                  onChange={handleSelectAll}
                  checked={
                    productData.length > 0 &&
                    productData.every((item) => item.checked)
                  }
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  className="flex justify-center items-center w-full h-[500px]"
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      checked={!!item.checked}
                      onChange={(e) => handleCheckBoxChange(e, item._id, index)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={item?.pro_img?.[0]}
                        alt=""
                        className="w-[60px] h-[60px] object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold text-sm">{item.pro_Name}</p>
                        <p className="text-xs text-gray-500">
                          {item.pro_brand}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.pro_CatName}</TableCell>
                  <TableCell>{item.pro_SubCatName}</TableCell>
                  <TableCell>
                    ₹{item.pro_price}
                    <br />
                    <span className="line-through text-gray-400">
                      ₹{item.pro_old_price}
                    </span>
                  </TableCell>
                  <TableCell>{item.pro_stoke} Sale</TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="View">
                        <Button
                          onClick={() => productViewHandler(item._id)}
                          className="!w-[35px] !h-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-black !text-[25px]"
                        >
                          <IoMdEye />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <Button
                          onClick={() => updateHandler(item._id)}
                          className="!w-[35px] !h-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-black !text-[25px]"
                        >
                          <MdModeEdit />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          onClick={() => deleteProductHandler(item._id)}
                          className="!w-[35px] !h-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-black !text-[25px]"
                        >
                          {loadingId === item._id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <MdDelete />
                          )}
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={productData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default Product;
