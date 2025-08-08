const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const morgan = require("morgan");
const router = require("./Route");
const ConnectDB = require("./Config/DBconnection");

const app = express();

app.use(cors());          //Allow frontend (like React) to call backend API   Without it	Browser blocks the request as unsafe


// app.use(cors({
//   origin: 'http://localhost:5713', // only allow React app
// }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }))//By This Line Form Data Can Not Read By Express AND withOut this line req.body is undefined

dotenv.config();   //access environment variable 

app.use(cookieParser());  //Lets you read cookies from req.cookies  Without it	req.cookies will be undefined

app.use(morgan("tiny"));  //middleware that log all the details when api hit to the server like url,time,method,reqests,error,status

app.use(
  helmet({            //	Adds secure HTTP headers
    crossOriginResourcePolicy: false,  //	Allows loading resources (like images) from other domains
  })
);

app.use("/v1", router);

ConnectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});



//"Enum" (short for enumeration) is a special data type used to define a set of named constants

//DB NAME : itishabvminfotech,
//DB PASSWORD : itishabvminfotech2705
//URL : mongodb+srv://itishabvminfotech:itishabvminfotech2705@ecomerceapp.jnsdvix.mongodb.net/
