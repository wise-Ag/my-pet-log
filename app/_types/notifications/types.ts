export interface NotificationContentType {
  id: number;
  type: string;
  message: string;
  thumbnailPath: string;
  checked: true;
  createdAt: string;
}

export interface PageableType {
  offset: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface GetNotificationsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: NotificationContentType[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: PageableType;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface GetNotificationsRequest {
  page: number;
  size: number;
}
