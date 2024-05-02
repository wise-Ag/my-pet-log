// 공통 타입 정의
export interface Writer {
  id: string;
  nickname: string;
  isCurrentUser: boolean;
  profilePath: string;
}

interface Tag {
  id: string;
  nickname: string;
  isCurrentUser: boolean;
}

export interface DiaryMediaType {
  mediaId: number;
  path: string;
}

export interface DiaryDraftMediaType {
  path: string;
}

export interface GetDiaryDraftResponse {
  title: string;
  content: string;
  date: string;
  isPublic: boolean;
  images: DiaryDraftMediaType[];
  videos: DiaryDraftMediaType[];
}

// 일기(Diary) 관련 인터페이스
export interface Diary {
  diaryId: number;
  title: string;
  content: string;
  thumbnailPath: null | string;
  writer: Writer;
  commentCount: number;
  isPublic: boolean;
}

export interface GetDiaryListRequest {
  page: number | unknown;
  size: number;
}

export interface GetDiaryRequest {
  petId: number;
  diaryId: number;
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

export interface PostDiaryVideoResponse {
  videoId: string;
  validUntil: string;
}

// 댓글(Comment) 관련 인터페이스
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
  receiver?: {
    id: string;
    nickname: string;
    profilePath: string;
    isCurrentUser: boolean;
  };
}

export interface GetCommentsRequest extends GetDiaryListRequest {
  petId: number;
  diaryId: number;
}

export interface GetReCommentsRequest {
  petId: number;
  diaryId: number;
  ancestorId: number;
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

export interface PostCommentRequest {
  petId: number;
  diaryId: number;
  content: string;
  taggedUsers?: string[];
}

export interface PostReCommentRequest {
  petId: number;
  commentId: number;
  content: string;
  taggedUsers?: string[];
}

export interface PutCommentRequest {
  petId: number;
  commentId: number;
  content: string;
  taggedUsers?: string[];
}

// 피드(Feed) 및 검색(Search) 관련 인터페이스
export interface getFeedRequest {
  page: number | unknown;
  size: number | unknown;
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

export interface getSearchDiaryRequest {
  page: number | unknown;
  size: number;
  keyword: string | null;
}

// 좋아요(Like) 관련 인터페이스
export interface GetLikeListResponse {
  id: string;
  nickname: string;
  profilePath: string;
  isCurrentUser: boolean;
}
