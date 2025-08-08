import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import User from "../../assets/user_image.jpg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useContext } from "react";
import { MyContext } from "../../App";
import Badge from "../../Components/Badge";

const columns = [
  { id: "UserImage", label: "USER IMAGE", minWidth: 200 },
  { id: "userName", label: "USER NAME", minWidth: 120, align: "left" },
  { id: "useremail", label: "USER EMAIL", minWidth: 120, align: "left" },
  { id: "userPhone", label: "USER PHONE", minWidth: 100, align: "left" },
  { id: "created", label: "USER CREATED", minWidth: 100, align: "left" },
  { id: "verified", label: "USER VERIFIED", minWidth: 100, align: "left" },
];

const UserPage = () => {
  const context = useContext(MyContext);

  useEffect(() => {
    context?.UsersListHandler();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [Search, setSearch] = useState("");
  return (
    <div>
      <div className="flex flex-col gap-4 py-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Users List</h1>
          </div>
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search User By name, email, date....."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {context?.Users?.filter(
              (item) =>
                item?.Name?.toLowerCase().includes(Search.toLowerCase()) ||
                item?.email?.toLowerCase().includes(Search.toLowerCase()) ||
                item?.createdAt?.split("T")[0].includes(Search)
            )?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="w-[65px] h-[65px] rounded overflow-hidden">
                        <img
                          src={
                            Array.isArray(item?.avatar) // ✅ If avatar is an array
                              ? item.avatar[0] || User // → Use the first image or fallback to User
                              : item?.avatar && item.avatar.trim() !== "" // ✅ Else, if avatar is a non-empty string
                              ? item.avatar // → Use that string
                              : User // ❌ Else (null/undefined/empty) → fallback to User
                          }
                          alt="profile"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-[500] text-[17px] leading-5">
                      {item?.Name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-sm leading-5">
                      {item?.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    {item?.mobile ? "+" + item.mobile : "Yet Not Added Number"}
                  </TableCell>
                  <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                  <TableCell>
                    {item?.verify_email === true ? (
                      <Badge status={"verified"} />
                    ) : (
                      <Badge id={item._id} status={"notVerified"} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={10}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default UserPage;
