const MyList = require('../Model/MyList_Model')


const AddToMyList = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, productName, image, price, rating, discount, brand, oldPrice } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }
        const alreadyExists = await MyList.findOne({ userId, productId });
        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Product is already in your list"
            });
        }
        const newEntry = new MyList({
            userId,
            productId,
            productName,
            image,
            price,
            rating,
            discount,
            brand,
            oldPrice
        });
        await newEntry.save();
        res.status(200).json({
            success: true,
            message: "Product added to your list successfully",
            data: newEntry
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred",
            error: error.message
        });
    }
};


const GetMyList = async (req, res) => {
    try {
        const userId = req.userId;

        const data = await MyList.find({ userId })

        res.status(200).json({
            success: true,
            message: "Fetched user's MyList successfully",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred",
            error: error.message
        });
    }
};


const DeleteProductFromMyList = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const userId = req.userId;

        const remove = await MyList.findOneAndDelete({ productId, userId });

        if (!remove) {
            return res.status(404).json({
                success: false,
                message: "Product not found in your list"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product removed from your list successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred",
            error: error.message
        });
    }
};



module.exports = { GetMyList, AddToMyList, DeleteProductFromMyList };
