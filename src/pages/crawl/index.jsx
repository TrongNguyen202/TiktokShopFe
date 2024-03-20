import { Button, Col, Input, Row, Select, Upload, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { CloudUploadOutlined, CopyOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { v4 as uuidv4 } from 'uuid';
import ModalUploadProduct from './ModalUploadProduct';
import ProductItem from './ProductItem';
import { senPrintsData } from '../../constants';

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

export default function Crawl() {
  const productListStorage = JSON.parse(localStorage.getItem('productList'));
  const userInfo = JSON.parse(localStorage.getItem('user'));

  const [productList, setProductList] = useState(productListStorage);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [optionCrawl, setOptionCrawl] = useState(initialCrawl);
  const [loading, setLoading] = useState(false);
  const [isShowModalUpload, setShowModalUpload] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [licenseCode, setLicenseCode] = useState({
    code: localStorage.getItem('licenseCode'),
    invalid: !localStorage.getItem('licenseCode'),
  });

  useEffect(() => {
    setProductList(productListStorage);
  }, [JSON.stringify(productListStorage)]);

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

  const CountSelectedItems = Object.values(checkedItems).filter((value) => value === true).length;

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
                showSkeleton={showSkeleton}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  const onChangeOptionCrawl = (key, value) => {
    setOptionCrawl({
      ...optionCrawl,
      [key]: value,
    });
  };

  const fetchInfoProducts = async (ids, productData) => {
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
          const product = data.data.find((product) => item.id.split('.')[0] === product.listing_id);
          return {
            ...item,
            ...product,
          };
        });
        setProductList(combineProducts);
        localStorage.setItem('productList', JSON.stringify(combineProducts));
      })
      .catch((error) => {
        message.error(error.data.message);
      })
      .finally(() => {
        setLoading(false);
        setShowSkeleton(false);
      });
  };

  const fetchDataProductList = async (url, crawler) => {
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
    const fetchProductList = async (url) => {
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
      .filter((response) => response.status === 'fulfilled' && response.value.data)
      .reduce((acc, response) => {
        const { data } = response.value;
        return [...acc, ...data.data];
      }, []);

    // giới hạn ảnh theo imagesLimit
    productData.forEach((product) => {
      product.images = product.images.slice(0, optionCrawl.imagesLimit);
    });
    console.log('productData: ', productData);

    // lấy danh sách id của sản phẩm để get thông tin sản phẩm
    const ids = productData.map((item) => item.id.split('.')[0]).join(',');
    localStorage.setItem('productList', JSON.stringify(productData));
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
          images: { ...convertImageLink(product.images) },
        };
      }
      return {
        sku: '',
        title: product.title,
        warehouse: '',
        ...convertImageLink(product.images),
      };
    });
  };

  const convertDataProductsToSenPrints = () => {
    const selectedProducts = productList.filter((product) => checkedItems[product.id]);

    const convertImageLink = (images) => {
      const imageObject = images.reduce((obj, link, index) => {
        const key = `mockup_url_${index + 1}`;
        obj[key] = link.url;
        return obj;
      }, {});
      return imageObject;
    };

    return selectedProducts.flatMap((product) => {
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
    const data = convertDataProducts();
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

  const copyToClipboard = (content) => {
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

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      // chuyển đổi data từ file excel sang json
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let convertJson = [];
      if (Array.isArray(jsonData) && jsonData.length) {
        convertJson = jsonData.map((item) => {
          const { sku, title, warehouse, description } = item;
          const handleImages = (item) => {
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
      localStorage.setItem('productList', JSON.stringify(convertJson));
      setProductList(convertJson);
    };

    reader.readAsArrayBuffer(file);
    return false;
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
            onClick={() => copyToClipboard('https://www.etsy.com/search?q=shirt&ref=search_bar', 'link')}
          />
        </p>

        <div className="my-6">
          <Upload accept=".xlsx, .xls" beforeUpload={handleFileUpload} multiple={false}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
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
        <div className="flex gap-2 items-center mt-5">
          <Button
            type="primary"
            disabled={CountSelectedItems === 0}
            icon={<DownloadOutlined />}
            onClick={handleExportSenPrints}
          >
            Export SenPrints
          </Button>
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
          imagesLimit={optionCrawl.imagesLimit}
        />
      )}
    </div>
  );
}
