import { deletedVideoIdsAtom } from "@/app/_states/atom";
import * as inputStyles from "@/app/diary/_components/Input/ImageInput/style.css";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { IoIosCloseCircle } from "react-icons/io";
import * as styles from "./style.css";
import { useMutation } from "@tanstack/react-query";
import { postDiaryVideo } from "@/app/_api/diary";
import { showToast } from "@/app/_components/Toast";
import Loading from "@/app/_components/Loading";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormInput } from "@/app/diary/_components/Form/EditForm";
import { DiaryDraftMediaType, DiaryMediaType } from "@/app/_types/diary/type";

export interface InputProps {
  register: UseFormRegister<FormInput>;
  setValue: UseFormSetValue<FormInput>;
  oldMedia?: DiaryMediaType[];
  draftMedia?: DiaryDraftMediaType[];
}

const convertURLtoFile = async (url: string) => {
  const response = await fetch(url);
  const data = await response.blob();
  const filename = url.split("/").pop(); // url 구조에 맞게 수정할 것
  const metadata = { type: `video/mp4` };
  return new File([data], filename!, metadata);
};

const VideoInput = ({ register, setValue, oldMedia, draftMedia }: InputProps) => {
  const [previewVideo, setPreviewVideo] = useState("");
  const [, setDeletedVideo] = useAtom(deletedVideoIdsAtom);
  const [oldData, setOldData] = useState(oldMedia);
  // const [draftData,setDraftData] = useState(draftMedia);

  const { mutate: postVideoMutation, isPending } = useMutation({
    mutationFn: (formData: FormData) => postDiaryVideo({ formData }),
    onSuccess: (res) => {
      setValue("video", res.videoId);
    },
    onError: () => {
      showToast("영상 업로드에 실패했습니다.", false);
    },
  });

  useEffect(() => {
    //input은 기본으로 null이 아니라 File[]이므로 초기화해줌
    setValue("video", null);
  }, []);

  useEffect(() => {
    //edit용 이전 데이터
    setOldData(oldMedia);
  }, [oldMedia]);

  useEffect(() => {
    // setDraftData(draftMedia)
    if (!draftMedia?.length) return;

    const handleDraftVideo = async () => {
      const videoFile = await convertURLtoFile(process.env.NEXT_PUBLIC_IMAGE_PREFIX + draftMedia[0].path);
      setPreviewVideo(URL.createObjectURL(videoFile));

      //video upload
      const videoFormData = new FormData();
      videoFormData.append("video", videoFile);
      postVideoMutation(videoFormData);
    };

    handleDraftVideo();
  }, [draftMedia]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;
    if (files[0].size > 100 * 1024 * 1024) return showToast("업로드 가능한 동영상 최대 용량은 100MB입니다.", false);

    setPreviewVideo(URL.createObjectURL(files[0]));

    if (oldData && oldData.length > 0) {
      //비디오는 한 개만 첨부 가능하므로 oldData삭제
      setDeletedVideo((prev) => [...prev, oldData[0].mediaId]);
      setOldData([]);
    }

    //video upload
    const videoFormData = new FormData();
    videoFormData.append("video", files[0]);
    postVideoMutation(videoFormData);
  };

  const deleteVideo = () => {
    setPreviewVideo("");
    setValue("video", null);
  };

  const deleteOldVideo = () => {
    if (oldData) setDeletedVideo((prev) => [...prev, oldData[0].mediaId]);
    setOldData([]);
    setValue("video", null);
  };
  return (
    <div className={inputStyles.root}>
      <label className={inputStyles.label}>동영상</label>
      <div className={inputStyles.container}>
        <label htmlFor="video" className={inputStyles.input}>
          <AiOutlineVideoCameraAdd className={inputStyles.addIcon} width={80} height={80} />
        </label>
        <input id="video" style={{ display: "none" }} type="file" accept="video/*" {...register("video")} onChange={handleVideoChange} />
        {previewVideo && (
          <div style={{ position: "relative", width: "10rem", height: "10rem" }}>
            <video className={styles.video} src={previewVideo} autoPlay />
            <IoIosCloseCircle className={inputStyles.closeIcon} onClick={deleteVideo} />
          </div>
        )}
        {oldData && oldData.length > 0 && (
          <div style={{ position: "relative", width: "10rem", height: "10rem" }}>
            <video className={styles.video} src={`${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${oldData[0].path}`} autoPlay />
            <IoIosCloseCircle className={inputStyles.closeIcon} onClick={deleteOldVideo} />
          </div>
        )}
      </div>
      <p className={inputStyles.p}>동영상 최대 1개 (100MB 제한) </p>
      {isPending && <Loading />}
    </div>
  );
};

export default VideoInput;
