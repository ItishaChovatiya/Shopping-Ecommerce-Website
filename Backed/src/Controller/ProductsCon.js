const Product = require("../Model/product_model");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");
const ProductRAM = require("../Model/ProductRAM_Model");
const ProductWeight = require("../Model/ProductWEIGHT_Model");
const ProductSize = require("../Model/ProductSize_Model");
// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const CreateProduct = async (req, res) => {
  try {
    const {
      pro_Name,
      pro_desc,
      pro_brand,
      pro_price,
      pro_old_price,
      pro_CatName,
      pro_CatId,
      pro_SubCatId,
      pro_SubCatName,
      pro_thirdSubCat,
      pro_thirdSubCatId,
      pro_stoke,
      pro_rating,
      isFeatured,
      pro_discount,
      pro_RAM,
      pro_Size,
      pro_Weight,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const imageArr = [];
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      folder: "uploads",
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
    }

    req.files.forEach((file) => {
      fs.unlinkSync(path.resolve(file.path));
    });

    const product = new Product({
      pro_Name,
      pro_desc,
      pro_img: imageArr,
      pro_brand,
      pro_price,
      pro_old_price,
      pro_CatName,
      pro_CatId,
      pro_SubCatId,
      pro_SubCatName,
      pro_thirdSubCat,
      pro_thirdSubCatId,
      pro_stoke,
      pro_rating,
      isFeatured,
      pro_discount,
      pro_RAM,
      pro_Size,
      pro_Weight,
    });

    const savedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllPro = async (req, res) => {
  try {
    const product = await Product.find().populate("category");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      error: false,
      success: true,
      message: "Products retrieved successfully",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message,
    });
  }
};

const UpdateProduct = async (req, res) => {
  try {
    const {
      pro_Name,
      pro_desc,
      pro_brand,
      pro_price,
      pro_old_price,
      pro_CatName,
      pro_CatId,
      pro_SubCatId,
      pro_SubCatName,
      pro_thirdSubCat,
      pro_thirdSubCatId,
      pro_stoke,
      pro_rating,
      isFeatured,
      pro_discount,
      pro_RAM,
      pro_Size,
      pro_Weight,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }
    const product = await Product.findById(req.params.id); //All Image delete karava mate

    let imageArr = [];

    // ✅ Fixed version: Extract correct Cloudinary public ID (with folder path)
    const getPublicIdFromUrl = (url) => {
      const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    // ✅ Delete old images if new files uploaded
    if (req.files && req.files.length > 0) {
      // console.log("Files detected, preparing to delete old images");

      const oldPublicIds = (product.pro_img || [])
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
      }

      // ✅ Upload new images
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
        folder: "uploads",
      };

      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(
          req.files[i].path,
          options
        );
        // console.log("Uploaded:", result.secure_url);

        if (result?.secure_url) {
          imageArr.push(result.secure_url);
        } else {
          console.warn("Upload failed for:", req.files[i].originalname);
        }

        // ✅ Delete temp local file
        fs.unlinkSync(path.resolve(req.files[i].path));
      }
    } else {
      imageArr = product?.pro_img || [];
    }
    const update = await Product.findByIdAndUpdate(req.params.id, {
      pro_Name,
      pro_desc,
      pro_img: imageArr,
      pro_brand,
      pro_price,
      pro_old_price,
      pro_CatName,
      pro_CatId,
      pro_SubCatId,
      pro_SubCatName,
      pro_thirdSubCat,
      pro_thirdSubCatId,
      pro_stoke,
      pro_rating,
      isFeatured,
      pro_discount,
      pro_RAM,
      pro_Size,
      pro_Weight,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: update,
    });
  } catch (error) {
    // console.log("catch");
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error,
    });
  }
};

const DeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    try {
      const getPublicIdFromUrl = (url) => {
        const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/;
        const match = url.match(regex);
        return match ? match[1] : null;
      };
      if (product.pro_img !== null) {
        const oldPublicIds = (product.pro_img || [])
          .map(getPublicIdFromUrl)
          .filter(Boolean);

        if (oldPublicIds.length > 0) {
          const deleteResult = await cloudinary.api.delete_resources(
            oldPublicIds,
            {
              resource_type: "image",
            }
          );
        }
      }
    } catch (error) {
      console.error("Failed to delete images:", error);
      throw error;
    }

    const remove = await product.deleteOne();
    // const remove = await product.findByIdAndDelete(req.params.id); also do with this way
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      remove,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//for admin only
const DeleteAllProduct = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
  for (let i = 0; i < ids.length; i++) {
    const product = await Product.findById(ids[i]);
    const images = product.pro_img;
    const getPublicIdFromUrl = (url) => {
      const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    if (product.pro_img !== null) {
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
  }
  try {
    const remove = await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: "All Products deleted successfully",
      remove,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get single product by id
const GetProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product get successfully",
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProByCatId = async (req, res) => {
  try {
    const product = await Product.find({ pro_CatId: req.params.id }).populate(
      "category"
    );

    if (!product || product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProByCatName = async (req, res) => {
  try {
    const product = await Product.find({
      pro_CatName: req.query.pro_CatName,
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProBySubCatId = async (req, res) => {
  try {
    const product = await Product.find({
      pro_SubCatId: req.params.id,
    }).populate("category");

    if (!product || product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProBySubCatName = async (req, res) => {
  try {
    const product = await Product.find({
      pro_SubCatName: req.query.pro_SubCatName,
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProBythirdCatId = async (req, res) => {
  try {
    const product = await Product.find({
      pro_thirdSubCatId: req.params.id,
    }).populate("category");

    if (!product || product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: product,
    });
  } catch (error) {
    console.log("mkxmkax");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProByThirdCatName = async (req, res) => {
  try {
    const product = await Product.find({
      pro_thirdSubCat: req.query.pro_thirdCatName,
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProByPrice = async (req, res) => {
  try {
    let productList = [];
    if (req.query.pro_CatId && req.query.pro_CatId !== "") {
      const productListArr = await Product.find({
        pro_CatId: req.query.pro_CatId,
      }).populate("category");
      productList = productListArr;
    }

    if (req.query.pro_SubCatName && req.query.pro_SubCatName !== "") {
      const productListArr = await Product.find({
        pro_SubCatName: req.query.pro_SubCatName,
      }).populate("category");
      productList = productListArr;
    }

    if (req.query.pro_thirdSubCat && req.query.pro_thirdSubCat !== "") {
      const productListArr = await Product.find({
        pro_thirdSubCat: req.query.pro_thirdSubCat,
      }).populate("category");
      productList = productListArr;
    }

    //filter product by price
    const FilteredProduct = productList.filter((product) => {
      if (product.pro_price < parseInt(req.query.minprice)) {
        return false;
      }
      if (product.pro_price > parseInt(req.query.maxprice)) {
        return false;
      }
      return true;
    });

    return res.status(200).json({
      success: true,
      message: "Product list by price filter",
      data: FilteredProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProByRating = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPost = await Product.countDocuments();
    const totalPage = Math.ceil(totalPost / perPage);

    if (page > totalPage) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    const filter = {};

    if (req.query.pro_CatId) {
      filter = await Product.find({
        pro_rating: req.query.pro_rating,
        pro_CatId: req.query.pro_CatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (req.query.pro_SubCatId) {
      filter = await Product.find({
        pro_SubCatId: req.query.pro_SubCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (req.query.pro_thirdSubCatId) {
      filter = await Product.find({
        pro_thirdSubCatId: req.query.pro_thirdSubCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (!filter) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: filter,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetProCount = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    if (!productCount) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products count retrieved successfully",
      productCount: productCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllProByIsFeatured = async (req, res) => {
  try {
    const product = await Product.find({
      isFeatured: true,
    }).populate("category");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const CreateRAM = async (req, res) => {
  try {
    const { ram } = req.body;

    const existingRAM = await ProductRAM.findOne({ ram });

    if (existingRAM) {
      return res.status(409).json({
        success: false,
        message: "RAM already exists",
        existingRAM,
      });
    }

    const newRAM = new ProductRAM({ ram });
    const savedProductRAM = await newRAM.save();

    res.status(200).json({
      success: true,
      message: "RAM created successfully",
      productRAM: savedProductRAM,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating RAM",
      error: err.message,
    });
  }
};

const GetProductRAM = async (req, res) => {
  try {
    const productram = await ProductRAM.find();
    if (!productram) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).json({
      error: false,
      success: true,
      message: "Products retrieved successfully",
      products: productram,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message,
    });
  }
};

const DeleteProductRam = async (req, res) => {
  try {
    const productRAMS = await ProductRAM.findById(req.params.id);
    if (!productRAMS) {
      return res.status(404).json({
        success: false,
        message: "ProductRAM not found",
      });
    }

    const remove = await ProductRAM.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "RAM deleted successfully",
      remove: remove,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting RAM",
    });
  }
};

const UpdateProductRAM = async (req, res) => {
  try {
    const update = await ProductRAM.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "ProductRAM not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const CreateWeight = async (req, res) => {
  try {
    const { weight } = req.body;

    const existingWeight = await ProductWeight.findOne({ weight });

    if (existingWeight) {
      return res.status(409).json({
        success: false,
        message: "Weight already exists",
        existingWeight,
      });
    }

    const newWeight = new ProductWeight({ weight });
    const savedWeight = await newWeight.save();

    res.status(200).json({
      success: true,
      message: "Weight created successfully",
      productWeight: savedWeight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating weight",
      error: err.message,
    });
  }
};

const GetProductWeight = async (req, res) => {
  try {
    const productWeights = await ProductWeight.find();

    if (!productWeights.length) {
      return res.status(404).json({
        success: false,
        message: "No weights found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Weights retrieved successfully",
      products: productWeights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const DeleteProductWeight = async (req, res) => {
  try {
    const weight = await ProductWeight.findById(req.params.id);

    if (!weight) {
      return res.status(404).json({
        success: false,
        message: "ProductWeight not found",
      });
    }

    const removed = await ProductWeight.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Weight deleted successfully",
      removed,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting weight",
    });
  }
};

const UpdateProductWeight = async (req, res) => {
  try {
    const updated = await ProductWeight.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "ProductWeight not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Weight updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const CreateSize = async (req, res) => {
  try {
    const { size } = req.body;

    const existingSize = await ProductSize.findOne({ size });
    if (existingSize) {
      return res.status(409).json({
        success: false,
        message: "Size already exists",
        existingSize,
      });
    }

    const newSize = new ProductSize({ size });
    const savedSize = await newSize.save();

    res.status(200).json({
      success: true,
      message: "Size created successfully",
      productSize: savedSize,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating size",
      error: err.message,
    });
  }
};

const GetProductSize = async (req, res) => {
  try {
    const productSizes = await ProductSize.find();
    if (!productSizes.length) {
      return res.status(404).json({
        success: false,
        message: "No sizes found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sizes retrieved successfully",
      products: productSizes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const DeleteProductSize = async (req, res) => {
  try {
    const size = await ProductSize.findById(req.params.id);
    if (!size) {
      return res.status(404).json({
        success: false,
        message: "ProductSize not found",
      });
    }

    const removed = await ProductSize.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Size deleted successfully",
      removed,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting size",
    });
  }
};

const UpdateProductSize = async (req, res) => {
  try {
    const updated = await ProductSize.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "ProductSize not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Size updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const filter = async (req, res) => {
  try {
    const {
      pro_CatId = [],
      pro_SubCatId = [],
      pro_thirdSubCatId = [],
      pro_Size = [],
      minPrice = 0,
      maxPrice = 100000,
      pro_rating = [],
      page = 1,
      limit = 10,
    } = req.body;

    const filters = {};

    if (pro_Size.length) {
      filters.pro_Size = { $in: pro_Size };
    }
    if (pro_CatId.length) {
      filters.pro_CatId = { $in: pro_CatId };
      //means into the filters obj it create pro_CatId key and strore pro_CatId values

      //      filters = {
      //   pro_CatId: { $in: ["64abc123", "64def456"] }
      // }
    }

    if (pro_rating.length) {
      filters.pro_rating = { $in: pro_rating };
    }

    if (pro_SubCatId.length) {
      filters.pro_SubCatId = { $in: pro_SubCatId };
    }

    if (pro_thirdSubCatId.length) {
      filters.pro_thirdSubCatId = { $in: pro_thirdSubCatId };
    }

    // Filter by price
    filters.pro_price = {
      $gte: +minPrice || 0,
      $lte: +maxPrice || 100000,
    };

    const product = await Product.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filters);

    res.status(200).json({
      success: true,
      message: "Products found",
      data: product,
      total,
      page: parseInt(page),
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Filter error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sortedItems = (order, sortBy, products) => {
  return products.sort((a, b) => {
    if (sortBy === "pro_Name") {
      return order === "asc"
        ? a.pro_Name.localeCompare(b.pro_Name)
        : b.pro_Name.localeCompare(a.pro_Name);
    }
    if (sortBy === "pro_price") {
      return order === "asc"
        ? a.pro_price - b.pro_price
        : b.pro_price - a.pro_price;
    }
    return 0;
  });
};

const SortBy = async (req, res) => {
  try {
    const { sortBy, order, products } = req.body;

    const sortedItem = sortedItems(order, sortBy, [...products]);

    return res.status(200).json({
      success: true,
      message: "Sorted",
      products: sortedItem,
    });
  } catch (error) {
    console.error("Sort error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const DataSearchCon = async (req, res) => {
  try {
    const text = req.query.text;

    const data = await Product.find({
      $or: [
        {
          pro_Name: { $regex: text, $options: "i" },
        },
        {
          pro_brand: { $regex: text, $options: "i" },
        },
        {
          pro_CatName: { $regex: text, $options: "i" },
        },
        {
          pro_SubCatName: { $regex: text, $options: "i" },
        },
        {
          pro_thirdSubCat: { $regex: text, $options: "i" },
        },
      ],
    }).populate("category");

    res.status(200).json({
      success: true,
      message: "data got it",
      data: data,
    });
  } catch (error) {
    console.error("Sort error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  CreateProduct,
  GetAllPro,
  GetAllProByCatId,
  GetAllProByCatName,
  GetAllProBySubCatId,
  GetAllProBySubCatName,
  GetProduct,
  GetAllProBythirdCatId,
  GetAllProByThirdCatName,
  GetAllProByPrice,
  GetAllProByRating,
  GetProCount,
  GetAllProByIsFeatured,
  DeleteProduct,
  UpdateProduct,
  DeleteAllProduct,
  DeleteProductRam,
  UpdateProductRAM,
  GetProductRAM,
  CreateWeight,
  GetProductWeight,
  DeleteProductWeight,
  UpdateProductWeight,
  CreateSize,
  GetProductSize,
  UpdateProductSize,
  DeleteProductSize,
  CreateRAM,
  filter,
  SortBy,
  DataSearchCon,
};
