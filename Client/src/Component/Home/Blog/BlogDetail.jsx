import React, { useEffect, useState } from 'react';
import { getData } from '../../../utils/Api';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'antd';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        getData(`/v1/Blog/GetSingleBlogData/${id}`).then((res) => {
            setBlog(res.Blog);
            console.log("res", res);
        }).catch((err) => {
            console.error("Error fetching blog:", err);
        });
    }, [id]);

  
    if (!blog) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-500">Loading blog...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Link to="/">
                <Button className='border text-white bg-black py-3 px-4'>
                    ← Back to Home Page
                </Button>
            </Link>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-5">
                <img
                    src={blog.image?.[0]}
                    alt={blog.Name}
                    className="w-full h-[400px] object-cover relative"
                />
               
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{blog.Name}</h1>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{blog.description}</p>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
