import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useTemplateStore } from '../../../store/templateStore';
import FixedFrame from './FixedFrame';
import URLImage from './URLImage';

type FixedFrameInfo = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  src: string;
};

let history: FixedFrameInfo[] = [];
let historyStep = 0;

export default function ModalTemplateForm({
  isShowModal,
  setShowModal,
}: {
  isShowModal: boolean;
  setShowModal: (value: boolean) => void;
}) {
  const { createDesignTemplate, getAllDesignTemplate } = useTemplateStore();
  const stageRef: React.MutableRefObject<any> = React.useRef(null);
  const [templateName, setTemplateName] = useState('');
  const [images, setImages] = useState<FixedFrameInfo[]>([]);
  const [selectedId, selectShape] = useState<string>('');
  const [fixedFrameInfo, setFixedFrameInfo] = useState({ x: 20, y: 20, width: 100, height: 100, rotation: 0 });

  useEffect(() => {
    history = [...images];
    historyStep = 0;
  }, []);

  const onSubmit = async () => {
    if (!templateName) {
      return;
    }
    if (images.length === 0) {
      message.warning('Please upload base image!');
      return;
    }

    const container = document.createElement('div');
    container.id = 'konva-container';
    document.body.appendChild(container);
    const newStage = new window.Konva.Stage({
      container: 'konva-container',
      width: 510,
      height: 510,
    });
    const newLayer = new window.Konva.Layer();
    newStage.add(newLayer);

    const baseImage = new window.Image();
    baseImage.src = images[0].src;
    baseImage.width = stageRef?.current.width();
    baseImage.height = stageRef?.current.height();

    const loadBaseImage = new Promise((resolve) => {
      baseImage.onload = () => {
        const newBaseImage = new window.Konva.Image({
          x: images[0].x,
          y: images[0].y,
          image: baseImage,
          width: images[0].width,
          height: images[0].height,
        });
        newLayer.add(newBaseImage);
        resolve(null);
      };
    });

    await Promise.all([loadBaseImage]);

    const params = {
      content: {
        name: templateName,
        src: newStage.toDataURL(),
        x: fixedFrameInfo.x,
        y: fixedFrameInfo.y,
        width: fixedFrameInfo.width,
        height: fixedFrameInfo.height,
        rotation: fixedFrameInfo.rotation,
      },
    };
    console.log('params: ', params);
    const onSuccess = () => {
      setShowModal(false);
      getAllDesignTemplate();
      message.success('Create template success!');
    };
    const onFail = (err: string) => {
      message.error(err);
    };
    createDesignTemplate(params, onSuccess, onFail);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleImageChange = (i: number, newImages: FixedFrameInfo) => {
    const imgs = images.slice();
    imgs[i] = newImages;
    history = history.slice(0, historyStep + 1);
    history = history.concat([...imgs]);
    historyStep += 1;
    setImages(imgs);
  };

  // eslint-disable-next-line consistent-return
  const checkDeselect = (e: any, value: any) => {
    if (!value) {
      selectShape(null);
      return null;
    }
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleAddImageBase = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e?.target?.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const newWidth = 510;
          const scaleFactor = newWidth / img.width;
          const newHeight = img.height * scaleFactor;
          const newImage = {
            id: images.length,
            src: img.src,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            width: newWidth,
            height: newHeight,
          };
          setImages([newImage]);
        };
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <Modal
      open={isShowModal}
      title="Create Template"
      okText="Create"
      // onOk={onSubmit}
      // loading={loading}
      footer={null}
      onCancel={handleCancel}
      width={565}
    >
      <Form
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        // onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Template name"
          name="name"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: 'Please enter template name!',
            },
          ]}
        >
          <Input placeholder="Enter template name" type="text" onChange={(e) => setTemplateName(e.target.value)} />
        </Form.Item>

        <Button
          onClick={handleAddImageBase}
          icon={<CloudUploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          className="w-[50%] mb-6"
          ghost
          type="primary"
        >
          Upload base image
        </Button>

        <div className="relative shrink-0 flex-1 h-[510px] w-[510px]">
          <div className="flex gap-1 flex-wrap justify-end absolute top-[-36px] w-[510px]">
            {/* <Tooltip title="Undo">
              <Button onClick={handleUndo} disabled={historyStep === 0} icon={<UndoIcon />} />
            </Tooltip>
            <Tooltip title="Redo">
              <Button onClick={handleRedo} disabled={historyStep === history.length - 1} icon={<RedoIcon />} />
            </Tooltip>
            <Tooltip title="Delete">
              <Button onClick={() => handleDeleteImage(selectedId)} icon={<DeleteOutlined />} disabled={!selectedId} />
            </Tooltip> */}
          </div>
          <div className="">
            <Stage
              width={510}
              height={510}
              ref={stageRef}
              className="border-[1px] w-[513px] border-solid border-gray-200 hover:border-gray-500  inset-0"
            >
              <Layer>
                {images.map((image: any, i) => (
                  <URLImage
                    key={i}
                    imageProps={image}
                    image={image}
                    isSelected={image.id === selectedId}
                    onSelect={(value: any) => selectShape(value)}
                    onChange={(newAttrs: any) => handleImageChange(i, newAttrs)}
                    checkDeselect={checkDeselect}
                  />
                ))}
              </Layer>
              <FixedFrame
                selectedId={selectedId}
                selectShape={selectShape}
                fixedFrameInfo={fixedFrameInfo}
                setFixedFrameInfo={setFixedFrameInfo}
              />
            </Stage>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-3">
          <Button type="primary" ghost onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={onSubmit} htmlType="submit">
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
