import React, { useEffect, useState } from 'react';
import { Button, Input, Tooltip, Row, Col, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import ProductItem from '../crawl/ProductItem';
import ModalUploadProduct from '../crawl/ModalUploadProduct';
import ModalShowError from '../crawl/ModalShowError';

export default function ProductList({ imageEdited }) {
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [productList, setProductList] = useState(imageEdited || []);
  const [isShowModalUpload, setShowModalUpload] = useState(false);
  const [modalErrorInfo, setModalErrorInfo] = useState({
    isShow: false,
    data: [],
    title: '',
  });

  useEffect(() => {
    setProductList(imageEdited);
  }, [imageEdited]);

  useEffect(() => {
    if (checkedItems && checkedItems.length === 0) return;
    const CountSelectedItems = Object.values(checkedItems).filter((value) => value === true).length;
    if (CountSelectedItems === productList.length) {
      setIsAllChecked(true);
    } else setIsAllChecked(false);
  }, [checkedItems]);

  const handleDeleteProduct = (product_id) => {
    const newProductList = productList.filter((item) => item.id !== product_id);
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

  const handleCheckAllChange = (event) => {
    const newCheckedItems = productList.reduce((acc, cur) => {
      acc[cur.id] = event.target.checked;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };

  const handleCheckChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const convertDataProducts = (isCreateProduct) => {
    const selectedProducts = productList.filter((product) => checkedItems[product.id]);

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
          warehouse: '',
          description: product.description || '',
          images: { ...convertImageLink(product.images) },
        };
      }
      return {
        sku: '',
        title: product.title,
        warehouse: '',
        description: product.description || '',
        ...convertImageLink(product.images),
      };
    });
  };

  const onClickUploadProduct = () => {
    if (checkedItems && Object.values(checkedItems).filter((value) => value === true).length === 0) {
      message.warning('Please choose product!');
      return;
    }
    const isHaveProductNotTitle = productList.some((product) => !product.title);
    if (isHaveProductNotTitle) {
      message.warning('Please fill title for all products!');
      return;
    }
    setShowModalUpload(true);
  };

  if (!productList) return null;
  if (productList.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mt-4 mb-2">
        <div className="flex gap-2 items-center">
          <input type="checkbox" onChange={handleCheckAllChange} checked={isAllChecked} className="w-6 h-6" />{' '}
          <p className="font-semibold">Selected all</p>
        </div>
        <div>
          Total: <span className="font-semibold">{productList ? productList.length : 0} products</span>
        </div>
        <Button className="w-fit block" type="primary" icon={<CloudUploadOutlined />} onClick={onClickUploadProduct}>
          Upload products
        </Button>
      </div>
      <Row gutter={[16, 16]} className="flex py-5 transition-all duration-300 bg-[#F7F8F9] p-3">
        {productList.length > 0 &&
          productList.map((item, index) => {
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
      {isShowModalUpload && productList.length && (
        <ModalUploadProduct
          isShowModalUpload={isShowModalUpload}
          setShowModalUpload={setShowModalUpload}
          productList={convertDataProducts(true)}
          imagesLimit={productList.images}
          modalErrorInfo={modalErrorInfo}
          setModalErrorInfo={setModalErrorInfo}
        />
      )}
      {modalErrorInfo.isShow && (
        <ModalShowError setModalErrorInfo={setModalErrorInfo} modalErrorInfo={modalErrorInfo} />
      )}
    </div>
  );
}
