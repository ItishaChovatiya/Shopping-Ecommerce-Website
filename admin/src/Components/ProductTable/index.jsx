import React, { useContext, useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
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
import { MyContext } from "../../App";
import { DeleteData, deleteMultipleData, getData } from "../../utils/Api";

const columns = [
  { id: "product", label: "PRODUCT", minWidth: 200 },
  { id: "pro_CatName", label: "CATEGORY", minWidth: 120, align: "left" },
  { id: "pro_SubCatName", label: "SUB.CATEGORY", minWidth: 120, align: "left" },
  { id: "pro_price", label: "PRICE", minWidth: 100, align: "left" },
  { id: "sale", label: "SALE", minWidth: 100, align: "left" },
  { id: "action", label: "ACTION", minWidth: 150, align: "center" },
];
const ProductTable = (props) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // <-- Loading for table
  const [multiDeleteLoading, setMultiDeleteLoading] = useState(false); // <-- Loading for multi-delete
  const [productData, setProductData] = useState([]);

  const [sortedIds, setSortedIds] = useState([]);

  const context = useContext(MyContext);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (props.selectedCat) {
      productByCat();
    } else {
      getProducts();
    }
  }, [context.catData, props.selectedCat]);

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

  const productByCat = () => {
    getData(
      `/v1/product/GetProByCatName?pro_CatName=${props.selectedCat}`
    ).then((res) => {
      if (res.success === true) {
        setProductData(res.products);
      } else {
        context.alertBox("error", res.message);
      }
    });
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

  const paginatedData = Array.isArray(productData)
    ? productData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

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
      <div className="overflow-x-auto">
        {sortedIds.length > 0 && (
          <button
            onClick={deleteMultipleProduct}
            className="flex items-center gap-2 border mt-2 border-gray-300 px-5 py-2 bg-red-600 text-white rounded-md text-sm"
          >
            {multiDeleteLoading ? (
              <CircularProgress size={18} className="text-white" />
            ) : (
              "Delete"
            )}
          </button>
        )}
        <TableContainer style={{ marginTop: "30px" }}>
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
                        onChange={(e) =>
                          handleCheckBoxChange(e, item._id, index)
                        }
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
                          <p className="font-semibold text-sm">
                            {item.pro_Name}
                          </p>
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
    </div>
  );
};

export default ProductTable;
