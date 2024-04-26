import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Table, Tag, Tooltip, message } from 'antd';
import type { TableColumnsType } from 'antd';

import { IntlNumberFormat, getPathByIndex, removeDuplicates } from '../../utils/index';
import { formatDate } from '../../utils/date';
import { SkuProductDetail } from '../../types/products';
import { statusProductTikTokShop } from '../../constants/index';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useProductsStore } from '../../store/productsStore';

import PageTitle from '../../components/common/PageTitle';

interface ProductItemProp {
  id: string;
  create_time: number;
  update_time: number;
  status: number;
  sale_regions: string[];
  name: string;
  skus: SkuProductDetail[];
}

interface SearchForm {
  product_id?: string;
  product_name?: string;
}

function Products() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const shopId = getPathByIndex(2);
  const [filterData, setFilterData] = useState<SearchForm>({});
  const [productSelected, setProductSelected] = useState<string[]>([]);
  const [productDataTable, setProductDataTable] = useState<ProductItemProp[]>([]);
  const [refreshProduct, setRefreshProduct] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { products, getAllProducts, loading, resetProductById, infoTable, removeProduct } = useProductsStore(
    (state) => state,
  );

  const { resetCategoryData } = useCategoriesStore();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const columnProduct: TableColumnsType<ProductItemProp> = [
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

  const rowSelection = {
    onChange: (_: any, selectedRows: ProductItemProp[]) => {
      const dataSelect: string[] = selectedRows.map((item) => item.id);
      console.log('dataSelect: ', dataSelect);

      setProductSelected(dataSelect);
    },
  };

  const handleProductCreate = () => {
    navigate(`/shops/${shopId}/products/create`);
    resetProductById();
    resetCategoryData();
  };

  const handleProductEdit = (productId: string) => {
    navigate(`/shops/${shopId}/products/${productId}/edit`);
  };

  const handleProductDetail = (productId: string) => {
    navigate(`/shops/${shopId}/products/${productId}`);
  };

  const handleRemoveProduct = () => {
    const dataSubmit = {
      product_ids: productSelected,
    };

    const onSuccess = (res: any) => {
      if (res) {
        console.log('res: ', res);

        setProductSelected([]);
        setRefreshProduct(true);
        message.open({
          type: 'success',
          content: 'Xoá sản phẩm thành công',
        });
      }
    };

    const onFail = (err: string) => {
      message.open({
        type: 'error',
        content: `Xoá sản phẩm thất bại. ${err}`,
      });
    };

    removeProduct(shopId, dataSubmit, onSuccess, onFail);
  };

  const onFinish = (values: SearchForm) => {
    setFilterData(values);
    const productFilter: any = products?.filter((item: any) => {
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
    setProductDataTable(products as any);
    setFilterData({});
  };

  const handleChangePagination = (current: number) => {
    setPageNumber(current);
  };

  useEffect(() => {
    const onSuccess = (res: any) => {
      if (res.products.length > 0) {
        setProductDataTable(res.products);
      }
    };
    const onFail = (err: string) => {
      console.log(err);
    };

    if (shopId) getAllProducts(shopId, pageNumber, onSuccess, onFail);

    return () => {
      resetProductById();
    };
  }, [shopId, pageNumber, refreshProduct]);

  return (
    <div className="p-3 md:p-10">
      <PageTitle title="Danh sách sản phẩm" count={infoTable?.data?.total || 0} showBack />
      <div className="flex flex-wrap items-center">
        <Button type="primary" className="mr-3" size="small" onClick={() => setShowSearchModal(true)}>
          Tìm kiếm
        </Button>
        <Button size="small" type="primary" onClick={handleProductCreate} className="mt-5 mb-5 mr-3">
          Thêm sản phẩm
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => navigate(`/shops/${shopId}/add-many-products`)}
          className="mr-3"
        >
          Thêm hàng loạt
        </Button>
        <Button size="small" type="primary" onClick={handleRemoveProduct} disabled={!productSelected.length}>
          Xoá sản phẩm ({productSelected.length || '0'})
        </Button>
        <div className="flex-1 justify-end items-center flex flex-wrap">
          {(filterData.product_name || filterData.product_id) && <span>Tìm kiếm theo: </span>}&nbsp;
          {filterData.product_name && (
            <Tag color="blue" className="max-w-[300px] whitespace-nowrap text-ellipsis overflow-hidden">
              Tên sản phẩm: {filterData.product_name}
            </Tag>
          )}
          {filterData.product_id && (
            <Tag color="orange" className="max-w-[300px] whitespace-nowrap text-ellipsis overflow-hidden">
              Mã sản phẩm: {filterData.product_id}
            </Tag>
          )}
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
        pagination={{
          pageSize: 100,
          total: infoTable?.data?.total,
          onChange: handleChangePagination,
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: productSelected,
          ...rowSelection,
        }}
        rowKey={(record) => record.id}
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
