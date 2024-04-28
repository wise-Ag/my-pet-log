"use server";

import instance from "@/app/_api/axios";
import {
  CommentType,
  GetCommentsRequest,
  GetReCommentsRequest,
  GetReCommentsResponse,
  GetCommentsResponse,
  GetDiaryListRequest,
  GetDiaryListResponse,
  GetDiaryResponse,
  PostCommentRequest,
  PostReCommentRequest,
  PostDiaryVideoResponse,
  PutCommentRequest,
  getSearchDiaryRequest,
  getFeedRequest,
} from "@/app/_types/diary/type";
import { cookies } from "next/headers";

export const postDiary = async ({ formData }: { formData: FormData }) => {
  const petId = cookies().get("petId")?.value;
  try {
    const res = await instance.post(`/pets/${petId}/diaries`, formData, { headers: { "Content-Type": "multipart/form-data" } });

    return res.data;
  } catch (error: any) {
    throw Error("일기 생성 실패");
  }
};

export const getDiaryList = async ({ page, size }: GetDiaryListRequest) => {
  const petId = cookies().get("petId")?.value;
  try {
    const res = await instance.get(`/pets/${petId}/diaries`, { params: { page, size } });

    return await res.data;
  } catch (error: any) {
    console.error(error.response);
    return null;
  }
};

export const getDiary = async ({ diaryId }: { diaryId: number }): Promise<GetDiaryResponse | null> => {
  const petId = cookies().get("petId")?.value;
  try {
    const res = await instance.get(`pets/${petId}/diaries/${diaryId}`);

    return res.data;
  } catch (error: any) {
    console.error(error.response);
    return null;
  }
};

export const getComments = async ({ petId, diaryId, page, size }: GetCommentsRequest): Promise<GetCommentsResponse | null> => {
  try {
    const res = await instance.get(`pets/${petId}/diaries/${diaryId}/comments`, { params: { page, size } });

    return res.data;
  } catch (error: any) {
    console.error(error.response);
    return null;
  }
};

export const getReComments = async ({ ancestorId, diaryId }: GetReCommentsRequest): Promise<GetReCommentsResponse | null> => {
  const petId = cookies().get("petId")?.value;
  try {
    const res = await instance.get(`pets/${petId}/diaries/${diaryId}/comments/${ancestorId}/recomment`);
    return res.data;
  } catch (error: any) {
    console.error(error.response);
    return null;
  }
};

export const getFeed = async ({ page, size }: getFeedRequest) => {
  try {
    const res = await instance.get(`diaries/feed`, { params: { page, size } });
    return res.data;
  } catch (error: any) {
    console.error(error.response);
    return null;
  }
};

export const deleteDiary = async ({ diaryId }: { diaryId: number }) => {
  const petId = cookies().get("petId")?.value;
  try {
    await instance.delete(`pets/${petId}/diaries/${diaryId}`);
  } catch (error: any) {
    throw Error("일기 샥제 실패");
  }
};

export const postDiaryLike = async ({ diaryId }: { diaryId: number }) => {
  const petId = cookies().get("petId")?.value;
  await instance.post(`pets/${petId}/diaries/${diaryId}/like`);
};

export const postComment = async ({ diaryId, content }: PostCommentRequest): Promise<CommentType> => {
  const petId = cookies().get("petId")?.value;
  const res = await instance.post(`pets/${petId}/diaries/${diaryId}/comments`, { content });
  return res.data;
};

export const postReComment = async ({ commentId, content, taggedUserIds }: PostReCommentRequest): Promise<GetReCommentsResponse> => {
  const petId = cookies().get("petId")?.value;
  const res = await instance.post(`pets/${petId}/diaries/comments/${commentId}/recomment`, { content, taggedUserIds });
  return res.data;
};

export const deleteComment = async ({ commentId }: { commentId: number }) => {
  const petId = cookies().get("petId")?.value;
  await instance.delete(`pets/${petId}/diaries/comments/${commentId}`);
};

export const putComment = async ({ commentId, content }: PutCommentRequest) => {
  const petId = cookies().get("petId")?.value;
  await instance.put(`pets/${petId}/diaries/comments/${commentId}`, { content });
};

export const postCommentLike = async ({ petId, commentId }: { petId: number; commentId: number }) => {
  await instance.post(`pets/${petId}/diaries/comments/${commentId}/like`);
};

export const getSearchDiary = async ({ page, size, keyword }: getSearchDiaryRequest): Promise<GetDiaryListResponse | null> => {
  const petId = cookies().get("petId")?.value;
  try {
    const res = await instance.get(`pets/${petId}/diaries/search`, { params: { page, size, keyword } });
    return res.data;
  } catch (error: any) {
    console.error(error.response);
    return null;
  }
};

export const putDiary = async ({ diaryId, formData }: { diaryId: number; formData: FormData }) => {
  const petId = cookies().get("petId")?.value;
  await instance.put(`pets/${petId}/diaries/${diaryId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
};

export const postDiaryVideo = async ({ formData }: { formData: FormData }): Promise<PostDiaryVideoResponse> => {
  const res = await instance.post(`/videos?domain=DIARY`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
};

export const getSearchTerms = async () => {
  try {
    const petId = cookies().get("petId")?.value;
    const res = await instance.get(`pets/${petId}/diaries/search/terms`);

    return res.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};

export const getDiaryDraftCheck = async () => {
  try {
    const petId = cookies().get("petId")?.value;
    const res = await instance.get(`pets/${petId}/diaries/drafts/check`);

    return res.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};

export const deleteDiaryDraft = async () => {
  try {
    const petId = cookies().get("petId")?.value;
    await instance.delete(`pets/${petId}/diaries/drafts`);
  } catch (error: any) {
    console.error(error.response.data);
  }
};

export const getDiaryDraft = async () => {
  try {
    const petId = cookies().get("petId")?.value;
    const res = await instance.get(`pets/${petId}/diaries/drafts`);

    if (res.status === 200) await deleteDiaryDraft(); //임시저장 성공적으로 불러왔다면 삭제
    return res.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};
