import Konva from 'react-konva';

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare global {
  interface Window {
    Konva: Konva;
  }
}
