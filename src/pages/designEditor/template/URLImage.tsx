import React, { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

type URLImageProps = {
  imageProps: any;
  image: any;
  isSelected: boolean;
  checkDeselect: () => void;
  onSelect: (id: string) => void;
  onChange: (newAttrs: any) => void;
};

export default function URLImage({ imageProps, image, isSelected, checkDeselect, onSelect, onChange }: URLImageProps) {
  const imgRef = useRef();
  const trRef: any = useRef();
  const [img] = useImage(image.src);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([imgRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={img}
        x={image.x}
        y={image.y}
        {...imageProps}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        draggable
        onClick={() => onSelect(image.id)}
        onTap={() => onSelect(image.id)}
        ref={imgRef}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        onDragEnd={(e) => {
          onChange({
            ...imageProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node: any = imgRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...imageProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
