export type DesignTemplates = {
  id: number;
  user: number;
  content: FixedFrameInfo;
};

export type FixedFrameInfo = {
  id: number;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};
