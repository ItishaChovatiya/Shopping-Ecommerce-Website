import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { getData } from "../../../utils/Api";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const searchHandler = () => {
    setShowDropdown(true);

    if (searchValue.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);

    getData(`/v1/product/GetSerachPro?text=${searchValue}`)
      .then((res) => {
        setTimeout(() => {
          if (res.success && Array.isArray(res.data)) {
            setSearchResults(res.data);
          } else {
            setSearchResults([]);
            inputRef.current.value = "";
          }
          setShowDropdown(true);
          setLoading(false);
          inputRef.current.value = "";
        }, 1000);
      })
      .catch((err) => {
        console.error("Search Error:", err);
        setSearchResults([]);
        setShowDropdown(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchResults([]);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="h-[60px] relative flex items-center justify-center">
        <input
          className="w-full bg-white py-3 pl-4 pr-12 focus:outline-none text-[16px] border border-gray-300 rounded-md shadow-sm"
          placeholder="Search here"
          ref={inputRef}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <button className="absolute right-[5%] text-xl text-gray-600">
          <CiSearch onClick={searchHandler} />
        </button>
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-full bg-white border border-gray-300 shadow-xl rounded-md z-50 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <CircularProgress size={30} />
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-3 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/productDetail/${product._id}`)}
              >
                <img
                  src={product.pro_img?.[0]}
                  alt={product.pro_Name}
                  className="w-[50px] h-[50px] object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm truncate">
                    {product.pro_Name.slice(1, 40)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Price: ₹{product.pro_price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
