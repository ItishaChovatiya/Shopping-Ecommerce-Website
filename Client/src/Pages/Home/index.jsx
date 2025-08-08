import React, { useState, useEffect, useContext } from "react";
import Carousel from "../../Component/Home/HomeBanner";
import CatSlider from "../../Component/Home/CategorySliderCom";
import DisplayProduct from "../../Component/Home/DisplayProduct";
import { getData } from "../../utils/Api";

import { ClientContext } from "../../App";
import DisplayPopulerProduct from "../../Component/Home/DisplayProduct/PopulerProduct";
import BlogItem from "../../Component/Home/Blog";

const HomePage = () => {
  const [catData, setCatData] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    getData(`/v1/category/Get?token=${token}`).then((res) => {
      setCatData(res.categories || []);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const context = useContext(ClientContext);

  return (
    <div className="w-full">
      {/* home first slider section */}
      <section className="mb-10">
        <div className="container flex flex-row">
          <div className="w-full overflow-hidden">
            <Carousel />
          </div>
        </div>
      </section>

      {/* category slider */}
      <CatSlider catData={catData} />

      {/* display cart */}
      <DisplayProduct />

      <DisplayPopulerProduct />

      {/* blog section */}
      <BlogItem />
    </div>
  );
};

export default HomePage;
