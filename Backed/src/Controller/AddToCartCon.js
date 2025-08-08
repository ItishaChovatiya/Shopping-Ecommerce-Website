const AddToCart = require("../Model/AddToCart_Model");
const User = require("../Model/user_model");
const Product = require("../Model/product_model");

const AddToCartProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      productName,
      image,
      rating,
      price,
      quantity,
      subTotal,
      productId,
      countInStoke,
      oldPrice,
      discount,
      brand,
      weight,
      size,
      ram,
    } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const product = await Product.findById(productId);
    if (!product || quantity > countInStoke) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough stock available" });
    }

    const checkIsItemIntoCart = await AddToCart.findOne({ userId, productId });

    if (checkIsItemIntoCart) {
      return res.status(400).json({
        success: false,
        message: "Product is already in your cart",
      });
    }

    const cartItem = new AddToCart({
      productName,
      image,
      rating,
      price,
      quantity,
      subTotal,
      countInStoke,
      userId,
      productId,
      brand,
      weight,
      size,
      ram,
      discount,
      oldPrice,
    });

    const save = await cartItem.save();

    const updateCartUser = await User.updateOne(
      { _id: userId },
      { $addToSet: { shopping_cart: productId } }
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: save,
      CartDataToUserData: updateCartUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetCartProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const cartProduct = await AddToCart.find({ userId });

    res.status(200).json({
      success: true,
      message: "Cart products retrieved successfully",
      data: cartProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const IncreaseCartQty = async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    const product = await Product.findById(productId);
    if (!product || qty > product.pro_stoke) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.pro_stoke} item(s) in stock. Please enter a quantity less than or equal to that.`,
      });
    }

    const cartItem = await AddToCart.findOne({ userId, productId });
    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    const newSubTotal = qty * product.pro_price;

    const updateCartProduct = await AddToCart.updateOne(
      { productId, userId },
      { $set: { quantity: qty, subTotal: parseInt(newSubTotal) } }
    );

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      data: updateCartProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const DecreaseCartQty = async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity cannot be less than 1. Use delete API to remove item.",
      });
    }

    const cartItem = await AddToCart.findOne({ userId, productId });
    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product || qty > product.countInStoke) {
      return res.status(400).json({
        success: false,
        message: "Desired quantity exceeds available stock.",
      });
    }
    // console.log("qty", qty);
    // console.log("price", cartItem.price);

    const newSubTotal = qty * cartItem.price;

    const updateCartProduct = await AddToCart.updateOne(
      { productId, userId },
      { $set: { quantity: qty, subTotal: newSubTotal } }
    );

    res.status(200).json({
      success: true,
      message: "Quantity decreased successfully",
      data: updateCartProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const DeleteCartQty = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    const deleteCartProduct = await AddToCart.deleteOne({ userId, productId });

    const updateUser = await User.updateOne(
      { _id: userId },
      { $pull: { shopping_cart: productId } }
    );

    res.status(200).json({
      success: true,
      message: "Cart product deleted successfully",
      deletedItem: deleteCartProduct,
      userCartUpdate: updateUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const EmptyCartCon = async (req, res) => {
  try {
    const userId = req.userId; //middleware
    await AddToCart.deleteMany({ userId: userId });

    res.status(200).json({
      success: true,
      message: "Your Cart is Empty",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  AddToCartProduct,
  GetCartProduct,
  IncreaseCartQty,
  DecreaseCartQty,
  DeleteCartQty,
  EmptyCartCon
};
