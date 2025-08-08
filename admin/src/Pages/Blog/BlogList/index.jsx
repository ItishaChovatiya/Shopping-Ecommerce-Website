import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { MyContext } from '../../../App';
import { FiSearch, FiFilter, FiUpload } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { BiListUl } from "react-icons/bi";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import { DeleteData } from '../../../utils/Api';

const BlogList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchdata, setSearchData] = useState({ search: "" });
    const context = useContext(MyContext);

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setSearchData({ ...searchdata, [name]: value });
        setPage(0); // Reset to first page on new search
    };
    const token = localStorage.getItem('accessToken')
    const deleteHandler = (id) => {
        DeleteData(`/v1/Blog/DeleteBlog/${id}?token=${token}`).then((res) => {
            context?.setCatData(prev => prev.filter(cat => cat._id !== id));
            context?.alertBox("success", "Blog deleted...");
        });
    };

    // console.log(context.catData);

    const filteredData = context?.blogData?.filter(cat =>
        cat?.Name?.toLowerCase().includes(searchdata.search.toLowerCase())
    ) || [];

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
        <div>
            <div className="flex flex-col gap-4 py-4 bg-white">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Blog</h1>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                            <FiUpload className="text-base" />
                            Export
                        </button>
                        <Link to="/AddBlog">
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                                <HiPlus className="text-base" />
                                Add Blog
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="relative w-1/3">
                        <input
                            type="text"
                            name="search"
                            onChange={inputHandler}
                            placeholder="Search By Blog title..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                            <FiFilter className="text-base" />
                            Filters
                        </button>
                        <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-50">
                            <BiListUl className="text-base text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col p-5'>
                <h2 className='text-[20px] font-[600] pb-5'>Blog List</h2>
            </div>

            <TableContainer className="w-full border border-gray-400">
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ width: '30%' }}>Image</TableCell>
                            <TableCell align="center" style={{ width: '25%' }}>Name</TableCell>
                            <TableCell align="center" style={{ width: '25%' }}>Description</TableCell>
                            <TableCell align="center" style={{ width: '20%' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <TableRow key={index} style={{ height: 100 }}>
                                    <TableCell align="center" style={{ width: '30%', padding: 0 }}>
                                        <div className="flex justify-center items-center h-[80px]">
                                            <div className="w-[250px] h-[80px] flex justify-center items-center rounded overflow-hidden">
                                                <Link>
                                                    <img
                                                        src={item?.image[0]}
                                                        alt="pimg"
                                                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '10%' }}>
                                        <h3 className="text-[18px] font-[400]">{item.Name.slice(0, 40)}...</h3>
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '40%' }} className='!px-10'>
                                        <h3 className="text-[18px] font-[400]">{item.description.slice(0, 30)}...</h3>
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '20%' }}>
                                        <div className="flex items-center gap-2 justify-center">
                                            <Tooltip title="View">
                                                <Button className="!w-[35px] !h-[35px] !min-w-[35px] !bg-[#f1f1f1]" style={{ border: "1px solid black" }}>
                                                    <IoMdEye className="text-[30px] text-black" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <Link to={`/AddBlog/${item._id}`}>
                                                <Button className="!w-[35px] !h-[35px] !min-w-[35px] !bg-[#f1f1f1]" style={{ border: "1px solid black" }}>
                                                    <MdModeEdit className="text-[30px] text-black" />
                                                </Button>
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <Button onClick={() => deleteHandler(item._id)} className="!w-[35px] !h-[35px] !min-w-[35px] !bg-[#f1f1f1]" style={{ border: "1px solid black" }}>
                                                    <MdDelete className="text-[30px] text-black" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No Blog found...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25,]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    )
}

export default BlogList
