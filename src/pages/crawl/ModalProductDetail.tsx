import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Spin, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ReactQuill from 'react-quill';
import { useProductsStore } from '../../store/productsStore';
import { ProductImageItem, ProductItem } from '../../types/productItem';

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function DraggableUploadListItem({ originNode, file }: { originNode: any; file: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'is-dragging h-[100%] w-[100%]' : ' h-[100%] w-[100%]'}
      {...attributes}
      {...listeners}
    >
      {file.status === 'error' && isDragging ? originNode.props.children : originNode}
    </div>
  );
}

type File = {
  uid: string;
  name: string;
  status: string;
  url: string;
  thumbUrl: string;
  preview: any;
  originFileObj: any;
};

export default function ModalProductDetail({
  product,
  setIsOpenModal,
  isOpenModal,
  imgBase64,
  handleChangeProduct,
}: {
  product: ProductItem;
  setIsOpenModal: (value: boolean) => void;
  isOpenModal: boolean;
  imgBase64?: any;
  handleChangeProduct: (product: ProductItem) => void;
}) {
  const { changeProductImageToWhite, loadingImage } = useProductsStore((state) => state);
  const [fileList, setFileList] = useState<ProductImageItem[]>(product.images || []);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [productTitle, setProductTitle] = useState(product.title);
  const [productDescription, setProductDescription] = useState('');
  const [sellerSku, setSellerSku] = useState(product.sku);

  useEffect(() => {
    setProductDescription(product.description);
  }, []);

  const handlePreview = async (file: File) => {
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.thumbUrl || file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }: { fileList: any }) => {
    const dataUpdate = newFileList.map((item: any) => ({
      ...item,
      url: item.id && item.url ? item.url.replace('data:image/png;base64,white_', '') : item.url,
    }));

    setFileList(dataUpdate);
    imgBase64(dataUpdate);
  };

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const handleCancel = () => setPreviewOpen(false);

  const onDragEnd = ({ active, over }: { active: any; over: any }) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((i: ProductImageItem) => i.uid === active.id);
        const overIndex = prev.findIndex((i: ProductImageItem) => i.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const handleAddImage = () => {
    if (!imageLink) return;
    setFileList((prev) => [
      ...prev,
      { id: new Date().getTime().toString(), uid: new Date().getTime().toString(), url: imageLink },
    ]);
    setImageLink('');
  };

  const handleWhiteBackgroundForMainImage = () => {
    const fileListUpdate = [...fileList];
    const imageUrl = {
      img_url: fileListUpdate[0].url,
    };

    const onSuccess = (res: any) => {
      if (res) {
        const newItem = {
          url: `white_${res.output_image_base64}`,
        };
        fileListUpdate.push(newItem);
        setFileList(fileListUpdate);
      }
    };
    const onFail = () => {};
    changeProductImageToWhite(imageUrl, onSuccess, onFail);
  };

  const handleOK = () => {
    const fileListUpdate = fileList.map((item) => {
      let urlItem = '';
      if (item.url) {
        if (item.id || item.url.includes('data:image/png;base64')) {
          urlItem = item.url;
        } else {
          urlItem = item.url.replace('data:image/png;base64,', 'white_');
        }
      } else {
        urlItem = item?.thumbUrl ? item?.thumbUrl.replace(/^data:image\/(jpeg|png|jpg);base64,/, '') : '';
      }
      return {
        ...item,
        url: urlItem,
      };
    });
    const newProduct = {
      ...product,
      images: fileListUpdate,
      title: productTitle,
      description: productDescription,
      sku: sellerSku,
    };
    handleChangeProduct(newProduct);
    setIsOpenModal(false);
  };

  const ShowImageFileList = (data: ProductImageItem[]) => {
    const itemRemoveBackground = data.find((item) => item?.url?.includes('white_'));
    if (itemRemoveBackground) {
      itemRemoveBackground.url = itemRemoveBackground.url.replace('white_', 'data:image/png;base64,');
    }
    return data;
  };

  return (
    <div>
      <Modal
        title={product.title}
        visible={isOpenModal}
        onOk={handleOK}
        okText="Save"
        cancelText="Cancel"
        onCancel={() => setIsOpenModal(false)}
        width="50vw"
      >
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
          <SortableContext items={fileList?.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
            <Upload
              listType="picture-card"
              fileList={ShowImageFileList(fileList)}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
              previewFile={getBase64}
              multiple
              // eslint-disable-next-line react/no-unstable-nested-components
              itemRender={(originNode, file) => <DraggableUploadListItem originNode={originNode} file={file} />}
            >
              {fileList?.length > 7 ? null : (
                <span>
                  <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Add image
                </span>
              )}
            </Upload>
            <Space>
              <Button type="primary" className="my-5" onClick={handleWhiteBackgroundForMainImage}>
                White background for main image
                {loadingImage && (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        className="text-white ml-3"
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                  />
                )}
              </Button>
            </Space>
          </SortableContext>
        </DndContext>
        <Form.Item label="Add image:" labelCol={{ span: 24 }}>
          <div className="flex gap-2">
            <Input
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              onPressEnter={handleAddImage}
              placeholder="Enter image link here"
            />
            <Button type="primary" ghost onClick={handleAddImage}>
              Add
            </Button>
          </div>
        </Form.Item>

        <Form.Item label="Title:" labelCol={{ span: 24 }}>
          <Input
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            placeholder="Enter product title"
          />
        </Form.Item>

        <Form.Item label="Seller sku:" labelCol={{ span: 24 }}>
          <Input value={sellerSku} onChange={(e) => setSellerSku(e.target.value)} placeholder="Enter seller sku here" />
        </Form.Item>

        <div className="block mt-3 mb-5">
          Mô tả:
          <ReactQuill theme="snow" value={productDescription} onChange={setProductDescription} />
        </div>
        {/* <input type='file'/> */}
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    </div>
  );
}
