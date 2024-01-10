import { useState, useEffect } from 'react';
import { Form, Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import ProductSectionTitle from "./ProuctSectionTitle";

const PrductCreateMedia = ({productData}) => {
    const [fileList, setFileList] = useState([])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    
    const mediaUpload = productData?.images?.map((item) => (
        item?.url_list?.map((image) => ({
            uid: item.id,
            name: productData.product_name,
            status: 'done',
            url: image
        }))
    ))
    useEffect(() => {
        setFileList(mediaUpload&&[].concat(...mediaUpload))
    }, [productData.product_id])

    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
    };

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList)
    };

    return (
        <>
            <ProductSectionTitle title='Ảnh và video' />
            <Form.Item name="images" getValueFromEvent={normFile}>
                <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    <button
                        style={{
                            border: 0,
                            background: 'none',
                        }}
                        type="button"
                        >
                        <PlusOutlined />
                        <div
                            style={{
                            marginTop: 8,
                            }}
                        >
                            Upload
                        </div>
                    </button>
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                    />
                </Modal>
            </Form.Item>
        </>
    );
}
 
export default PrductCreateMedia;