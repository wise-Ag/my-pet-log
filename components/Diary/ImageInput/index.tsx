import { useState } from "react";
import * as styles from "./style.css";
import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IoIosCloseCircle } from "react-icons/io";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/@common/Modal";
import { LuImagePlus, LuImageOff } from "react-icons/lu";

interface PreviewImage {
  name: string;
  url: string;
}
const MAX_IMAGES = 10;

const ImageInput = ({ register, setValue }: { register: UseFormRegister<FieldValues>; setValue: UseFormSetValue<FieldValues> }) => {
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<PreviewImage[]>([]);
  const { isModalOpen, openModalFunc, closeModalFunc } = useModal();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (files?.length + images.length > MAX_IMAGES) {
      openModalFunc();
      return;
    }
    for (let i = 0; i < files?.length; i++) {
      if (images.filter((v) => v.name === files[i].name).length > 0) break; //같은 이미지는 무시함

      setImages((prev) => [...prev, files[i]]);
      setPreviewImage((prev) => [...prev, { name: files[i].name, url: URL.createObjectURL(files[i]) }]);
    }
  };

  const deleteImage = (name: string) => {
    setImages((prev) => prev.filter((v) => v.name !== name));
    setPreviewImage((prev) => prev.filter((v) => v.name !== name));
    setValue("image", null);
  };
  return (
    <div className={styles.root}>
      <label className={styles.label}>이미지</label>
      <div className={styles.container}>
        <label htmlFor="image" className={`${styles.input} ${images.length >= MAX_IMAGES && styles.disabledInput}`}>
          {images.length >= MAX_IMAGES ? <LuImageOff className={styles.addIcon} /> : <LuImagePlus className={styles.addIcon} />}
        </label>
        <input
          id="image"
          style={{ display: "none" }}
          type="file"
          multiple
          accept="image/*"
          {...register("image")}
          onChange={handleImageChange}
          disabled={images.length >= MAX_IMAGES}
        />

        {previewImage &&
          previewImage.map((image) => {
            return (
              <div draggable={true} key={image.name} className={styles.preview} style={{ backgroundImage: `url(${image.url})` }}>
                <IoIosCloseCircle className={styles.closeIcon} onClick={() => deleteImage(image.name)} />
              </div>
            );
          })}
      </div>
      <p className={styles.p}>
        이미지 최대 {MAX_IMAGES}개 중 {images.length}개
      </p>
      {isModalOpen && (
        <Modal>
          <div className={styles.error}>
            최대 이미지 수 {MAX_IMAGES}개를 초과했습니다.<button onClick={closeModalFunc}>닫기</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ImageInput;
