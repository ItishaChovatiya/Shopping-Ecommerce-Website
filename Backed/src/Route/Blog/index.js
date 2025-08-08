const express = require('express');
const Auth = require("../../Middlewares/Auth");
const upload = require('../../Middlewares/Multer');
const { CreateBlog, GetAllBlog, UpdateBlog, DeleteBlog, GetSingleBlog } = require('../../Controller/BlogCon');

const Blog_route = express.Router();

Blog_route.post('/AddBlog', Auth, upload.array('image'),CreateBlog); 
Blog_route.get("/GetBlogData",GetAllBlog)
Blog_route.get("/GetSingleBlogData/:id",GetSingleBlog)
Blog_route.put("/UpdateBlog/:id",Auth, upload.array('image'),UpdateBlog)
Blog_route.delete("/DeleteBlog/:id",Auth,DeleteBlog)


module.exports = Blog_route;