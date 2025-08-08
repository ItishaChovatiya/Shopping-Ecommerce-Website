import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import { Button } from 'antd';
import { ClientContext } from '../../../App';
import DisplayReview from "./DisplayRating";
import { postData } from '../../../utils/Api';
import men from '../../../assets/men.jpg';
import { getData } from '../../../utils/Api';
const ProductReview = (props) => {
  const [review, setReview] = useState({
    image: [],
    Name: "",
    rating: 0,
    review: "",
    userId: "",
    productId: ""
  });

  const context = useContext(ClientContext);

  const [reviewData, setReviewData] = useState([])
  useEffect(() => {
    if (context?.userData?._id && props?.productId) {
      setReview(prev => ({
        ...prev,
        userId: context.userData._id,
        image: context.userData.avatar || "",
        Name: context.userData.Name,
        productId: props.productId
      }));

      getData(`/v1/user/GetReviewData?productId=${props.productId}`).then((res) => {
        if (res?.review && Array.isArray(res.review)) {
          setReviewData(res.review);
        } else {
          setReviewData([]);
        }
      }).catch((error) => {
        console.error("Failed to fetch review data:", error);
        setReviewData([]);
      });
    }
  }, [context?.userData, props?.productId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e, newValue) => {
    setReview(prev => ({ ...prev, rating: newValue }));
  };



  const token = localStorage.getItem("accessToken")
  const handleSubmit = () => {
    postData(`/v1/user/Review?token=${token}`, review).then((res) => {
      context.alertBox("success", "Thank You For Time And Review...");
      setReview(pre => ({ ...pre, review: "", rating: 0 }));
      getData(`/v1/user/GetReviewData?productId=${props.productId}`)
        .then((res) => {
          if (res?.review && Array.isArray(res.review)) {
            setReviewData(res.review);
          } else {
            setReviewData([]);
          }
        });
    }).catch((error) => {
      context.alertBox("error", error.message);
    });
  };


  return (
    <div className="px-4 md:px-8 py-6 min-h-screen">
      <div className="border bg-white shadow-md rounded-2xl max-h-[450px] overflow-y-auto p-4">
        {reviewData.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          reviewData.map((item, index) => (
            <div key={index} className="w-full mb-4 border-b pb-4 last:border-b-0">
              <div className="flex items-start gap-4">
                <img
                  src={item.image?.[0] || men} 
                  alt="Reviewer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-base text-gray-800">{item.Name}</p>
                      <p className="text-sm text-gray-500">{item.date_created?.slice(0, 10)}</p>
                    </div>
                    <Rating name="read-only" value={+item.rating} readOnly size="small" />
                  </div>
                  <pre className="mt-2 text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                    {item.review}
                  </pre>

                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 max-w-xl mx-auto mt-9">
        <p className="text-xl font-bold text-gray-800 mb-5 border-b pb-2">Share Your Experience</p>

        <form className="space-y-5">
          <div className="flex items-center gap-3">
            <img
              src={review.image}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <h2 className="font-semibold text-gray-700">{review.Name}</h2>
          </div>

          <TextField
            label="Your Review"
            name="review"
            multiline
            rows={4}
            placeholder="Tell us what you think..."
            variant="outlined"
            className="w-full bg-white"
            value={review.review}
            onChange={handleInputChange}
          />

          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-gray-700">Your Rating:</p>
            <Rating
              name="rating"
              onChange={handleRatingChange}
              value={review.rating}
            />
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            className="!rounded-full px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProductReview;
