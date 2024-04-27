import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Col, Row, message } from 'antd';
import React, { useEffect, useState } from 'react';
import ModalShowError from '../crawl/ModalShowError';
import ModalUploadProduct from '../crawl/ModalUploadProduct';
import ProductItem from '../crawl/ProductItem';
import { ProductItem as ProductItemType } from '../../types/productItem';

export default function ProductList({ imageEdited }: { imageEdited: ProductItemType[] }) {
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [productList, setProductList] = useState<ProductItemType[]>(imageEdited || []);
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

  const handleDeleteProduct = (productId: string) => {
    const newProductList = productList.filter((item) => item.id !== productId);
    setProductList(newProductList);
  };

  const handleChangeProduct = (newProduct: ProductItemType) => {
    const newProductList = productList.map((item) => {
      if (item.id === newProduct.id) {
        return newProduct;
      }
      return item;
    });
    setProductList(newProductList);
  };

  const handleCheckAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedItems = productList.reduce((acc: any, cur) => {
      acc[cur.id] = event.target.checked;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const convertDataProducts = (isCreateProduct: boolean) => {
    const selectedProducts = productList.filter((product) => checkedItems[Number(product.id)]);

    const convertImageLink = (images: any) => {
      const imageObject = images.reduce((obj: any, link: any, index: number) => {
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
        <Button
          className="w-fit block"
          type="primary"
          icon={<CloudUploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          onClick={onClickUploadProduct}
        >
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
          imagesLimit={9}
          setModalErrorInfo={setModalErrorInfo}
        />
      )}
      {modalErrorInfo.isShow && (
        <ModalShowError setModalErrorInfo={setModalErrorInfo} modalErrorInfo={modalErrorInfo} />
      )}
    </div>
  );
}
