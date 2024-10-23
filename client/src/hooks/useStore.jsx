import { useEffect, useState } from "react";
import PriceFormat from "../Helper/PriceFormat";

const useStore = () => {
  //==============================================================
  //========== all products ==================
  const [products, setProducts] = useState([]);

  // let getProducts = async () => {
  //   let res = await fetch("http://localhost:8000/products/product-list", {
  //     method: "GET",
  //   });

  //   setProducts(await res.json());
  // };

  // useEffect(() => {
  //   getProducts();
  // }, []);

  //============== all category====================================
  const [category, setCategory] = useState([]);

  let getCategory = async () => {
    let res = await fetch(`${import.meta.env.VITE_BASE_URL}/category/category-list`, {
      method: "GET",
    });
    setCategory(await res.json());
  };

  useEffect(() => {
    getCategory();
  }, []);

  let curr='BDT', rate=100

  let priceCategory = [
    {
      _id: 1,
      name: `${curr}(${0 * rate}-${100 * rate})`,
      // name: '$0 - 20',
      array: [0, 10000],
    },
    {
      _id: 2,
      name: `${curr}(${100 * rate}-${200 * rate})`,
      array: [10000, 20000],
    },
    {
      _id: 3,
      name: `${curr}(${200 * rate}-${300 * rate})`,
      array: [20000, 30000],
    },
    {
      _id: 4,
      name: `${curr}(${300 * rate}-${400 * rate})`,
      array: [30000, 40000],
    },
    {
      _id: 5,
      name: `${curr}(${400 * rate}-Above)`,
      array: [40000, 100000000],
    },
  ];

 
  return {
    products,
    category,
    priceCategory,
  };
};

export default useStore;
