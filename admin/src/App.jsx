import React, { createContext, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoard from "./Pages/Dashboard";
import Layout from "./Pages/HomeLayout";
import Product from "./Pages/ProductPage/ProductList";
import AddProduct from "./Pages/ProductPage/AddProduct/AddProduct";
import HomeBanner from "./Pages/HomeSlidepage/HomeBannerList";
import AddHomeBnner from "./Pages/HomeSlidepage/AddHomeBanner";
import ListCategoery from "./Pages/CategoeryPages/ListOfCategoery/ListCategoery";
import AddCategoery from "./Pages/CategoeryPages/AddCategoery/AddCategoery";
import ListSubCategoery from "./Pages/CategoeryPages/ListSubCategoery";
import AddSubCategoery from "./Pages/CategoeryPages/AddSubCategoery";
import UserPage from "./Pages/User";
import OrderPage from "./Pages/Order";
import toast, { Toaster } from "react-hot-toast";
import Admin_Register from "./Pages/rigester";
import Admin_VerifyEmail from "./Pages/VerifyEmail";
import Admin_ResetPassword from "./Pages/ResetPassword";
import LogIn_Admin from "./Pages/Login";
import { useEffect } from "react";
import { getData } from "./utils/Api";
import Profile from "./Pages/Profile";
import AddAddress from "./Pages/AddAdress";
import UpdateCategory from "./Pages/CategoeryPages/UpdateCategory";
import EditProduct from "./Pages/ProductPage/EditProduct/Index";
import ViewProduct from "./Pages/ProductPage/ViewProduct";
import AddProductRAM from "./Pages/ProductPage/AddProductRAMS";
import AddProductWeight from "./Pages/ProductPage/AddProductWeight";
import AddProductSize from "./Pages/ProductPage/AddProductSize";
import BlogList from "./Pages/Blog/BlogList";
import AddBlog from "./Pages/Blog/AddBlog";

const MyContext = createContext();
function App() {
  const [isSidebarOpen, setIsSideBarOpen] = useState(true);
  const [isUserSign, setIsUserSign] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState([]);
  const token = localStorage.getItem("accessToken");

  
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      getData(`/v1/user/getUserInfo?token=${token}`, {
        withCreadentials: true,
      }).then((res) => {
        setUserData(res.data);
        setIsUserSign(true);
      });
    } else {
      setIsLoading(false);
    }

    blogDataHandler();
    catDataHandler();
    OrderListHandler();
    ProductsListHandler();
    UsersListHandler();
    ReviewsListHandler();
  }, [isUserSign]);

  const alertBox = (type, mes) => {
    if (type === "success") {
      toast.success(mes);
    }
    if (type === "error") {
      toast.error(mes);
    }
  };

  const [catData, setCatData] = useState([]);
  const catDataHandler = () => {
    getData(`/v1/category/Get?token=${token}`).then((res) => {
      setCatData(Array.isArray(res.categories) ? res.categories : []);
    });
  };

  const [blogData, setBlogData] = useState([]);
  const blogDataHandler = () => {
    getData(`/v1/Blog/GetBlogData?token=${token}`).then((res) => {
      setBlogData(res.Blog);
    });
  };

  const [order, setOrder] = useState([]);
  const OrderListHandler = async () => {
    await getData(`/v1/Order/OrderList?token=${token}`).then((res) => {
      if (res.success === true) {
        setOrder(res.OrderList);
      } else {
        console.log(res.message);
      }
    });
  };

  const [Products, setProducts] = useState([]);
  const ProductsListHandler = async () => {
    await getData(`/v1/product/GetAllPro?token=${token}`).then((res) => {
      if (res.success === true) {
        setProducts(res.products);
      } else {
        console.log(res.message);
      }
    });
  };

  const [Users, setUser] = useState([]);
  const UsersListHandler = async () => {
    await getData(`/v1/user/GetAllUserList?token=${token}`).then((res) => {
      if (res.success === true) {
        setUser(res.user);
      } else {
        console.log(res.message);
      }
    });
  };

  const [reviews, setReviews] = useState([]);
  const ReviewsListHandler = async () => {
    await getData(`/v1/user/GetAllReview?token=${token}`).then((res) => {
      if (res.success === true) {
        setReviews(res.review);
      } else {
        console.log(res.message);
      }
    });
  };

  const Contextvalue = {
    isSidebarOpen,
    setIsSideBarOpen,
    isUserSign,
    setIsUserSign,
    alertBox,
    isLoading,
    setIsLoading,
    userData,
    setUserData,
    setAddress,
    address,
    catData,
    setCatData,
    blogData,
    setBlogData,
    OrderListHandler,
    order,
    setOrder,
    Products,
    ProductsListHandler,
    Users,
    UsersListHandler,
    reviews,
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      exact: true,
      children: [
        {
          index: true,
          element: <DashBoard />,
        },
        {
          path: "/Product/List",
          element: <Product />,
        },
        {
          path: "/Product/Update/:id",
          element: <EditProduct />,
        },
        {
          path: "/HomeBanner/List",
          element: <HomeBanner />,
        },
        {
          path: "/Blog/List",
          element: <BlogList />,
        },
        {
          path: "/Categoery/List",
          element: <ListCategoery />,
        },
        {
          path: "/Category/Update/:id",
          element: <UpdateCategory />,
        },
        {
          path: "/SubCategoery/List",
          element: <ListSubCategoery />,
        },
        {
          path: "/User",
          element: <UserPage />,
        },
        {
          path: "/Order",
          element: <OrderPage />,
        },
        {
          path: "/Register",
          element: <Admin_Register />,
        },
        {
          path: "/Login",
          element: <LogIn_Admin />,
        },
        {
          path: "/Verify",
          element: <Admin_VerifyEmail />,
        },
        {
          path: "/ResetPass",
          element: <Admin_ResetPassword />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/ChangePassword",
          element: <Admin_ResetPassword />,
        },
        {
          path: "/AddAddressData",
          element: <AddAddress />,
        },
        {
          path: "/Product/View/:id",
          element: <ViewProduct />,
        },
        {
          path: "/Product/AddProductRAM",
          element: <AddProductRAM />,
        },
        {
          path: "/Product/AddProductWeight",
          element: <AddProductWeight />,
        },
        {
          path: "/Product/AddProductSize",
          element: <AddProductSize />,
        },
        {
          path: "/AddProduct",
          element: <AddProduct />,
        },
        {
          path: "/AddHomeBanner",
          element: <AddHomeBnner />,
        },
        {
          path: "/AddCategoery",
          element: <AddCategoery />,
        },
        {
          path: "/AddSubCategoery",
          element: <AddSubCategoery />,
        },
        {
          path: "/AddBlog/:id",
          element: <AddBlog />,
        },
        {
          path: "/AddBlog",
          element: <AddBlog />,
        },
      ],
    },
  ]);
  return (
    <div>
      <MyContext.Provider value={Contextvalue}>
        <RouterProvider router={router} />
      </MyContext.Provider>
      <Toaster />
    </div>
  );
}

export default App;

export { MyContext };
