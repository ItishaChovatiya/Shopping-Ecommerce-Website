import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { router_page } from "./router/router_page";
import HomePage from "./Pages/Home";
import Header from "./Component/Navbar";
import Footer from "./Component/Footer";
import ProductListing from "./Pages/ProductListingFromNav";
import ProductDetail from "./Pages/ProductDetail";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ProductZoom from "./Component/ProductDetail/ProductZoomCom";
import { IoClose } from "react-icons/io5";
import ProductDetailComponent from "./Component/ProductDetail/ProductDetailComponent";
import CartPage from "./Pages/Cart";
import CheckOutpage from "./Pages/CheckOut";
import MyAccount from "./Pages/MyAccount";
import MyListPage from "./Pages/MyListPage";
import MyOrder from "./Pages/MyOrder";
import Register from "./Pages/rigester";
import Login from "./Pages/Login";
import VerifyEmail from "./Pages/VerifyEmail";
import toast, { Toaster } from "react-hot-toast";
import { DeleteData, getData, postData } from "./utils/Api";
import ResetPassword from "./Pages/ResetPassword";
import AddAddress from "./Pages/AddAdress";
import BlogDetail from "./Component/Home/Blog/BlogDetail";
import { Route, Routes } from "react-router-dom";
import AccountPageStucture from "./Pages/AccountPageStruc";
import OrderSuccess from "./Pages/MyOrder/Success";
import OrderFails from "./Pages/MyOrder/Faild";

const ClientContext = createContext();

