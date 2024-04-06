"use client";
import { useModal } from "@/app/_hooks/useModal";
import Modal from "@/app/_components/Modal";
import { container, memberlist, profileWrapper, profileImg, nickname, buttonWrapper, button } from "./style.css";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { getImagePath } from "@/app/_utils/getPetImagePath";
import { showToast } from "@/app/_components/Toast";
import { SubscriberListType } from "@/app/_types/subscriptions/types";
import { getSubscriberList, putBlockedUsers } from "@/app/_api/subscription";
import { UserType } from "@/app/_types/user/types";
import { getMe } from "@/app/_api/users";
import EmptySubscriber from "@/app/settings/_components/EmptySubscriber";

const PetSubscriberList = ({ petId }: { petId: number }) => {
  const queryClient = useQueryClient();

  const { data: user } = useQuery<UserType>({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

  const { data: accountsData } = useQuery<SubscriberListType[]>({
    queryKey: ["petSubscriber", petId],
    queryFn: () => getSubscriberList(petId),
  });

  const { isModalOpen, openModalFunc, closeModalFunc } = useModal();
  const [selectedPetSubscriberId, setSelectedPetSubscriberId] = useState<string | null>(null);

  const cancelSubscriptionMutation = useMutation({
    mutationFn: (userId: string) => putBlockedUsers(petId, userId),

    onSuccess: () => {
      showToast("성공적으로 차단되었습니다!", true);
      queryClient.invalidateQueries({ queryKey: ["petSubscriber"] });
    },
  });

  // 차단 버튼 누를 시
  const handleConfirm = () => {
    closeModalFunc();

    if (selectedPetSubscriberId !== null) {
      cancelSubscriptionMutation.mutate(selectedPetSubscriberId);
    }
  };

  //차단한 유저, 내 정보를 제외한 나머지 구독자 목록
  const subscriberList = accountsData?.filter((member) => !member.isBlocked && member.id !== user?.id);

  //구독자 목록이 0개일 때
  if (subscriberList?.length === 0) return <EmptySubscriber />;

  return (
    <>
      <main className={container}>
        {subscriberList?.map((member) => (
          <section key={member.id} className={memberlist}>
            <div className={profileWrapper}>
              <Image className={profileImg} src={getImagePath(member.profilePath)} alt="profile icon" width={40} height={40} />
              <p className={nickname}>{member.nickname}</p>
            </div>
            <div className={buttonWrapper}>
              <button
                className={button}
                onClick={() => {
                  setSelectedPetSubscriberId(member.id);
                  openModalFunc();
                }}
              >
                차단하기
              </button>
            </div>
          </section>
        ))}
        {isModalOpen && (
          <Modal
            text={`선택한 유저를 차단합니다.\n 해당 유저는 앞으로 회원님의 게시글을 볼 수 없지만, 여전히 구독중으로 표시됩니다.`}
            buttonText="확인"
            onClick={handleConfirm}
            onClose={closeModalFunc}
          />
        )}
      </main>
    </>
  );
};

export default PetSubscriberList;
