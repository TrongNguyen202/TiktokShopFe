import { Button, Input, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';

import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { RedoIcon, UndoIcon } from '../../assets/icons';
import ModalUploadProduct from '../crawl/ModalUploadProduct';
import FixedFrame from './FixedFrame';
import URLImage from './URLImage';
import UploadDesign from './UploadDesign';

let history = [];
let historyStep = 0;

function downloadURI(uri, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
  }, 0);
}

export default function DesignEditor() {
  const [selectedId, selectShape] = useState(null);
  const [images, setImages] = useState([]);
  console.log('images: ', images);
  const [imagesDesign, setImagesDesign] = useState([]);
  const [imageEdited, setImageEdited] = useState([]);
  const [fixedFrameInfo, setFixedFrameInfo] = useState({ x: 20, y: 20, width: 100, height: 100, rotation: 0 });
  const [isShowModalUpload, setShowModalUpload] = useState(false);

  const stageRef = React.useRef(null);

  useEffect(() => {
    history = [images];
    historyStep = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        handleUndo();
      }
      if (event.ctrlKey && event.key === 'y') {
        handleRedo();
      }
      if (event.key === 'Backspace') {
        handleDeleteImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);

  const checkDeselect = (e, value) => {
    if (!value) {
      selectShape(null);
      return null;
    }
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleUndo = () => {
    if (historyStep === 0) return;
    historyStep -= 1;
    const previous = history[historyStep];
    setImages(previous);
  };

  const handleRedo = () => {
    if (historyStep === history.length - 1) return;
    historyStep += 1;
    const next = history[historyStep];
    setImages(next);
  };

  const handleImageChange = (i, newImages) => {
    const imgs = images.slice();
    imgs[i] = newImages;
    history = history.slice(0, historyStep + 1);
    history = history.concat([imgs]);
    historyStep += 1;
    setImages(imgs);
  };

  const handleDeleteImage = () => {
    if (!selectedId) return;
    const imgs = images.slice();
    const newImgs = imgs.filter((img) => img.id !== selectedId);
    history = history.slice(0, historyStep + 1);
    history = history.concat([newImgs]);
    historyStep += 1;
    setImages(newImgs);
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    downloadURI(uri, 'stage.png');
  };

  const onChangeImageDesign = (newImages) => {
    const newImagesDesign = newImages.map((image, i) => ({
      ...image,
      id: i,
      ...fixedFrameInfo,
    }));
    setImagesDesign(newImagesDesign);
  };

  const handleAddImageBase = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
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

  const handleMergeImages = async () => {
    const newImageEdited = [];
    await Promise.all(
      imagesDesign.map(async (imageDesign, index) => {
        const container = document.createElement('div');
        container.id = `konva-container-${index}`;
        document.body.appendChild(container);
        const newStage = new window.Konva.Stage({
          container: `konva-container-${index}`,
          width: 510,
          height: 510,
        });
        const newLayer = new window.Konva.Layer();
        newStage.add(newLayer);

        const loadImages = images.map((image) => {
          return new Promise((resolve) => {
            const img = new window.Image();
            img.src = image.src;
            img.onload = () => {
              const newImage = new window.Konva.Image({
                x: image.x,
                y: image.y,
                image: img,
                width: image.width,
                height: image.height,
              });
              newLayer.add(newImage);
              resolve();
            };
          });
        });

        const imgDesign = new window.Image();
        imgDesign.src = imageDesign.src;
        const loadDesignImage = new Promise((resolve) => {
          imgDesign.onload = () => {
            const newImage = new window.Konva.Image({
              x: fixedFrameInfo.x,
              y: fixedFrameInfo.y,
              image: imgDesign,
              width: fixedFrameInfo.width,
              height: fixedFrameInfo.height,
            });
            newLayer.add(newImage);
            resolve();
          };
        });

        await Promise.all([...loadImages, loadDesignImage]);

        newLayer.draw();

        const dataURL = newStage.toDataURL();
        const newImg = new window.Image();
        newImageEdited.push({ url: dataURL });
        newImg.src = dataURL;
        // xoá container sau khi merge xong
        document.body.removeChild(container);
      }),
    );
    setImageEdited(newImageEdited);
  };

  return (
    <div className="flex w-[1000px] mx-auto mt-20">
      <div className="flex flex-1 flex-col gap-5 items-end mr-5">
        <Button onClick={handleAddImageBase} icon={<CloudUploadOutlined />} className="w-[50%]">
          Upload base image
        </Button>
        <div>
          <p className="font-semibold text-[16px] mb-1">Design images:</p>
          <UploadDesign fileList={imagesDesign} setFileList={onChangeImageDesign} />
        </div>
        <Button className="w-[50%]" type="primary" ghost onClick={handleMergeImages}>
          Merge Images
        </Button>
        {imageEdited.length > 0 && (
          <div>
            <p className="font-semibold text-[16px] mb-1">Image Edited:</p>
            <UploadDesign fileList={imageEdited} setFileList={setImageEdited} />
            <Input placeholder="Enter product title" className="mt-3 w-[95%]" />
            <Input placeholder="Enter seller sku" className="mt-3 w-[95%]" />
            <Button
              className="w-[50%] mx-auto mt-5 block"
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => setShowModalUpload(true)}
            >
              Upload products
            </Button>
          </div>
        )}
      </div>
      <div className="relative shrink-0 flex-1 h-[510px] w-[510px]">
        <div className="flex gap-1 flex-wrap justify-end absolute top-[-36px] w-[510px]">
          <Tooltip title="Undo">
            <Button onClick={handleUndo} disabled={historyStep === 0} icon={<UndoIcon />} />
          </Tooltip>
          <Tooltip title="Redo">
            <Button onClick={handleRedo} disabled={historyStep === history.length - 1} icon={<RedoIcon />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button onClick={() => handleDeleteImage(selectedId)} icon={<DeleteOutlined />} disabled={!selectedId} />
          </Tooltip>
        </div>
        <div className=" absolute inset-0">
          <Stage
            width={510}
            height={510}
            ref={stageRef}
            className="border-[1px] w-[513px] border-solid border-gray-200 hover:border-gray-500  inset-0"
          >
            <Layer>
              {images.map((image, i) => (
                <URLImage
                  key={i}
                  imageProps={image}
                  image={image}
                  isSelected={image.id === selectedId}
                  onSelect={(value) => selectShape(value)}
                  onChange={(newAttrs) => handleImageChange(i, newAttrs)}
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
        {isShowModalUpload && (
          <ModalUploadProduct
            isShowModalUpload={isShowModalUpload}
            setShowModalUpload={setShowModalUpload}
            // productList={convertDataProducts(true)}
            imagesLimit={imageEdited}
          // modalErrorInfo={modalErrorInfo}
          // setModalErrorInfo={setModalErrorInfo}
          />
        )}
      </div>
    </div>
  );
}