function App() {
  const [openProductDetailModel, setOpenProductDetailModel] = useState(false);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [fullWidth, setFullWidth] = useState(true);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [getidtodisplay, setGetidtodisplay] = useState("");
  const [singleProductData, setSingleProductData] = useState({});
  const token = localStorage.getItem("accessToken");
  const [catData, setCatData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [myListData, setMyListData] = useState([]);
  const [myList, setMyList] = useState([]);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      getData(`/v1/user/getUserInfo?token=${token}`, {
        withCreadentials: true,
      }).then((res) => {
        setUserData(res.data);
      });
    } else {
      setIsLoading(false);
    }

    productData();

    if (getidtodisplay) {
      handleProductDetail();
    }

    categoryDataHandler();
  }, [token, getidtodisplay]);

  useEffect(() => {
    if (userData?._id) {
      GetAddressDataHandler();
      CartDataHandler();
      GetMyListData();
      OrderListHandler();
    }
  }, [userData?._id]);

  const productData = () => {
    getData("/v1/product/GetAllPro").then((res) => {
      setProductsData(res.products);
    });
  };

  const handleProductDetail = () => {
    getData(`/v1/product/getsingleProduct/${getidtodisplay}?token=${token}`)
      .then((res) => {
        setSingleProductData(res.product);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  };

  const categoryDataHandler = () => {
    getData(`/v1/category/Get?token=${token}`).then((res) => {
      setCatData(res.categories);
    });
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const handleClose = () => {
    setOpenProductDetailModel(false);
  };

  const addToCartHandler = (product, user_id, quantity) => {
    if (userData === null || userData === undefined) {
      alertBox("error", "Please login to add product to Cart");
    } else {
      const data = {
        productId: product.productId,
        user_id: user_id,
        quantity: quantity,
        price: product.price,
        productName: product.productName,
        image: product.image,
        subTotal: product.subTotal,
        countInStoke: product.countInStoke,
        brand: product.brand,
        size: product.size,
        ram: product.ram,
        weight: product.weight,
        discount: product.discount,
        oldPrice: product.oldPrice,
      };

      if (user_id === undefined) {
        alertBox("error", "Please login to add product to cart");
      }
      postData(`/v1/Cart/AddToCart?token=${token}`, data)
        .then((res) => {
          if (res.success === true) {
            alertBox("success", "Product Add To Cart Successfully");
            setOpenProductDetailModel(false);
            CartDataHandler();
          } else {
            alertBox("error", res.message);
          }
        })
        .catch((error) => {
          alertBox("error", error.message);
        });
    }
  };

  const alertBox = (type, mes) => {
    if (type === "success") {
      toast.success(mes);
    }
    if (type === "error") {
      toast.error(mes);
    }
  };

  const CartDataHandler = () => {
    getData(`/v1/Cart/GetCartProduct?token=${token}`).then((res) => {
      setCartData(res.data);
    });
  };

  const AddToMyListHandler = (item) => {
    if (userData === null || userData === undefined) {
      alertBox("error", "Please login to add product to wishlist");
    } else {
      const data = {
        userId: userData._id,
        productId: item._id,
        productName: item.pro_Name,
        image: item.pro_img[0],
        price: item.pro_price,
        oldPrice: item.pro_old_price,
        brand: item.pro_brand,
        discount: item.pro_discount,
        rating: item.pro_rating,
      };

      postData(`/v1/MyList/AddToMyList?token=${token}`, data)
        .then((res) => {
          if (res.success === true) {
            alertBox("success", "Product Added To My List Successfully");
            setOpenProductDetailModel(false);
            setMyListData((prev) => [...prev, data]);
          } else {
            alertBox("error", res.message);
          }
        })
        .catch((err) => {
          alertBox(
            "error",
            err?.response?.data?.message || "Something went wrong"
          );
        });
    }
  };

  const GetMyListData = () => {
    getData(`/v1/MyList/GetMyList?token=${token}`).then((res) => {
      setMyListData(res.data);
    });
  };

  const removeMyListItemHadler = (id) => {
    DeleteData(`/v1/MyList/DeleteFromMyList/${id}?token=${token}`).then(
      (res) => {
        if (res.success === true) {
          setMyListData((prev) => prev.filter((item) => item.productId !== id));
          alertBox("success", res.message);
          GetMyListData();
        }
      }
    );
  };

  const GetAddressDataHandler = async () => {
    getData(`/v1/address/GetAddressDetail/${userData._id}?token=${token}`, {
      withCredentials: true,
    })
      .then((res) => {
        setAddress(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const OrderListHandler = async () => {
    await getData(`/v1/Order/GetOrderList?token=${token}`).then((res) => {
      if (res.success === true) {
        setOrder(res.OrderList);
      } else {
        console.log(res.message);
      }
    });
  };

  

  const contextValue = {
    setOpenProductDetailModel,
    setOpenCartPanel,
    toggleCartPanel,
    openCartPanel,
    alertBox,
    isLoading,
    setIsLoading,
    userData,
    setUserData,
    setAddress,
    address,
    productsData,
    setProductsData,
    singleProductData,
    setSingleProductData,
    setGetidtodisplay,
    getidtodisplay,
    catData,
    setCatData,
    categoryDataHandler,
    addToCartHandler,
    cartData,
    setCartData,
    CartDataHandler,
    myList,
    myListData,
    setMyListData,
    AddToMyListHandler,
    removeMyListItemHadler,
    OrderListHandler,
    order,
    setOrder,
  

  };

  return (
    <ClientContext.Provider value={contextValue}>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={router_page.register} element={<Register />} />
          <Route path={router_page.VerifyEmail} element={<VerifyEmail />} />
          <Route path={router_page.Login} element={<Login />} />
          <Route path={router_page.ResetPass} element={<ResetPassword />} />
          <Route path={router_page.ProductListing} element={<ProductListing />} />
          <Route path={router_page.ProductDetail} element={<ProductDetail />} />
          <Route path={router_page.Cart} element={<CartPage />} />
          <Route path={router_page.checkOut} element={<CheckOutpage />} />

          <Route path={router_page.accountSildebarStruc} element={<AccountPageStucture />}>
            <Route index element={<MyAccount />} /> 
            <Route path={router_page.myAccount} element={<MyAccount />} />
            <Route path={router_page.myOrder} element={<MyOrder />} />
            <Route path={router_page.AddAddressDetail} element={<AddAddress />} />
            <Route path={router_page.myListPage} element={<MyListPage />} />
          </Route>

          <Route path={router_page.blogDetail} element={<BlogDetail />} />
          <Route path={router_page.SuccessOrder} element={<OrderSuccess />} />
          <Route path={router_page.FailedOrder} element={<OrderFails/>} />

        </Routes>
        <Footer />

        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={openProductDetailModel}
          onClose={handleClose}
          className="productDetailsModel"
        >
          <DialogContent>
            <div className="flex  w-full productDetailsModelContainer relative">
              <Button
                onClick={handleClose}
                className="!top-[0px] !right-[15px] !absolute  !text-[20px] !text-white !bg-black"
              >
                <IoClose />
              </Button>
              <div className="col-1 w-[38%]">
                <ProductZoom data={singleProductData} />
              </div>
              <div className="col-1 w-[62%]">
                <ProductDetailComponent data={singleProductData} />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Toaster />
      </>
    </ClientContext.Provider>
  );
}

export default App;
export { ClientContext };
