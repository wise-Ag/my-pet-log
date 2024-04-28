"use client";

import { getDiaryDraft, postDiary } from "@/app/_api/diary";
import Loading from "@/app/_components/Loading";
import { showToast } from "@/app/_components/Toast";
import { diaryImagesAtom, loadSavedDiaryAtom } from "@/app/_states/atom";
import { getPrettyToday } from "@/app/_utils/getPrettyToday";
import { FormInput } from "@/app/diary/_components/Form/EditForm";
import DateInput from "@/app/diary/_components/Input/DateInput";
import { ContentInput, TitleInput } from "@/app/diary/_components/Input/FormInput";
import ImageInput from "@/app/diary/_components/Input/ImageInput";
import VideoInput from "@/app/diary/_components/Input/VideoInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as styles from "./style.css";
import PublicPrivateToggle from "@/app/diary/_components/Input/PublicPrivateToggle";
import { useEffect, useState } from "react";
import { DiaryDraftMediaType, DiaryMediaType, GetDiaryDraftResponse } from "@/app/_types/diary/type";

interface Diary {
  title: string;
  content: string;
  date: string;
  uploadedVideoIds?: string[];
  isPublic: boolean;
}

const CreateForm = ({ petId }: { petId: number }) => {
  const queryClient = useQueryClient();
  const [oldImages, setOldImages] = useState<DiaryMediaType[] | DiaryDraftMediaType[]>([]);
  const [oldVideo, setOldVideo] = useState<DiaryMediaType[] | DiaryDraftMediaType[]>([]);
  const [loadSavedDiary, setLoadSavedDiary] = useAtom(loadSavedDiaryAtom);

  useEffect(() => {
    if (!loadSavedDiary) return;
    const loadDiaryDarft = async () => {
      const diary: GetDiaryDraftResponse = await getDiaryDraft();
      console.log(diary);
      if (diary) {
        setValue("title", diary.title);
        setValue("content", diary.content);
        setValue("date", diary.date.replaceAll(".", "-"));
        setOldImages([...diary.images]);
        setOldVideo([...diary.videos]);
        setValue("isPublic", diary.isPublic ? "PUBLIC" : null);
      }
      setLoadSavedDiary(false);
    };
    loadDiaryDarft();
  }, [loadSavedDiary]);

  //일기 생성
  const {
    mutate: postDiaryMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (formData: FormData) => postDiary({ formData }),
    onSuccess: () => {
      setDiaryImages([]);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["diaries", petId] });
        router.push("/diary/my-pet");
      }, 1000); //썸네일 서버에서 완성되는 동안 기다려줌
    },
    onError: () => {
      showToast("일기 생성에 실패했습니다.", false);
    },
  });

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
    handleSubmit,
  } = useForm<FormInput>({ mode: "onChange", defaultValues: { date: getPrettyToday(), isPublic: "PUBLIC" } });

  const [diaryImages, setDiaryImages] = useAtom(diaryImagesAtom);

  const router = useRouter();

  return (
    <>
      <div className={styles.container}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(async (data) => {
            const formData = new FormData();

            const request: Diary = {
              title: data.title,
              content: data.content,
              date: data.date,
              isPublic: data.isPublic === "PUBLIC" ? true : false,
            };

            //video가 있다면 백엔드에 등록 후 응답id를 formData에 추가
            if (data.video) {
              request.uploadedVideoIds = [data.video];
            }

            const blob = new Blob([JSON.stringify(request)], { type: "application/json" });
            formData.append("request", blob);

            if (diaryImages) {
              diaryImages.forEach((v) => formData.append("images", v.file));
            }

            postDiaryMutation(formData);
          })}
        >
          <TitleInput register={register} watch={watch} errors={errors} />
          <DateInput register={register} setValue={setValue} getValue={getValues} />
          <ImageInput register={register} setValue={setValue} oldMedia={oldImages} />
          <VideoInput register={register} setValue={setValue} oldMedia={oldVideo} />
          <ContentInput register={register} watch={watch} errors={errors} />
          <PublicPrivateToggle register={register} watch={watch} setValue={setValue} />

          <button className={styles.button}>작성하기</button>
        </form>
        {(isPending || isSuccess) && <Loading />}
      </div>
    </>
  );
};

export default CreateForm;
