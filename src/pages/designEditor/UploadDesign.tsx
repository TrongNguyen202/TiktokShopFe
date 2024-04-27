import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal } from 'antd';
import React, { useState } from 'react';

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function UploadDesign({ fileList, setFileList }: { fileList: any; setFileList: any }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const onChangeFileList = async ({ fileList: newFileList }: { fileList: any }) => {
    const updatedFileList = await Promise.all(
      newFileList.map(async (file: any) => {
        if (!file.url && !file.preview) {
          file.src = await getBase64(file.originFileObj);
        }
        return file;
      }),
    );
    setFileList(updatedFileList);
  };

  const handleCancel = () => setPreviewOpen(false);

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={onChangeFileList}
        beforeUpload={() => false}
        previewFile={(file: any) => getBase64(file) as Promise<string>}
        multiple
      >
        {fileList.length > 8 ? null : (
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <div style={{ marginTop: 8 }}> Upload</div>
          </button>
        )}
      </Upload>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
