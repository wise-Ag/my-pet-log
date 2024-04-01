//구독자 목록
export interface SubscriberListType {
  id: string;
  nickname: string;
  profilePath: string;
  isBlocked: boolean;
}

//구독중인 펫계정
export interface SubscribedPetType {
  id: number;
  name: string;
  profilePath: string;
}
