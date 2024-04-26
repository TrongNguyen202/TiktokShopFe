/* eslint-disable prettier/prettier */
import { CloudUploadOutlined, CopyOutlined, DownloadOutlined, ImportOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Switch, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { senPrintsData } from '../../constants';
import { ProductImageItem, ProductItem as ProductItemData } from '../../types/productItem';
import ModalShowError from './ModalShowError';
import ModalUploadProduct from './ModalUploadProduct';
import ProductItem from './ProductItem';

const crawlerOptions = [
  {
    value: 'Etsy',
    label: 'Etsy',
  },
  {
    value: 'Woo',
    label: 'Woo',
  },
  {
    value: 'Shopify',
    label: 'Shopify',
  },
  {
    value: 'Shopbase',
    label: 'Shopbase',
  },
  // {
  //   value: 'Amazone',
  //   label: 'Amazone',
  // },
];

const imageLimitOptions = [
  {
    value: 9,
    label: 'Limit 9 images',
  },
  {
    value: 8,
    label: 'Limit 8 images',
  },
  {
    value: 7,
    label: 'Limit 7 images',
  },
  {
    value: 6,
    label: 'Limit 6 images',
  },
  {
    value: 5,
    label: 'Limit 5 images',
  },
  {
    value: 4,
    label: 'Limit 4 images',
  },
  {
    value: 3,
    label: 'Limit 3 images',
  },
  {
    value: 2,
    label: 'Limit 2 images',
  },
  {
    value: 1,
    label: 'Limit 1 images',
  },
];

const initialCrawl = {
  url: '',
  crawler: 'Etsy',
  imagesLimit: 9,
};

type ProductItemCrawled = {
  id: string;
  listing_id: string;
  siteProductId: string;
  description: string;
  title: string;
  images: ProductImageItem[];
  sku: any[];
  warehouse: string;
};

export default function Crawl() {
  const productListStorage = JSON.parse(localStorage.getItem('productList') || '');
  const userInfo = JSON.parse(localStorage.getItem('user') || '');
  const [productList, setProductList] = useState(productListStorage);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [optionCrawl, setOptionCrawl] = useState(initialCrawl);
  const [loading, setLoading] = useState(false);
  const [isShowModalUpload, setShowModalUpload] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showOutsideImages, setShowOutsideImages] = useState(false);
  const [licenseCode, setLicenseCode] = useState({
    code: localStorage.getItem('licenseCode') || '',
    invalid: !localStorage.getItem('licenseCode'),
  });
  const [modalErrorInfo, setModalErrorInfo] = useState({
    isShow: false,
    data: [],
    title: '',
  });

  useEffect(() => {
    localStorage.setItem('productList', JSON.stringify(productList));
  }, [productList]);

  useEffect(() => {
    if (checkedItems && checkedItems.length === 0) return;
    const CountSelectedItems = Object.values(checkedItems).filter((value) => value === true).length;
    if (CountSelectedItems === productList.length) {
      setIsAllChecked(true);
    } else setIsAllChecked(false);
  }, [checkedItems]);

  const handleDeleteProduct = (productId: string) => {
    const newProductList = productList.filter((item: ProductItemData) => item.id !== productId);
    setProductList(newProductList);
  };

  const handleChangeProduct = (newProduct: ProductItemData) => {
    const newProductList = productList.map((item: ProductItemData) => {
      if (item.id === newProduct.id) {
        return newProduct;
      }
      return item;
    });
    setProductList(newProductList);
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleCheckAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedItems = productList.reduce((acc: any, cur: any) => {
      acc[cur.id] = event.target.checked;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };

  const CountSelectedItems = Object.values(checkedItems).filter((value) => value === true).length;

  const renderProductList = () => {
    return (
      <Row gutter={[16, 16]} className="flex py-5 transition-all duration-300">
        {productList.map((item: ProductItemData, index: number) => {
          return (
            <Col span={4} key={item.id}>
              <ProductItem
                product={item}
                index={index}
                handleDeleteProduct={handleDeleteProduct}
                checkedItems={checkedItems}
                handleCheckChange={handleCheckChange}
                handleChangeProduct={handleChangeProduct}
                showSkeleton={showSkeleton}
                showOutsideImages={showOutsideImages}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  const onChangeOptionCrawl = (key: string, value: string) => {
    setOptionCrawl({
      ...optionCrawl,
      [key]: value,
    });
  };

  const fetchInfoProducts = async (ids: string, productData: ProductItemData[]) => {
    setLoading(true);
    const headers = {
      accept: 'application/json',
      authority: 'vk1ng.com',
      'accept-language': 'vi,vi-VN;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/json',
      authorization: `Bearer ${licenseCode.code}`,
      referer: 'https://www.etsy.com/',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'sec-ch-ua-platform': 'Windows',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    };
    fetch(`https://vk1ng.com/api/bulk/listings/${ids}`, {
      method: 'GET',
      headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message === 'Unauthenticated.') {
          message.error('Please enter the correct lincense code!');
          setLicenseCode({ code: '', invalid: true });
          return;
        }
        const combineProducts = productData.map((item) => {
          const product = data.data.find((product: ProductItemCrawled) => item.siteProductId === String(product.listing_id));
          return {
            ...item,
            ...product,
          };
        });
        setProductList(combineProducts);
        // localStorage.setItem('productList', JSON.stringify(combineProducts));
      })
      .catch((error) => {
        message.error(error?.data?.message);
      })
      .finally(() => {
        setLoading(false);
        setShowSkeleton(false);
      });
  };

  const fetchDataProductList = async (url: string, crawler: string) => {
    setLoading(true);
    // lấy danh sách url từ textarea và split theo dòng
    const urlsList = url
      .trim()
      .split('\n')
      .filter((line) => line.trim() !== '');

    // nếu url không bắt đầu bằng http thì là id sản phẩm -> thêm đầu link etsy
    const urls = urlsList.map((url) => (url.startsWith('http') ? url : `https://www.etsy.com/listing/${url}`));
    const params = {
      crawler,
    };
    const fetchProductList = async (url: string) => {
      return axios({
        method: 'post',
        url: `https://kaa.iamzic.com/api/v1/crawl.json?crawlURL=${url}`,
        data: params,
      }).catch((error) => ({ error }));
    };

    // gọi đồng thời các request lấy dữ liệu sản phẩm
    const responses = await Promise.allSettled(urls.map((url) => fetchProductList(url)));

    // concat các sản phẩm vào chung 1 mảng
    const productData = responses
      .filter((response) => response.status === 'fulfilled' && 'data' in response.value && response.value.data)
      .reduce((acc: any, response: any) => {
        const { data } = response.value;
        return [...acc, ...data.data];
      }, []);

    // giới hạn ảnh theo imagesLimit
    productData.forEach((product) => {
      product.images = product.images.slice(0, optionCrawl.imagesLimit);
      // kiểm tra từng phần tử trong product.images, nếu url chứa 'https://i.etsystatic.com' thì giảm dung lượng link ảnh bằng 1200x1200
      // const newImages = product.images.map((image) => {
      //   if (image.url.includes('https://i.etsystatic.com')) {
      //     return {
      //       ...image,
      //       url: image.url.replace('fullxfull', '1200x1200'),
      //     };
      //   }
      //   return image;
      // });
      // product.images = newImages;
    });

    // lấy danh sách id của sản phẩm để get thông tin sản phẩm
    const ids = productData.map((item) => item.id.split('.')[0]).join(',');
    setProductList(productData);
    setCheckedItems([]);
    setIsAllChecked(false);
    setShowSkeleton(true);
    if (optionCrawl.crawler === 'Etsy') fetchInfoProducts(ids, productData);
    else {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  const handleCrawl = () => {
    if (!optionCrawl.url) return;
    fetchDataProductList(optionCrawl.url, optionCrawl.crawler);
  };

  const convertDataProducts = (isCreateProduct: boolean) => {
    const selectedProducts = productList.filter((product: ProductItemCrawled) => checkedItems[Number(product.id)]);

    const convertImageLink = (images: ProductImageItem[]) => {
      const imageObject = images.reduce((obj, link, index) => {
        const key = `image${index + 1}`;
        obj[key] = link.url;
        return obj;
      }, {});
      return imageObject;
    };

    return selectedProducts.map((product: ProductItemCrawled) => {
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

  const convertDataProductsToSenPrints = () => {
    const selectedProducts = productList.filter((product: ProductItemCrawled) => checkedItems[Number(product.id)]);

    const convertImageLink = (images: ProductImageItem[]) => {
      const imageObject = images.reduce((obj, link, index) => {
        const key = `mockup_url_${index + 1}`;
        obj[key] = link.url;
        return obj;
      }, {});
      return imageObject;
    };

    return selectedProducts.flatMap((product: ProductItemCrawled) => {
      return senPrintsData.map((item) => {
        return {
          campaign_name: `${product.title} ${userInfo?.user_code ? `- ${userInfo.user_code}` : ''}`,
          campaign_desc: item.campaign_desc,
          collection: '',
          product_sku: item.product_sku,
          colors: item.colors,
          price: item.price,
          ...convertImageLink(product.images),
        };
      });
    });
  };

  const handleExportExcel = () => {
    const data = convertDataProducts(false);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'productList.xlsx');
    setCheckedItems([]);
    setIsAllChecked(false);
  };

  const handleExportSenPrints = () => {
    const data = convertDataProductsToSenPrints();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'senprints.xlsx');
    setCheckedItems([]);
    setIsAllChecked(false);
  };

  const onSaveLicenseCode = () => {
    localStorage.setItem('licenseCode', licenseCode.code);
    setLicenseCode((prev) => ({ ...prev, invalid: false }));
  };

  const copyToClipboard = (content: any) => {
    const tempInput = document.createElement('input');
    tempInput.value = content;
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    try {
      document.execCommand('copy');
      message.success(`copied`);
    } catch (err) {
      message.error(`${err} copy!`);
    }

    document.body.removeChild(tempInput);
  };

  const handleFileUpload = (file: any) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      // chuyển đổi data từ file excel sang json
      const data = (event.target as FileReader).result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let convertJson: any[] = [];
      if (Array.isArray(jsonData) && jsonData.length) {
        convertJson = jsonData.map((item: any) => {
          const { sku, title, warehouse, description } = item;
          const handleImages = (item: any) => {
            const images = [];
            for (let i = 1; i <= 9; i++) {
              if (item[`image${i}`] || item[`images${i}`]) {
                images.push({
                  url: item[`image${i}`] || item[`images${i}`],
                  id: uuidv4(),
                });
              }
            }
            return images;
          };

          return {
            id: uuidv4(),
            sku: sku || null,
            title: title || null,
            warehouse: warehouse || null,
            description: description || null,
            images: handleImages(item),
          };
        });
      }
      setProductList(convertJson);
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  const importDataExtension = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        const data = JSON.parse(text);
        setProductList(data);
        message.success('Import data extension successfully');
      })
      .catch(() => {
        message.error('Failed to read clipboard contents');
      });
  };

  return (
    <div>
      <div className="p-5 bg-[#F7F8F9]">
        {licenseCode.invalid && (
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Enter your license code"
              onChange={(e) => setLicenseCode((prev) => ({ ...prev, code: e.target.value }))}
            />
            <Button type="primary" onClick={onSaveLicenseCode}>
              Save
            </Button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <TextArea
            value={optionCrawl.url}
            placeholder="Paste URL"
            onChange={(e) => onChangeOptionCrawl('url', e.target.value)}
            // onPressEnter={handleCrawl}
            rows={4}
          />
          <Select
            defaultValue="Limit 9 images"
            style={{
              width: 220,
            }}
            onChange={(value) => onChangeOptionCrawl('imagesLimit', value)}
            options={imageLimitOptions}
          />
          <Select
            defaultValue="Etsy"
            style={{
              width: 220,
            }}
            onChange={(value) => onChangeOptionCrawl('crawler', value)}
            options={crawlerOptions}
          />
          <Button type="primary" onClick={handleCrawl} loading={loading}>
            Crawl
          </Button>
        </div>
        <p className="mt-2">
          Maybe you need: <span className="font-semibold">https://www.etsy.com/search?q=shirt&ref=search_bar</span>
          <CopyOutlined
            className="ml-1 cursor-pointer  text-blue-600"
            onClick={() => copyToClipboard('https://www.etsy.com/search?q=shirt&ref=search_bar')} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
        </p>

        <div className="my-6 flex gap-2">
          <Upload accept=".xlsx, .xls" beforeUpload={handleFileUpload} multiple={false}>
            <Button icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>Upload File</Button>
          </Upload>
          <Button icon={<ImportOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} onClick={importDataExtension}>
            Import data extension
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex gap-2 items-center">
            <input type="checkbox" onChange={handleCheckAllChange} checked={isAllChecked} className="w-6 h-6" />{' '}
            <p className="font-semibold">Selected all</p>
          </div>
          <div>
            Total: <span className="font-semibold">{productList ? productList.length : 0} products</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center mt-5">
            <Button
              type="primary"
              disabled={CountSelectedItems === 0}
              icon={<DownloadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={handleExportSenPrints}
            >
              Export SenPrints
            </Button>
            <Button
              type="primary"
              disabled={CountSelectedItems === 0}
              icon={<DownloadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={handleExportExcel}
            >
              Export excel
            </Button>
            <Button
              type="primary"
              disabled={CountSelectedItems === 0}
              icon={<CloudUploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={() => setShowModalUpload(true)}
            >
              Upload products
            </Button>
            <div>
              <span className="font-semibold">{CountSelectedItems} products</span>
            </div>
          </div>
          <div className="font-semibold">
            Show the outside images{' '}
            <Switch defaultChecked={false} onChange={() => setShowOutsideImages(!showOutsideImages)} />
          </div>
        </div>
        {productList && productList?.length ? renderProductList() : null}
      </div>
      {isShowModalUpload && (
        <ModalUploadProduct
          isShowModalUpload={isShowModalUpload}
          setShowModalUpload={setShowModalUpload}
          productList={convertDataProducts(true)}
          imagesLimit={optionCrawl.imagesLimit}
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
