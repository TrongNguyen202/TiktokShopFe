import { useEffect } from 'react';
import { Col, Image, Row, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '../../store/productsStore';
import { IntlNumberFormat, getPathByIndex } from '../../utils';
import { statusProductTikTokShop } from '../../constants/index';

import PageTitle from '../../components/common/PageTitle';
import ImageDefault from '../../assets/images/image-default.jpg';
import Loading from '../../components/loading';

export default function ProductDetail() {
  const shopId = getPathByIndex(2);
  const productId = getPathByIndex(4);
  const navigate = useNavigate();
  const { productById, getProductsById, loading } = useProductsStore((state) => state);

  useEffect(() => {
    getProductsById(shopId, productId);
  }, []);

  const {
    product_name,
    images,
    skus,
    product_id,
    seo_description,
    seo_title,
    video_url,
    description,
    category_list,
    product_status,
  } = productById;

  const columnsProductAttribute = [
    {
      title: 'Color',
      dataIndex: ['variations', 'Color'],
      key: 'Color',
      align: 'center',
      render: (_, record) =>
        record.sales_attributes.map((item) => (
          <span key={item.value_id}>{item.name === 'Color' && item.value_name}</span>
        )),
    },
    {
      title: 'Size',
      dataIndex: ['variations', 'Size'],
      key: 'Size',
      align: 'center',
      render: (_, record) =>
        record.sales_attributes.map((item) => (
          <span key={item.value_id}>{item.name === 'Size' && item.value_name}</span>
        )),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (text) => <span>{IntlNumberFormat(text.currency, 'currency', 3, text.original_price)}</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'stock_infos',
      key: 'stock_infos',
      align: 'center',
      render: (text) => (
        <span>{text[0].available_stock > 0 ? text[0].available_stock : <Tag color="red">Hết hàng</Tag>}</span>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'seller_sku',
      key: 'seller_sku',
      align: 'center',
    },
  ];

  const renderLeftColumn = () => {
    return (
      <>
        <Row className="gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={4} className="font-medium">
            Tên sản phẩm:
          </Col>
          <Col className="text-[#0e2482] font-medium">{product_name}</Col>
        </Row>

        <Row className="gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={4} className="font-medium">
            Trạng thái:
          </Col>
          <Col className="text-[#0e2482] font-medium">
            {statusProductTikTokShop.map((item, index) => (
              <>
                {product_status === index && (
                  <Tag key={index} color={item.color}>
                    {item.title}
                  </Tag>
                )}
              </>
            ))}
          </Col>
        </Row>

        <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={4} className="font-medium">
            Mã sản phẩm:
          </Col>
          <Col className="text-[#0e2482] font-medium">{product_id}</Col>
        </Row>

        {skus?.length === 1 && (
          <>
            <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
              <Col span={4} className="font-medium">
                Giá:
              </Col>
              <Col className="text-[#0e2482] font-medium">
                {IntlNumberFormat(skus[0].price.currency, 'currency', 3, skus[0].price.original_price)}
              </Col>
            </Row>

            <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
              <Col span={4} className="font-medium">
                Mã SKU:
              </Col>
              <Col className="text-[#0e2482] font-medium">{skus[0].seller_sku}</Col>
            </Row>

            <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
              <Col span={4} className="font-medium">
                Số lượng:
              </Col>
              <Col className="text-[#0e2482] font-medium">
                {skus[0].stock_infos[0].available_stock > 0 ? (
                  skus[0].stock_infos[0].available_stock
                ) : (
                  <Tag color="red">Hết hàng</Tag>
                )}
              </Col>
            </Row>
          </>
        )}

        <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={4} className="font-medium">
            Danh mục:
          </Col>
          <Col className="text-[#0e2482] font-medium">
            {category_list && (
              <ul>
                {category_list?.map((category, index) => (
                  <li key={index} className="inline-block">
                    {index !== 0 && <span>, </span>}
                    <span>{category.local_display_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </Col>
        </Row>
      </>
    );
  };

  const renderRightColumn = () => {
    return (
      <>
        <p className="text-[20px] font-semibold">Video, ảnh sản phẩm</p>
        <Col className="text-[#0e2482] font-medium mt-2">
          {video_url && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video controls width="200px" height="110px">
              <source src={video_url} type="video/mp4" />
            </video>
          )}
          {images && images.length ? (
            <div className="flex gap-4 flex-wrap">
              {images.map((item) => (
                <>
                  {item.url_list && (
                    <Image
                      width={120}
                      height={120}
                      className="object-cover border-[1px] border-solid border-[rgba(128,_128,_128,_0.42)]"
                      src={item.url_list[0] || item.url_list[1] || ImageDefault}
                    />
                  )}
                </>
              ))}
            </div>
          ) : (
            'Chưa có video và ảnh sản phẩm'
          )}
        </Col>
      </>
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="mt-[16px] description-detail-product">
      <div className="min-h-[100vh]">
        <div className="p-10">
          <PageTitle title="Thông tin sản phẩm" showBack />

          <Row className="px-[20px] pb-[20px] bg-white">
            <Col
              span={12}
              className="border-r-[1px] border-r-[#ccc] border-solid border-t-0 border-b-0 border-l-0 pr-[12px]"
            >
              {renderLeftColumn()}
            </Col>
            <Col span={12} className="pl-[38px]">
              {renderRightColumn()}
            </Col>
          </Row>
        </div>

        <div className="bg-[#F5F5F5] h-[10px]" />
        {skus?.length > 1 && (
          <div className="p-10">
            <div className="mt-3">
              <h2 className="text-[20px] font-semibold mb-4">Phân loại sản phẩm</h2>
              <Table columns={columnsProductAttribute} dataSource={skus} bordered pagination={false} />
            </div>
          </div>
        )}

        <div className="bg-[#F5F5F5] h-[10px]" />
        <div className="bg-white p-10">
          <h2 className="text-[20px] font-semibold mb-4">Nội dung chi tiết</h2>
          <div className="break-words flex-nowrap">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>

        {/* <div className='bg-[#F5F5F5] h-[10px]' />
        <div className='bg-white p-10'>
          <h2 className='text-[20px] font-semibold'>Tối ưu SEO</h2>
          <Row className='bg-white gap-[4px] justify-start mt-3 break-words flex-nowrap'>
            <Col span={4} className='font-medium'>
              Title:
            </Col>
            <Col className='font-medium'>
              <div dangerouslySetInnerHTML={{ __html: seo_title }} />
            </Col>
          </Row>
          <Row className='bg-white gap-[4px] justify-start py-5 break-words flex-nowrap'>
            <Col span={4} className='font-medium'>
              Mô tả:
            </Col>
            <Col className='font-medium'>
              <div dangerouslySetInnerHTML={{ __html: seo_description }} />
            </Col>
          </Row>
        </div> */}
      </div>
    </div>
  );
}
