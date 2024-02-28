import { Button, Col, Input, Row, Select, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import * as XLSX from "xlsx";
import { CloudUploadOutlined, DownloadOutlined } from "@ant-design/icons";
import ModalUploadProduct from "./ModalUploadProduct";

const crawlerOptions = [
  {
    value: "Etsy",
    label: "Etsy",
  },
  {
    value: "Woo",
    label: "Woo",
  },
  {
    value: "Shopify",
    label: "Shopify",
  },
  {
    value: "Shopbase",
    label: "Shopbase",
  },
  {
    value: "Amazone",
    label: "Amazone",
  },
];

const initialCrawl = {
  url: "",
  crawler: "Etsy",
};

const initialUrl = "https://www.etsy.com/search?q=shirt&ref=search_bar";

export default function Crawl() {
  const productListStorage = JSON.parse(localStorage.getItem("productList"));

  const [productList, setProductList] = useState(productListStorage);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [optionCrawl, setOptionCrawl] = useState(initialCrawl);
  const [loading, setLoading] = useState(false);
  const [isShowModalUpload, setShowModalUpload] = useState(false);

  useEffect(() => {
    setProductList(productListStorage);
  }, [JSON.stringify(productListStorage)]);

  useEffect(() => {
    if (checkedItems && checkedItems.length === 0) return;
    const CountSelectedItems = Object.values(checkedItems).filter(
      (value) => value === true
    ).length;
    if (CountSelectedItems === productList.length) {
      setIsAllChecked(true);
    } else setIsAllChecked(false);
  }, [checkedItems]);

  const handleDeleteProduct = (product_id) => {
    const newProductList = productList.filter((item) => item.id !== product_id);
    // localStorage.setItem('productList', JSON.stringify(newProductList));
    setProductList(newProductList);
  };

  const handleChangeProduct = (newProduct) => {
    const newProductList = productList.map((item) => {
      if (item.id === newProduct.id) {
        return newProduct;
      }
      return item;
    });
    setProductList(newProductList);
  };

  const handleCheckChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleCheckAllChange = (event) => {
    const newCheckedItems = productList.reduce((acc, cur) => {
      acc[cur.id] = event.target.checked;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };

  const CountSelectedItems = Object.values(checkedItems).filter(
    (value) => value === true
  ).length;

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
                handleChangeProduct={handleChangeProduct}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  const onChangeCrawler = (value) => {
    setOptionCrawl({
      ...optionCrawl,
      crawler: value,
    });
  };

  const onChangeUrl = (e) => {
    setOptionCrawl({
      ...optionCrawl,
      url: e.target.value,
    });
  };

  const fetchDataProductList = async (url, crawler) => {
    const params = {
      crawler: crawler,
    };
    setLoading(true);
    axios({
      method: "post",
      url: `https://kaa.iamzic.com/api/v1/crawl.json?crawlURL=${url}`,
      data: params,
    })
      .then((response) => {
        // setProductList(response.data.data);
        localStorage.setItem("productList", JSON.stringify(response.data.data));
        setCheckedItems([]);
        setIsAllChecked(false);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCrawl = () => {
    if (!optionCrawl.url) return;
    fetchDataProductList(optionCrawl.url, optionCrawl.crawler);
  };

  const convertDataProducts = (isCreateProduct) => {
    const selectedProducts = productList.filter(
      (product) => checkedItems[product.id]
    );

    const convertImageLink = (images) => {
      const imageObject = images.reduce((obj, link, index) => {
        const key = `image${index + 1}`;
        obj[key] = link.url;
        return obj;
      }, {});
      return imageObject;
    };

    return selectedProducts.map((product) => {
      if (isCreateProduct) {
        return {
          sku: product.sku,
          title: product.title,
          warehouse: "",
          images: { ...convertImageLink(product.images) }
        };
      }
      return {
        sku: "",
        title: product.title,
        warehouse: "",
        ...convertImageLink(product.images),
      };
    });
  };

  const handleExportExcel = () => {
    const data = convertDataProducts();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "productList.xlsx");
    setCheckedItems([]);
    setIsAllChecked(false);
  };

  return (
    <div>
      <div className="p-5 bg-[#F7F8F9]">
        <div className="flex gap-2">
          <Input
            value={optionCrawl.url}
            placeholder="Page URL"
            onChange={onChangeUrl}
          />
          <Select
            defaultValue="Etsy"
            style={{
              width: 220,
            }}
            onChange={onChangeCrawler}
            options={crawlerOptions}
          />
          <Button type="primary" onClick={handleCrawl} loading={loading}>
            Crawl
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={handleCheckAllChange}
              checked={isAllChecked}
              className="w-6 h-6"
            />{" "}
            <p className="font-semibold">Selected all</p>
          </div>
          {/* <div>Đã chọn: <span className="font-semibold">{CountSelectedItems} sản phẩm</span></div> */}
          <div>
            Total:{" "}
            <span className="font-semibold">
              {productList ? productList.length : 0} products
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center mt-5">
          <Button
            type="primary"
            disabled={CountSelectedItems === 0}
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
          >
            Export excel
          </Button>
          <Button
            type="primary"
            disabled={CountSelectedItems === 0}
            icon={<CloudUploadOutlined />}
            onClick={() => setShowModalUpload(true)}
          >
            Upload products
          </Button>
          <div>
            <span className="font-semibold">{CountSelectedItems} products</span>
          </div>
        </div>
        {productList && productList?.length ? renderProductList() : null}
      </div>
      {isShowModalUpload && (
        <ModalUploadProduct
          isShowModalUpload={isShowModalUpload}
          setShowModalUpload={setShowModalUpload}
          productList={convertDataProducts(true)}
        />
      )}
    </div>
  );
}
