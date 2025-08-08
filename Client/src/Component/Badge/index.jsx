import React from "react";

const Badge = ({ status }) => {
  //   const getStatusStyle = (status) => {
  //   if (status === "pending") return "bg-red-100 text-red-600";
  //   if (status === "confairm") return "bg-blue-100 text-blue-600";
  //   if (status === "deliverd") return "bg-green-100 text-green-600";
  //   return "bg-gray-100 text-gray-600";
  // }

  //You can also make one funcation with arrdument and into that give if else condition

  //create one object which have key pair value and then call it on className and it check value and return that string

  const statusStyles = {
    pending: "bg-red-100 text-red-600 border border-red-300",
    confairm: "bg-blue-100 text-blue-600 border border-blue-300",
    deliverd: "bg-green-100 text-green-600 border border-green-300",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm 
        font-medium capitalize transition-all duration-300 
        ${
          statusStyles[status] ||
          "bg-gray-100 text-gray-600 border border-gray-300"
        }`}
    >
      {status}
    </span>
  );
};

export default Badge;
