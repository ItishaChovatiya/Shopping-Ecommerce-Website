const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const morgan = require("morgan");
const router = require("./Route");
const ConnectDB = require("./Config/DBconnection");

const app = express();

app.use(cors());        

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

dotenv.config();  

app.use(cookieParser()); 
app.use(morgan("tiny"));  

app.use(
  helmet({    
    crossOriginResourcePolicy: false,  
  })
);

app.use("/v1", router);

ConnectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});




