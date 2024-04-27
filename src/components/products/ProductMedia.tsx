import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Form } from 'antd';

import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ProductSectionTitle from './ProuctSectionTitle';
import { removeDuplicates } from '../../utils';

interface ProductMediaProps {
  productData: any;
  imgBase64: any;
  isProductCreate?: boolean;
  setFileList: any;
  fileList: any;
  sizeChart: any;
  setSizeChart: any;
}

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

function ProductMedia({
  productData,
  imgBase64,
  isProductCreate,
  setFileList,
  fileList,
  sizeChart,
  setSizeChart,
}: ProductMediaProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  // const [fileList, setFileList] = useState([]);
  const mediaData = productData?.images?.map((item) =>
    item?.url_list?.map((image) => ({
      uid: item.id,
      name: productData?.product_name,
      status: 'done',
      url: image,
    })),
  );
  const mediaConcat = mediaData && [].concat(...mediaData);
  const mediaUpload = mediaConcat && removeDuplicates(mediaConcat, 'uid');

  useEffect(() => {
    if (!isProductCreate) {
      setFileList(mediaUpload || []);
      setSizeChart(
        productData?.size_chart
          ? [
              {
                uid: productData?.size_chart?.id,
                status: 'done',
                url: productData?.size_chart?.url_list[0],
              },
            ]
          : [],
      );
    }
    // imgBase64(productData?.images)
  }, [productData]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    imgBase64(newFileList);
  };

  const onChangeSizeChart = ({ fileList: newFileList }: any) => {
    console.log('newFileList: ', newFileList);
    setSizeChart(newFileList);
  };

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  return (
    <>
      <ProductSectionTitle title="Ảnh và video" />
      <Form.Item name="images">
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
              // eslint-disable-next-line react/no-unstable-nested-components
              itemRender={(originNode, file) => <DraggableUploadListItem originNode={originNode} file={file} />}
            >
              {fileList?.length >= 8 ? null : (
                <button style={{ border: 0, background: 'none' }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}> Upload</div>
                </button>
              )}
            </Upload>
          </SortableContext>
        </DndContext>
        {/* <input type='file'/> */}
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Form.Item>

      <ProductSectionTitle title="Ảnh size chart" />
      <Form.Item name="sizeChart">
        <Upload
          listType="picture-card"
          fileList={sizeChart}
          onPreview={handlePreview}
          onChange={onChangeSizeChart}
          beforeUpload={() => false}
          previewFile={getBase64}
          // multiple
          // itemRender={(originNode, file) => (
          //   <DraggableUploadListItem originNode={originNode} file={file} />
          // )}
        >
          {sizeChart.length ? null : (
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}> Upload</div>
            </button>
          )}
        </Upload>
        {/* <input type='file'/> */}
        {/* <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt={previewTitle}
            style={{ width: "100%" }}
            src={previewImage}
          />
        </Modal> */}
      </Form.Item>
    </>
  );
}
export default ProductMedia;
