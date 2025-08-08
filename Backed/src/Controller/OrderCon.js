const OrderModel = require("../Model/Order_model");
const ProductModel = require("../Model/product_model");
const UserModel = require("../Model/user_model");
const Paypal = require("@paypal/checkout-server-sdk");

// Razorpay
// id= rzp_test_zumQjIsjRQ4NtY
// key = J9lUoaww3JSyYB1O7F1pvvi8

// Paypal
// Secret : EILzazhRdzPEeLZtrGfHJybimkQjdlB4w0PNCGkknfDWIFrvtA2_CTOkEx_Jb8lNGa3l1bDk6JwH_GMT
// Client ID : ASIHv8rLpiL_QSuvIz1AK75ff0GgQWiNOIEPL2a2NVFT7YUy0Lm0X4WCOAqCFQbnlZ3zWvcwTnOtrtFb

const CreateOrder = async (req, res) => {
  try {
    let order = new OrderModel({
      userId: req.body.userId,
      products: req.body.products,
      paymentId: req.body.paymentId,
      payment_status: req.body.payment_status,
      delivery_address: req.body.delivery_address,
      totalAmount: req.body.totalAmount,
      date: req.body.date,
    });

    if (!order) {
      res.status(404).json({
        error: true,
        success: false,
        message: "data not found",
      });
    }

    for (let i = 0; i < req.body.products.length; i++) {
      const product = req.body.products[i];

      const stock = Number(product.countInStoke);
      const quantity = Number(product.quantity);

      if (isNaN(stock) || isNaN(quantity)) {
        return res.status(400).json({
          success: false,
          message: "Invalid stock or quantity value",
        });
      }
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        product.productId,
        { pro_stoke: stock - quantity },
        { new: true }
      );
    }

    order = await order.save();

    return res.status(200).json({
      success: true,
      message: "Order Placed",
      order: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetPaypalClient = () => {
  const isSandbox = process.env.PAYPAL_MODE === "sandbox";

  const environment = isSandbox
    ? new Paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new Paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
  return new Paypal.core.PayPalHttpClient(environment);
};

const CreatePayPalCon = async (req, res) => {
  try {
    const paypalRequest = new Paypal.orders.OrdersCreateRequest();

    paypalRequest.prefer("return=representation");

    paypalRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: parseFloat(req.query.totalAmount).toFixed(2),
          },
        },
      ],
    });

    try {
      const Client = GetPaypalClient();
      const order = await Client.execute(paypalRequest);
      res.json({
        success: true,
        message: order.result.status,
        id: order.result.id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// order db ma save karva mate
const CaptureOrderPayPal = async (req, res) => {
  try {
    // console.log("body", req.body);

    const { paymentId } = req.body;

    const paypalCaptureRequest = new Paypal.orders.OrdersCaptureRequest(
      paymentId
    );
    paypalCaptureRequest.requestBody({});

    const orderInfo = {
      userId: req.body.userId,
      products: req.body.products,
      paymentId: req.body.paymentId,
      payment_status: req.body.payment_status,
      delivery_address: req.body.delivery_address,
      totalAmount: req.body.totalAmount,
      date: req.body.date,
    };

    const order = new OrderModel(orderInfo);
    await order.save();

    for (let i = 0; i < req.body.products.length; i++) {
      const product = req.body.products[i];
      const stock = Number(product.countInStoke);
      const quantity = Number(product.quantity);

      await ProductModel.findByIdAndUpdate(
        product.productId,
        { pro_stoke: stock - quantity },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderListForUser = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId);

    const OrderList = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    if (!OrderList) {
      res.status(404).json({
        success: false,
        message: "You not Order Yet",
      });
    }

    res.status(200).json({
      success: true,
      message: "Your Order List",
      OrderList: OrderList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetAllOrderList = async (req, res) => {
  try {
    const OrderList = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    if (!OrderList || OrderList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "All Orders List",
      OrderList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const UpdateOrderStatus = async (req, res) => {
  try {
    const { orderId, order_status } = req.body;

    if (!orderId || !order_status) {
      return res.status(400).json({
        success: false,
        message: "orderId and order_status are required",
      });
    }

    const update = await OrderModel.updateOne(
      { _id: orderId },
      { order_status: order_status }
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      result: update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const TotalSalesCon = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const orderList = await OrderModel.find();

    let totalSales = 0;
    let monthlySales = [
      { name: "JAN", totalSales: 0 },
      { name: "FEB", totalSales: 0 },
      { name: "MAR", totalSales: 0 },
      { name: "APR", totalSales: 0 },
      { name: "MAY", totalSales: 0 },
      { name: "JUNE", totalSales: 0 },
      { name: "JULY", totalSales: 0 },
      { name: "AUG", totalSales: 0 },
      { name: "SEP", totalSales: 0 },
      { name: "OCT", totalSales: 0 },
      { name: "NOV", totalSales: 0 },
      { name: "DEC", totalSales: 0 },
    ];

    for (let order of orderList) {
      const orderDate = new Date(order.createdAt);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth(); // 0-indexed

      if (year === currentYear) {
        const amount = parseInt(order.totalAmount) || 0;
        totalSales += amount;
        monthlySales[month].totalSales += amount;
      }
    }

    return res.status(200).json({
      totalSales,
      monthlySales,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const TotalUserCon = async (req, res) => {
  try {
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyUsers = [
      { name: "JAN", TotalUsers: 0 },
      { name: "FEB", TotalUsers: 0 },
      { name: "MAR", TotalUsers: 0 },
      { name: "APR", TotalUsers: 0 },
      { name: "MAY", TotalUsers: 0 },
      { name: "JUNE", TotalUsers: 0 },
      { name: "JULY", TotalUsers: 0 },
      { name: "AUG", TotalUsers: 0 },
      { name: "SEP", TotalUsers: 0 },
      { name: "OCT", TotalUsers: 0 },
      { name: "NOV", TotalUsers: 0 },
      { name: "DEC", TotalUsers: 0 },
    ];

    for (let user of users) {
      const month = user._id.month; // 1 to 12
      monthlyUsers[month - 1] = {
        name: monthlyUsers[month - 1].name,
        TotalUsers: user.count,
      };
    }

    return res.status(200).json({
      totalUser: monthlyUsers,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  CreateOrder,
  GetOrderListForUser,
  CreatePayPalCon,
  CaptureOrderPayPal,
  GetAllOrderList,
  UpdateOrderStatus,
  TotalSalesCon,
  TotalUserCon,
};
