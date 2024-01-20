import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tag, Input, Modal, Form, DatePicker, Slider } from "antd";
import { EditOutlined, EyeOutlined } from '@ant-design/icons'

import { alerts } from '../../utils/alerts'
import { IntlNumberFormat, removeDuplicates } from '../../utils/index'
import { formatDate } from '../../utils/date'
import { getPathByIndex } from '../../utils'
import { statusProductTiktokShop } from '../../constants/index'

import { useProductsStore } from "../../store/productsStore";

import PageTitle from "../../components/common/PageTitle";

const { RangePicker } = DatePicker;
const Products = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const shopId = getPathByIndex(2)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const { products, getAllProducts } = useProductsStore((state) => state)
    
    const columnProduct = [
        {
            title: 'Mã sản phẩm',
            dataIndex: 'id',
            key: 'id',
            align: 'center'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: ['skus', 'price'],
            key: 'price',
            align: 'center',
            render: (_, record) => {
                const listPrice = record?.skus?.map((item) => item.price.original_price)
                const current = removeDuplicates(record?.skus?.map((item) => item?.price?.currency), 'currency')
                const minPrice = IntlNumberFormat(current, 'currency', 3, Math.min(...listPrice))
                const maxPrice = IntlNumberFormat(current, 'currency', 3, Math.max(...listPrice))
                return (
                    <>
                        {minPrice === maxPrice && <span>{minPrice}</span>}
                        {minPrice !== maxPrice && <span>{minPrice} - {maxPrice}</span>}
                    </>

                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (text) => (
                <>
                {statusProductTiktokShop.map((item, index) => (
                    <>
                    { text === index && <Tag key={index} color={item.color}>{item.title}</Tag>}
                    </>
                ))}
                </>
            )
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'create_time',
            key: 'create_time',
            sorter: (a, b) => a.create_time - b.create_time,
            render: (create_time) => <span>{formatDate(create_time, 'DD/MM/Y, h:mm:ss')}</span>,
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'update_time',
            key: 'update_time',
            sorter: (a, b) => a.update_time - b.update_time,
            render: (update_time) => <span>{formatDate(update_time, 'DD/MM/Y, hh:mm:ss')}</span>
        },
        {
            dataIndex: 'actions',
            key: 'actions',
            width: '100px',
            align: 'center',
            render: (_, record) => (
                <>
                  <Button type="button" onClick={() => handleProductEdit(record.id)}><EditOutlined /></Button>
                  <Button type="button" onClick={() => handleProductDetail(record.id)}><EyeOutlined /></Button>
                </>
            )
        }
    ]

  const hanldeProductCreate = () => {
    navigate(`/shops/${shopId}/products/create`);
  };

  const handleProductEdit = (productId) => {
    navigate(`/shops/${shopId}/products/${productId}/edit`);
  };

  const handleProductDetail = (productId) => {
    navigate(`/shops/${shopId}/products/${productId}`);
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };

    getAllProducts(shopId, onSuccess, onFail);
  }, [shopId]);

  return (
    <div className="p-10">
      <PageTitle title="Danh sách sản phẩm" count={products?.length} showBack />
      <div className="flex flex-wrap items-center">
        <Button type="primary" className="mr-3" onClick={() => setShowSearchModal(true)}>Tìm kiếm</Button>
        <Button
          type="primary"
          onClick={hanldeProductCreate}
          className="mt-5 mb-5 mr-3"
        >
          Thêm sản phẩm
        </Button>
        <Button
          type="primary"
          onClick={() => navigate(`/shops/${shopId}/add-many-products`)}
        >
          Thêm hàng loạt
        </Button>
      </div>
      <Table
        columns={columnProduct}
        size="middle"
        bordered
        dataSource={products && products?.length > 0 ? products : []}
      />

      <Modal title="Tìm kiếm" open={showSearchModal} footer={null} onOk={() => {}} onCancel={() => setShowSearchModal(false)}>
        <Form form={form}
          layout="vertical"
          onFinish={(value) => console.log(value)}
          onFinishFailed={() => {}}
        >
          <Form.Item label="Mã sản phẩm" name="product_id">
            <Input />
          </Form.Item>

          <Form.Item label="Tên sản phẩm" name="product_id">
            <Input />
          </Form.Item>

          <Form.Item label="Giá" name="price">
            <Slider
              className="slider-main-div"
              min={0}
              max={1000}
              onChange={() => {}}
              range={true}
              // defaultValue={[min, max]}
              // value={[min, max]}
            />
          </Form.Item>

          <Form.Item label="Thời gian tạo" name="create_time">
            <RangePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Thời gian cập nhạt" name="update_time">
            <RangePicker className="w-full" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Tìm kiếm</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
