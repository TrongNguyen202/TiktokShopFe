import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Tag, Input, Modal, Form, Tooltip, Space } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

import { IntlNumberFormat, removeDuplicates, getPathByIndex } from '../../utils/index';
import { formatDate } from '../../utils/date';
import { statusProductTikTokShop } from '../../constants/index';

import { useProductsStore } from '../../store/productsStore';

import PageTitle from '../../components/common/PageTitle';
import { useCategoriesStore } from '../../store/categoriesStore';

function Products() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const shopId = getPathByIndex(2);
  const [filterData, setFilterData] = useState([]);
  const [productDataTable, setProductDataTable] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { products, getAllProducts, loading, resetProductById, infoTable } = useProductsStore((state) => state);

  const { resetCategoryData } = useCategoriesStore();
  const [page_number, setPage_number] = useState(1);

  const columnProduct = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: ['skus', 'price'],
      key: 'price',
      align: 'center',
      render: (_, record) => {
        const listPrice = record?.skus?.map((item) => item?.price?.original_price || 0);
        const current = removeDuplicates(
          record?.skus?.map((item) => item?.price?.currency || 'USD'),
          'currency',
        );
        const minPrice = IntlNumberFormat(current, 'currency', 6, Math.min(...listPrice));
        const maxPrice = IntlNumberFormat(current, 'currency', 6, Math.max(...listPrice));
        return (
          <>
            {minPrice === maxPrice && <span>{minPrice}</span>}
            {minPrice !== maxPrice && (
              <span>
                {minPrice} - {maxPrice}
              </span>
            )}
          </>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (
        <>
          {statusProductTikTokShop.map(
            (item, index) =>
              status === index && (
                <Tag key={index} color={item.color}>
                  {item.title}
                </Tag>
              ),
          )}
        </>
      ),
      filters: statusProductTikTokShop.map((item, index) => ({
        text: item.title,
        value: index,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'create_time',
      key: 'create_time',
      sorter: (a, b) => a.create_time - b.create_time,
      render: (create_time) => <span>{formatDate(create_time * 1000, 'DD/MM/Y, h:mm:ss')}</span>,
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'update_time',
      key: 'update_time',
      sorter: (a, b) => a.update_time - b.update_time,
      render: (update_time) => <span>{formatDate(update_time * 1000, 'DD/MM/Y, hh:mm:ss')}</span>,
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      width: '100px',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa" color="blue" placement="left">
            <Button size="middle" icon={<EditOutlined />} onClick={() => handleProductEdit(record.id)} />
          </Tooltip>
          <Tooltip title="Xem" color="blue" placement="right">
            <Button size="middle" icon={<EyeOutlined />} onClick={() => handleProductDetail(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleProductCreate = () => {
    navigate(`/shops/${shopId}/products/create`);
    resetProductById();
    resetCategoryData();
  };

  const handleProductEdit = (productId) => {
    navigate(`/shops/${shopId}/products/${productId}/edit`);
  };

  const handleProductDetail = (productId) => {
    navigate(`/shops/${shopId}/products/${productId}`);
  };

  const onFinish = (values) => {
    setFilterData(values);
    const productFilter = products?.filter((item) => {
      return (
        (!values.product_id || item.id.includes(values.product_id)) &&
        (!values.product_name || item.name.includes(values.product_name))
      );
    });
    setProductDataTable(productFilter);
    setShowSearchModal(false);
    form.resetFields();
  };

  const handleRemoveFilter = () => {
    setProductDataTable(products);
    setFilterData([]);
  };

  useEffect(() => {
    const onSuccess = (res) => {
      if (res.products.length > 0) {
        setProductDataTable([...productDataTable, ...res.products]);
      }
    };
    const onFail = (err) => {
      console.log(err);
    };

    getAllProducts(shopId, page_number, onSuccess, onFail);
  }, [shopId, page_number]);

  return (
    <div className="p-3 md:p-10">
      <PageTitle title="Danh sách sản phẩm" count={infoTable?.data?.total || '0'} showBack />
      <div className="flex flex-wrap items-center">
        <Button type="primary" className="mr-3" size="small" onClick={() => setShowSearchModal(true)}>
          Tìm kiếm
        </Button>
        {/* <Button
          type="primary"
          className="mr-3"
          size="small"
          onClick={() => setPage_number(page_number+1)}
          disabled = {productDataTable?.length == infoTable?.data?.total}
        >
          Load More Products
        </Button> */}
        <Button size="small" type="primary" onClick={handleProductCreate} className="mt-5 mb-5 mr-3">
          Thêm sản phẩm
        </Button>
        <Button size="small" type="primary" onClick={() => navigate(`/shops/${shopId}/add-many-products`)}>
          Thêm hàng loạt
        </Button>
        <div className="flex-1 text-right">
          {(filterData.product_name || filterData.product_id) && <span>Tìm kiếm theo: </span>}
          {filterData.product_name && <Tag color="blue">Tên sản phẩm: {filterData.product_name}</Tag>}
          {filterData.product_id && <Tag color="orange">Mã sản phẩm: {filterData.product_id}</Tag>}
          {(filterData.product_name || filterData.product_id) && (
            <Button type="primary" onClick={handleRemoveFilter}>
              Quay lại
            </Button>
          )}
        </div>
      </div>
      <Table
        columns={columnProduct}
        size="middle"
        bordered
        scroll={{ x: true }}
        dataSource={productDataTable?.length ? productDataTable : []}
        loading={loading}
        pagination={{ total: infoTable?.data?.total }}
      />

      <Modal
        title="Tìm kiếm"
        open={showSearchModal}
        footer={null}
        onOk={() => {}}
        onCancel={() => setShowSearchModal(false)}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={() => {}}>
          <Form.Item label="Mã sản phẩm" name="product_id">
            <Input />
          </Form.Item>

          <Form.Item label="Tên sản phẩm" name="product_name">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Products;
