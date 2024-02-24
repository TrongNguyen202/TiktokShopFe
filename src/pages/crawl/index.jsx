import { Col, Input, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";

export default function Crawl() {
  const productListStorage = JSON.parse(localStorage.getItem("productList"));
  const [productList, setProductList] = useState(productListStorage);
  const [checkedItems, setCheckedItems] = useState([]);
  console.log('checkedItems: ', checkedItems);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log('productList: ', productList);

  // useEffect(() => {
  //   const headers = {
  //     authority: "kaa.iamzic.com",
  //     accept: "application/json, text/plain, */*",
  //     "accept-language": "vi,vi-VN;q=0.9,en-US;q=0.8,en;q=0.7",
  //     "content-type": "application/json",
  //     origin: "https://kaa.iamzic.com",
  //     referer: "https://kaa.iamzic.com/",
  //     "sec-ch-ua":
  //       '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": '"Windows"',
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-origin",
  //     "user-agent":
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  //   };

  //   const params = {
  //     crawler: "Etsy",
  //   };
  //   setLoading(true);
  //   axios({
  //     method: 'post',
  //     url: 'https://kaa.iamzic.com/api/v1/crawl.json?url=https://www.etsy.com/search?q=shirt&ref=search_bar',
  //     data: params,
  //   })
  //     .then(response => {
  //       // setProductList(response.data.data);
  //       localStorage.setItem('productList', JSON.stringify(response.data.data));
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     }).finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    if (checkedItems && checkedItems.length === 0) return
    const CountSelectedItems = Object.values(checkedItems).filter(value => value === true).length
    if (CountSelectedItems === productList.length) {
      setIsAllChecked(true)
    } else setIsAllChecked(false)
  }, [checkedItems]);

  const handleDeleteProduct = (product_id) => {
    const newProductList = productList.filter((item) => item.id !== product_id);
    // localStorage.setItem('productList', JSON.stringify(newProductList));
    setProductList(newProductList);
  };

  const handleCheckChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleCheckAllChange = (event) => {
    // kiểm tra nếu 
    console.log('event.target.checked: ', event.target.checked);
    const newCheckedItems = productList.reduce((acc, cur) => {
      acc[cur.id] = event.target.checked;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };

  const CountSelectedItems = Object.values(checkedItems).filter(value => value === true).length

  const renderProductList = () => {
    return (
      <Row gutter={[16, 16]} className="flex py-5 transition-all duration-300">
        {productList.map((item, index) => {
          return (
            <Col span={4} key={item.id}>
              <ProductItem
                product={item}
                index={index}
                handleDeleteProduct={handleDeleteProduct}
                checkedItems={checkedItems}
                handleCheckChange={handleCheckChange}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <div>
      <div className="p-5 bg-[#F7F8F9]">
        <Input placeholder="Page URL" />
        <div className="flex items-center gap-4 mt-4">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={handleCheckAllChange}
              checked={isAllChecked}
              className="w-6 h-6"
            />{" "}
            <p className="font-semibold">Chọn tất cả</p>
          </div>
          <div>Đã chọn: <span className="font-semibold">{CountSelectedItems} sản phẩm</span></div>
        </div>
        {productList && productList.length ? renderProductList() : null}
      </div>
    </div>
  );
}
