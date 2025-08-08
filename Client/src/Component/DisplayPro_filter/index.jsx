import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Collapse } from 'react-collapse';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { ClientContext } from '../../App';
import { useLocation } from 'react-router-dom';
import { postData } from '../../utils/Api';
import Rating from '@mui/material/Rating';

const ProductFilter = (props) => {
  const context = useContext(ClientContext);
  const location = useLocation();

  const [categoryFilter, setCategoryFilter] = useState(true);
  const [ratingFilter, setRatingFilter] = useState(true);
  const [sizeFilter, setSizeFilter] = useState(true);

  const [filters, setFilters] = useState({
    pro_CatId: [],
    pro_SubCatId: [],
    pro_thirdSubCatId: [],
    pro_Size: [],
    minPrice: 100,
    maxPrice: 6000,
    pro_rating: '',
    page: 1,
    limit: 50,
  });

  const [price, setPrice] = useState([100, 6000]);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const updatedFilters = { ...filters };

    if (params.has('pro_CatId')) {
      updatedFilters.pro_CatId = [params.get('pro_CatId')];
      updatedFilters.pro_SubCatId = [];
      updatedFilters.pro_thirdSubCatId = [];
    } else if (params.has('pro_SubCatId')) {
      updatedFilters.pro_SubCatId = [params.get('pro_SubCatId')];
      updatedFilters.pro_CatId = [];
      updatedFilters.pro_thirdSubCatId = [];
    } else if (params.has('pro_thirdSubCatId')) {
      updatedFilters.pro_thirdSubCatId = [params.get('pro_thirdSubCatId')];
      updatedFilters.pro_CatId = [];
      updatedFilters.pro_SubCatId = [];
    }

    updatedFilters.page = 1;
    setFilters(updatedFilters);
  }, [location]);

  // ✅ Handle checkbox changes
  const handlerCheckBoxChange = (field, value) => {
    const currentValues = filters[field] || [];
    const updatedValue = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    const updatedFilters = { ...filters, [field]: updatedValue };

    if (field === 'pro_CatId') {
      updatedFilters.pro_SubCatId = [];
      updatedFilters.pro_thirdSubCatId = [];
    }

    setFilters(updatedFilters); // useEffect handles the API call
  };

  // ✅ Handle price slider changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: price[0],
      maxPrice: price[1],
    }));
  }, [price]);

  useEffect(() => {
    filterData(filters);
  }, [filters]);

  // ✅ Handle filter data submission
  const filterData = (customFilters) => {
    const finalFilters = {
      ...customFilters,
      minPrice: price[0],
      maxPrice: price[1],
    };  
    props.setIsLoading(true);

    postData('/v1/product/filters', finalFilters).then((res) => {
      props.setIsLoading(false);
      props.setProductData(res.data);

      if (res.totalCount) {
        const totalPages = Math.ceil(res.totalCount / filters.limit);
        props.setTtotalPages(totalPages);
      }
    });
  };
  const allSizes = context.productsData.flatMap(p => p.pro_Size || []);
  const uniqueSizes = [...new Set(allSizes)];

  const rating = [5, 4, 3, 2, 1];

  return (
    <aside className="py-5 px-5">
      <div className="filter">
        <h3 className="mb-3 text-[16px] font-[600] w-full flex items-center pr-5">
          Shop By Category
          <button className="ml-auto mt-2 text-[20px]" onClick={() => setCategoryFilter(!categoryFilter)}>
            {categoryFilter ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </h3>

        <Collapse isOpened={categoryFilter}>
          <div className="scroll px-3">
            {context?.catData?.map((cat, index) => (
              <FormControlLabel
                control={<Checkbox />}
                label={cat.Name}
                className="w-full"
                key={index}
                value={cat._id}
                checked={filters.pro_CatId.includes(cat._id)}
                onChange={() => handlerCheckBoxChange('pro_CatId', cat._id)}
              />
            ))}
          </div>
        </Collapse>
      </div>


      <div className="filter mt-4">
        <h3 className="mb-3 text-[16px] font-[600] w-full flex items-center pr-5">
          Size
          <button className="ml-auto mt-2 text-[20px]" onClick={() => setSizeFilter(!sizeFilter)}>
            {sizeFilter ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </h3>

        <Collapse isOpened={sizeFilter}>
          <div className="scroll px-3">
            {uniqueSizes.map((size, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.pro_Size.includes(size)}
                    onChange={() => handlerCheckBoxChange('pro_Size', size)}
                  />
                }
                label={size}
                className="w-full"
              />
            ))}

          </div>
        </Collapse>
      </div>

      <div className="mt-4">
        <h3 className="mb-3 text-[16px] font-[600] w-full flex items-center pr-5">Filter By Price</h3>
        <RangeSlider min={100} max={6000} value={price} onInput={setPrice} step={5} />
        <div className="flex pt-4 pb-2 justify-between">
          <span>
            From :- <strong>{price[0]}</strong> Rs
          </span>
          <span>
            To :- <strong>{price[1]}</strong> Rs
          </span>
        </div>
      </div>


      {/* Rating Filter */}
      <div className="filter mt-4">
        <h3 className="mb-3 text-[16px] font-[600] w-full flex items-center pr-5">
          Rating
          <button className="ml-auto mt-2 text-[20px]" onClick={() => setRatingFilter(!ratingFilter)}>
            {ratingFilter ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </h3>

        <Collapse isOpened={ratingFilter}>
          <div className="scroll px-3">
            {rating.map((value, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.pro_rating.includes(value)}
                    onChange={() => handlerCheckBoxChange('pro_rating', value)}
                  />
                }
                label={<Rating value={value} readOnly />}
                className="w-full"
              />
            ))}
          </div>
        </Collapse>
      </div>


    </aside>
  );
};

export default ProductFilter;