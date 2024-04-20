export interface Diary {
  diaryId: number;
  title: string;
  content: string;
  thumbnailPath: null | string;
  writer: {
    id: string;
    nickname: string;
    isCurrentUser: boolean;
  };
  commentCount: number;
  isPublic: boolean;
}

export interface postDiaryRequest {
  title: string;
  content: string;
  date: string;
  images?: File[];
  video?: File;
}

export interface Writer {
  id: string;
  nickname: string;
  isCurrentUser: boolean;
  profilePath: string;
}

export interface CommentType {
  commentId: number;
  isDeleted: boolean;
  recommentCount: number;
  content: string;
  createdAt: string;
  isCurrentUserLiked: boolean;
  likeCount: number;
  writer: Writer;
  taggedUsers: Tag[];
}

interface Tag {
  id: string;
  nickname: string;
  isCurrentUser: boolean;
}

export interface PostDiaryVideoResponse {
  videoId: string;
  validUntil: string;
}

export interface GetDiaryListResponse {
  content: [
    {
      date: string;
      diaries: Diary[];
    },
  ];

  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface getFeedResponse {
  pet: {
    name: string;
    id: number;
    profilePath: string | null;
    isSubscribed: boolean;
  };
  diaryId: number;
  title: string;
  content: string;
  createdAt: string;
  medias: {
    mediaId: number;
    path: string;
  }[];
  commentCount: number;
  likeCount: number;
  isCurrentUserLiked: boolean;
}

export interface GetDiaryListRequest {
  page: number | unknown;
  size: number;
}

export interface GetCommentsRequest extends GetDiaryListRequest {
  petId: number;
  diaryId: number;
}

export interface GetReCommentsRequest {
  diaryId: number;
  ancestorId: number;
}

export interface GetDiaryRequest {
  petId: number;
  diaryId: number;
}
export interface DiaryMediaType {
  mediaId: number;
  path: string;
}

export interface GetDiaryResponse {
  diaryId: number;
  title: string;
  content: string;
  date: string;
  images: DiaryMediaType[];
  videos: DiaryMediaType[];
  isCurrentUserLiked: boolean;
  writer: Writer;
  commentCount: number;
  likeCount: number;
  isPublic: boolean;
  pet: {
    id: number;
    breed: string;
    age: string;
  };
}

export interface GetCommentsResponse {
  content: CommentType[];

  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type GetReCommentsResponse = CommentType[];

export interface PostDiaryRequest {
  petId: number;
  data: {
    title: string;
    content: string;
    date: string;
    image?: File[];
    video?: File;
  };
}

export interface PostCommentRequest {
  petId: number;
  diaryId: number;
  content: string;
  taggedUserIds?: string[];
}

export interface PostReCommentRequest {
  commentId: number;
  content: string;
  taggedUserIds?: string[];
}

export interface PutCommentRequest {
  commentId: number;
  content: string;
}

export interface getSearchDiaryRequest {
  page: number | unknown;
  size: number;
  keyword: string | null;
}

export interface getFeedRequest {
  page: number | unknown;
  size: number | unknown;
}
