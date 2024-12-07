/* eslint-disable no-unused-vars */
export interface ImageProps {
  id: number;
  height: string;
  width: string;
  uuid: string;
  format: string;
  // blurDataUrl?: string;
  fileName: string;
  size: number;
  fileType: string;
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}
