const AddressModel = require("../Model/address_model");
const User = require("../Model/user_model");

const AddAddressCon = async (req, res) => {
  try {
    const { address_line, city, state, pincode,landMark, country, address_Type } = req.body;
    const user_ID = req.params.id;

    const data = new AddressModel({
      user_ID,
      address_line,
      city,
      state,
      pincode,
      country,
      landMark,
      address_Type,
    });
    const savedData = await data.save();

    const updateUser = await User.updateOne(
      { _id: user_ID },
      {
        $addToSet: { address_detail: savedData._id },
      }
    );
    res.status(200).json({
      message: "Data add successfully",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAddressCon = async (req, res) => {
  try {
    const user_ID = req.params.id;

    const user = await User.findById(user_ID).populate("address_detail");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address data fetched successfully",
      data: user.address_detail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const SingleAddressCon = async (req, res) => {
  try {
    const user_ID = req.userId;
    const addressId = req.params.id;

    const user = await AddressModel.findOne({ _id: addressId, user_ID });
    // console.log("address", addressId);
    // console.log("user", user_ID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User or address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address data fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const UpdateAddressCon = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.userId;
    const updatedData = req.body;
    // console.log(updatedData);
    

    const updated = await AddressModel.findOneAndUpdate(
      { _id: addressId, user_ID: userId },
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found or unauthorized" });
    }

    res.json({
      success: true,
      message: "Your Address is updated succesfully",
      address: updated,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const DeleteAddressCon = async (req, res) => {
  try {
    const id = req.params.id; // address _id
    const { user_ID } = req.body;

    const deleteAdd = await AddressModel.deleteOne({ _id: id, user_ID });

    if (deleteAdd.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await User.updateOne({ _id: user_ID }, { $pull: { address_detail: id } });

    const addresses = await AddressModel.find({ user_ID });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      address: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  AddAddressCon,
  GetAddressCon,
  SingleAddressCon,
  UpdateAddressCon,
  DeleteAddressCon,
};
