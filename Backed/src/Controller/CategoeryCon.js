const Category = require("../Model/Category_model");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

var imageArr = [];

const CreateCategoery = async (req, res) => {
  try {
    const { Name } = req.body;
    imageArr = [];
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };
    for (let i = 0; i < req.files.length; i++) {
      const result = await cloudinary.uploader.upload(
        req.files[i].path,
        options
      );
      if (result?.secure_url) {
        imageArr.push(result.secure_url);
      } else {
        console.warn("Upload failed for:", req.files[i].originalname);
      }
      req.files.forEach((file) => {
        fs.unlinkSync(path.resolve(file.path));
      });
    }
    const category = new Category({
      Name: Name,
      images: imageArr,
      parentCatName: req.body.parentCatName,
      parentCatId: req.body.parentCatId,
    });
    const savedCategory = await category.save();
    imageArr = [];
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const GetCategoery = async (req, res) => {
  try {
    const categories = await Category.find();

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat._doc, children: [] };
    });
    //  this thing add children : [] to the all category document or data
    //{
    //   "1": { _id: 1, name: "Electronics", parentCatId: null, children: [] },
    //   "2": { _id: 2, name: "Mobiles", parentCatId: 1, children: [] },
    //   "3": { _id: 3, name: "Laptops", parentCatId: 1, children: [] },
    //   "4": { _id: 4, name: "iPhone", parentCatId: 2, children: [] },
    // }  categoryMap return like this 

    const rootCategories = [];

    categories.forEach((cat) => {
      if (categoryMap[cat.parentCatId]) {
        categoryMap[cat.parentCatId].children.push(categoryMap[cat._id]);
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      categories: rootCategories,
    });
  } catch (error) {
    console.error("Get Category Error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const GetCategoeryCount = async (req, res) => {
  try {
    const count = await Category.countDocuments({ parentCatId: null });
    if (!count) {
      res.status(500).json({ success: false, error: true });
    } else {
      res.send({
        count: count,
      });
    }
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const GetSubCategoeryCount = async (req, res) => {
  try {
    const category = await Category.find();

    if (!category) {
      res.status(500).json({ success: false, error: true });
    } else {
      const SubCatArr = [];
      for (let cat of category) {
        if (cat.parentCatId !== null) {
          SubCatArr.push(cat);
        }
      }
      res.send({
        count: SubCatArr.length,
      });
    }
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get single categoery
const GetSingleCat = async (req, res) => {
  try {
    const categoery = await Category.findById(req.params.id);
    if (!categoery) {
      res.status(500).json({
        success: false,
        error: true,
        message: "the categoery with the given id  was not found....",
      });
    }
    return res.status(200).json({
      categoery,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const DeleteCat = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const Categoery = await Category.findById(categoryId);

    if (!Categoery) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete images from Cloudinary
    const images = Categoery.images || [];
    const getPublicIdFromUrl = (url) => {
      const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    if (Categoery.images !== null) {
      // console.log("Files detected, preparing to delete old images");

      const oldPublicIds = (images || [])
        .map(getPublicIdFromUrl)
        .filter(Boolean);
      // console.log("Old public IDs to delete:", oldPublicIds);

      if (oldPublicIds.length > 0) {
        const deleteResult = await cloudinary.api.delete_resources(
          oldPublicIds,
          {
            resource_type: "image",
          }
        );
        // console.log("Deleted old images:", deleteResult);
      }
    }

    const isSubCategoery = await Category.find({ parentCatId: categoryId });

    for (let i = 0; i < isSubCategoery.length; i++) {
      const subCat = isSubCategoery[i];

      const thirdSubCategoery = await Category.find({
        parentCatId: subCat._id,
      });
      for (let j = 0; j < thirdSubCategoery.length; j++) {
        await Category.findByIdAndDelete(thirdSubCategoery[j]._id);
      }

      await Category.findByIdAndDelete(subCat._id);
    }

    const deleteCat = await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      message: "Category deleted!",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const UpdateCat = async (req, res) => {
  try {
    const { Name } = req.body;
    const categoryId = req.params.id;

    if (!req.body || !categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing data and id" });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const getPublicIdFromUrl = (url) => {
      const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };
    imageArr = [];
    if (req.files && req.files.length > 0) {
      //    console.log("Files detected, preparing to delete old images");
      const oldPublicIds = (category?.images).map((url) =>
        getPublicIdFromUrl(url)
      );
      if (oldPublicIds.length > 0) {
        const deleteResult = await cloudinary.api.delete_resources(
          oldPublicIds,
          { resource_type: "image" }
        );
        // console.log("Deleted old images:", deleteResult);
        // console.log("Old image URLs:", category.images);
        // console.log("Old public IDs to delete:", oldPublicIds);
      }
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };
      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(
          req.files[i].path,
          options
        );
        // console.log(result.secure_url);
        if (result?.secure_url) {
          imageArr.push(result.secure_url);
        } else {
          console.warn("Upload failed for:", req.files[i].originalname);
        }
        fs.unlinkSync(path.resolve(req.files[i].path));
      }
    } else {
      imageArr = category.images;
    }

    // console.log("New image URLs:", imageArr);
    const updated = await Category.findByIdAndUpdate(
      categoryId,
      {
        Name,
        images: imageArr || [],
      },
      { new: true }
    );

    imageArr = [];
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updated,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

module.exports = {
  CreateCategoery,
  GetCategoery,
  GetCategoeryCount,
  GetSubCategoeryCount,
  GetSingleCat,
  DeleteCat,
  UpdateCat,
};
