export type InfoBoxType = {
  key: number,
  color: React.CSSProperties['backgroundColor'];
  title: string;
  content?: string;
  width: Number;
  height: Number;
  left?: Number;
  top?: Number;
  type: string;
};

export type MapType = {
  width: number;
  height: number;
  left: number;
  top: number;
};