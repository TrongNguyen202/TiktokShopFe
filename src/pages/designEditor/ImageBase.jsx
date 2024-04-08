import React, { useRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

export default function ImageBase({ imageProps, image, onSelect, color = { r: 255, g: 0, b: 0, a: 1 } }) {
  const imgRef = useRef();
  const [img] = useImage(image.src);
  return (
    <>
      <Image
        image={img}
        x={image.x}
        y={image.y}
        {...imageProps}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        onClick={(e) => onSelect(e, null)}
        onTap={() => onSelect(null)}
        ref={imgRef}
        fill={color}
      />
    </>
  );
}
