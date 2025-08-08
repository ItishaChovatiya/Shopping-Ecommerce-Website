const Blog = require("../Model/Blog_Model")
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const CreateBlog = async (req, res) => {
    try {
        const { Name, description } = req.body;
        const files = req.files;

        if (!Name || !description || !files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Name, description, and at least one image are required"
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        const imageUrls = [];

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, options);
            imageUrls.push(result.secure_url);
            fs.unlinkSync(path.resolve(file.path));
        }

        const blog = new Blog({
            Name,
            description,
            image: imageUrls
        });

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog created successfully",
            Blog: blog
        });
    } catch (error) {
        console.error("CreateBlog Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const GetAllBlog = async (req, res) => {
    try {
        const BlogData = await Blog.find().sort({ createdAt: -1 });
        if (!BlogData) {
            return res.status(404).json({
                success: false,
                message: "No Blog found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Banner Data Fetched Successfully",
            Blog: BlogData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const GetSingleBlog = async (req, res) => {
    try {
        const BlogData = await Blog.findById(req.params.id).sort({ createdAt: -1 });
        if (!BlogData) {
            return res.status(404).json({
                success: false,
                message: "No Blog found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Banner Data Fetched Successfully",
            Blog: BlogData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const UpdateBlog = async (req, res) => {
    try {
        const { Name, description } = req.body;
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Extract old public_ids
        const getPublicIdFromUrl = (url) => {
            const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/);
            return match ? match[1] : null;
        };

        const files = req.files;
        let imageUrls = [];

        if (files && files.length > 0) {
            // Delete old images
            const oldPublicIds = blog.image.map(url => getPublicIdFromUrl(url)).filter(Boolean);
            if (oldPublicIds.length > 0) {
                await cloudinary.api.delete_resources(oldPublicIds, { resource_type: "image" });
            }

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false
            };

            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, options);
                imageUrls.push(result.secure_url);
                fs.unlinkSync(path.resolve(file.path));
            }
        } else {
            imageUrls = blog.image; // Keep old images if none are uploaded
        }

        const updated = await Blog.findByIdAndUpdate(
            blogId,
            {
                Name,
                description,
                image: imageUrls
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            Blog: updated
        });
    } catch (error) {
        console.error("UpdateBlog Error:", error);
        res.status(500).json({
            success: false,
            message: "Update failed",
            error: error.message
        });
    }
};

const DeleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Extract old public_ids
        const getPublicIdFromUrl = (url) => {
            const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/);
            return match ? match[1] : null;
        };

        const files = blog.image;

        if (files && files.length > 0) {
            // Delete old images
            const oldPublicIds = blog.image.map(url => getPublicIdFromUrl(url)).filter(Boolean);
            if (oldPublicIds.length > 0) {
                await cloudinary.api.delete_resources(oldPublicIds, { resource_type: "image" });
            }
        }

        const deleteBlog = await Blog.findByIdAndDelete(blogId);
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            delete: deleteBlog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete failed",
            error: error.message
        })
    }
}


module.exports = { CreateBlog, GetAllBlog, GetSingleBlog, UpdateBlog, DeleteBlog }