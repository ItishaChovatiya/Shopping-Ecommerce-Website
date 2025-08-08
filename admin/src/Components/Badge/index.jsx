import React, { useContext } from "react";
import { DeleteData } from "../../utils/Api";
import { MyContext } from "../../App";

const Badge = (props) => {
  const context = useContext(MyContext);

  const handleNotVerified = () => {
    DeleteData("/v1/user/deleteUser", { userId: props.id }).then((res) => {
      if (res.success === true) {
        context?.alertBox("success", res.message);
        context?.UsersListHandler();
      } else {
        context?.alertBox("error", res.message);
      }
    });
  };
  return (
    <span
      className={`flex items-center justify-center py-1 text-[15px] capitalize border rounded-full text-white
        ${props.status === "pending" && "bg-red-500"}
        ${props.status === "confairm" && "bg-blue-500"}
        ${props.status === "deliverd" && "bg-green-500"}
        ${props.status === "verified" && "bg-green-800"}
        ${props.status === "notVerified" && "bg-red-600"}`}
      onClick={props.status === "notVerified" ? handleNotVerified : null}
    >
      {props.status.charAt(0).toUpperCase() + props.status.slice(1)}
    </span>
  );
};

export default Badge;
