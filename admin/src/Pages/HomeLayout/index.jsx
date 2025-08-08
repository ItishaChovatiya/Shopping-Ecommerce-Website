import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";
import SideBar from "../../Components/SideBar";
import { MyContext } from "../../App";

const Layout = () => {
  const context = useContext(MyContext);

  return (
    <section>
      <Header />
      <div className="flex">
        <div
          className={`overflow-hidden transition-all duration-300 ${
            context.isSidebarOpen ? "w-[18%] show" : "hidden"
          }`}
        >
          {context.isSidebarOpen && <SideBar />}
        </div>
        <div
          className={`py-4 px-5 transition-all duration-300 ${
            context.isSidebarOpen ? "w-[82%]" : "w-full"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Layout;
