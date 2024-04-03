import { Button, Form, Input, Modal, Upload, Spin, Space } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useProductsStore } from "../../store/productsStore"

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function DraggableUploadListItem({ originNode, file }) {
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

export default function ModalProductDetail({ product, setIsOpenModal, isOpenModal, imgBase64, handleChangeProduct }) {
  const {changeProductImageToWhite, loadingImage} = useProductsStore((state) => state);
  const [fileList, setFileList] = useState(product.images);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [productTitle, setProductTitle] = useState(product.title);
  const [productDescription, setProductDescription] = useState(product.description);
  const [sellerSku, setSellerSku] = useState(product.sku);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {
    const dataUpdate = newFileList.map((item) => ({
      ...item,
      url: item.url.replace('data:image/png;base64,', '')
    }));
    setFileList(dataUpdate);
    imgBase64(dataUpdate);
  };

  const handleAddImageFromComputer = ({ fileList: newFileList }) => {
    let fileListUpdate = {...fileList};
    console.log('newFileList: ', newFileList, );
    console.log('newFileList: ', newFileList, fileListUpdate);

    const newFileListFromLocal = newFileList.map((item) => {
      console.log('base64Data: ', getBase64(item.originFileObj));
      // return (
      //   getBase64(item.originFileObj, (url) => {
      //     return {
      //       id: Math.floor(Math.random() * 10),
      //       url: url
      //     }
      //   })
      // )
    })
    console.log('newFileListFromLocal: ', newFileListFromLocal);
    // let newFileListFromLocal = {...fileList};
    // newFileListFromLocal.push()
    // setFileList(newFileList);
  };

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const handleCancel = () => setPreviewOpen(false);

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const handleAddImage = () => {
    if (!imageLink) return;
    setFileList((prev) => [
      ...prev,
      {
        id: new Date().getTime(),
        url: imageLink,
      },
    ]);
    setImageLink('');
  };

  const handleWhiteBackgroundForMainImage = () => {
    let fileListUpdate = [...fileList];
    const imageUrl = {
      img_url: fileListUpdate[0].url
    }

    const onSuccess = (res) => {
      if (res) {
        console.log(res);
        const newItem = {
          url: res.output_image_base64
        }
        fileListUpdate.push(newItem)
        setFileList(fileListUpdate);
      }
    }
    const onFail = (err) => {}
    changeProductImageToWhite(imageUrl, onSuccess, onFail);
  }

  const handleOK = () => {
    const newProduct = {
      ...product,
      images: fileList,
      title: productTitle,
      description: productDescription,
      sku: sellerSku,
    };
    handleChangeProduct(newProduct);
    setIsOpenModal(false);
  };

  const ShowImageFileList = (data) => {
    return data.map((item) => ({
      ...item,
      url: item.id ? item.url : `data:image/png;base64,${item.url}`
    }))
  }

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
              {/* {fileList?.length >= 8 ? null : (
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}> Upload</div>
                </button>
              )} */}
            </Upload>
            <Space>
              <Button type='primary' className='my-5' onClick={handleWhiteBackgroundForMainImage}>
                White background for main image
                {loadingImage && <Spin indicator={<LoadingOutlined className="text-white ml-3" />} />}
              </Button>

              {/* <Upload
                fileList={fileList}
                showUploadList={false}
                onChange={handleAddImageFromComputer}
              >
                <Button type='primary' icon={<UploadOutlined />}>Add image from your computer</Button>
              </Upload> */}
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
          <Input value={productTitle} onChange={(e) => setProductTitle(e.target.value)} />
        </Form.Item>

        <Form.Item label="Seller sku:" labelCol={{ span: 24 }}>
          <Input value={sellerSku} onChange={(e) => setSellerSku(e.target.value)} placeholder="Enter seller sku here" />
        </Form.Item>

        <Form.Item label="Description" wrapperCol={{ span: 24 }}>
          <Input.TextArea
            value={productDescription}
            rows={4}
            placeholder="Description"
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </Form.Item>
        {/* <input type='file'/> */}
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    </div>
  );
}
