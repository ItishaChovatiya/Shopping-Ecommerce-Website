import React, { useContext, useEffect, useState } from 'react'
import { HiPlus } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import { MyContext } from '../../../App';
import { DeleteData, getData } from '../../../utils/Api';
import { useNavigate } from 'react-router-dom';



const columns = [
  { id: 'Image', label: 'IMAGE' },
  { id: 'action', label: 'Action' }
];

const HomeBanner = () => {
  const context = useContext(MyContext)
  const [data, setData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getData("/v1/HomeBanner/getBanners").then((res) => {
      setData(res.BannerData);
    })
  }, [])

  const deleteHandler = (id) => {
    DeleteData(`/v1/HomeBanner/delete?id=${id}`).then((res) => {
      context.alertBox("success", res.message)
     setData((prev) => prev.filter(item => item._id !== id));
    })
  }

  return (

    <div className="flex flex-col bg-white">
      <div className="flex justify-between items-center">
        <div className='flex  flex-col p-3'>
          <h2 className='text-[30px] font-[600]'>Home Banner List</h2>
        </div>
        <div className="flex items-center gap-3">
         
          <button onClick={() => navigate("/AddHomeBanner")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
            <HiPlus className="text-base" />
            Add Banners
          </button>
        </div>
      </div>




      <div>
        <TableContainer >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>

                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    className='text-blue-700'
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data?.length > 0 && data.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <div className='flex items-centet'>
                          <div className='w-full h-[150px] rounded overflow-hidden'>
                            <img src={item.image} alt='pimg' className='w-full h-full object-cover transition-transform duration-200 hover:scale-105' />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className='flex items-center gap-2 justify-center'>
                          <Tooltip title="Delete">
                            <Button onClick={() => deleteHandler(item._id)} className='!w-[35px] !h-[35px] !min-w-[35px] !bg-[#f1f1f1]' style={{ border: "1px solid black" }}>
                              <MdDelete className='text-[30px] text-black' />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>

          </Table>
        </TableContainer>

      </div>
    </div>
  )
}

export default HomeBanner