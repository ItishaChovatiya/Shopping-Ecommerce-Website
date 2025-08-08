const BannerModel = require("../Model/HomeBanner_Model")
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const AddHomeBanner = async (req, res) => {
    try {
        const { Name } = req.body;
        // console.log(req?.file);
        
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };
       
        const upload = await cloudinary.uploader.upload(req?.file?.path, options)
        fs.unlinkSync(path.resolve(req?.file?.path));   
        const banner = new BannerModel({
            Name : Name,
            image : upload.secure_url
        })
        await banner.save();
        res.status(200).json({
            success: true,
            message: "Home Banner Added Successfully",
            HomeBanner: banner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const GetHomeBanner = async (req, res) => {
    try {
        const BannerData = await BannerModel.find().sort({ createdAt: -1 });
        if (!BannerData) {
            return res.status(404).json({
                success: false,
                message: "No Banner found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Banner Data Fetched Successfully",
            BannerData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const DeleteHomeBanner = async (req, res) => {
  try {
    const bannerId = req.query.id;
    const banner = await BannerModel.findById(bannerId);

    if (!banner) {
        return res.status(404).json({
            success: false,
            message: "Home Banner not found."
        });
    }

    const getPublicIdFromUrl = (url) => {
        const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/;
        const match = url.match(regex);
        // console.log(match[1]);
        
        return match ? match[1] : null;
    };

    if (banner.image) {
        const oldPublicId = getPublicIdFromUrl(banner.image);

        if (oldPublicId) {
            const deleteResult = await cloudinary.api.delete_resources([oldPublicId], {
                resource_type: "image"
            });
            // console.log("Deleted old image:", deleteResult);
        }
    }

    await BannerModel.findByIdAndDelete(bannerId);

    res.status(200).json({
        success: true,
        message: "Home Banner deleted successfully"
    });

} catch (error) {
    console.error("Banner delete error:", error);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
    });
}

};



module.exports = { AddHomeBanner, GetHomeBanner, DeleteHomeBanner };