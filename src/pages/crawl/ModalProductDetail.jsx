import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Form, Input, Button } from 'antd';

import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  const [fileList, setFileList] = useState(product.images);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [productTitle, setProductTitle] = useState(product.title);
  const [productDescription, setProductDescription] = useState(product.description);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    imgBase64(newFileList);
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

  const handleOK = () => {
    const newProduct = {
      ...product,
      images: fileList,
      title: productTitle,
      description: productDescription,
    };
    handleChangeProduct(newProduct);
    setIsOpenModal(false);
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
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
              previewFile={getBase64}
              multiple
              itemRender={(originNode, file) => <DraggableUploadListItem originNode={originNode} file={file} />}
            >
              {/* {fileList?.length >= 8 ? null : (
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}> Upload</div>
                </button>
              )} */}
            </Upload>
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
