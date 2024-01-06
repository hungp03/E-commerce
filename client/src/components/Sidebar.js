//useState để lưu giá trị
//useEffect để gọi api
import React, { useState, useEffect } from "react";
import { apiGetCategories } from "../apis/app";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [categories, setCategories] = useState(null);
  //useEffect không nhận async function => viết ở ngoài rồi cho vào trong useEffect
  const fetchCategories = async () => {
    const response = await apiGetCategories();
    //console.log(response);
    if (response.success);
    setCategories(response.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  // console.log(categories)

  return <div>Sidebar</div>;
};

export default Sidebar;
