"use client";
import { useModal } from "@/app/_hooks/useModal";
import Modal from "@/app/_components/Modal";
import { container, memberlist, profileWrapper, profileImg, nickname, button } from "./style.css";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { getImagePath } from "@/app/_utils/getPetImagePath";
import { showToast } from "@/app/_components/Toast";
import { SubscriberListType } from "@/app/_types/subscriptions/types";
import { getSubscriberList, putBlockedUsers } from "@/app/_api/subscription";
import { UserType } from "@/app/_types/user/types";
import { getMe } from "@/app/_api/users";
import EmptyBlockedUser from "../EmptyBlockedUser";

const BlockedUserList = ({ petId }: { petId: number }) => {
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
      showToast("차단이 해제되었습니다!", true);
      queryClient.invalidateQueries({ queryKey: ["petSubscriber"] });
    },
  });

  // 차단해제 버튼 누를 시
  const handleConfirm = () => {
    closeModalFunc();

    if (selectedPetSubscriberId !== null) {
      cancelSubscriptionMutation.mutate(selectedPetSubscriberId);
    }
  };

  const blockedUserData = accountsData?.filter((member) => member.isBlocked);

  //차단한 계정이 0개일 때
  if (blockedUserData?.length === 0) return <EmptyBlockedUser />;

  return (
    <>
      <main className={container}>
        {blockedUserData?.map((member) => (
          <section key={member.id} className={memberlist}>
            <div className={profileWrapper}>
              <Image className={profileImg} src={getImagePath(member.profilePath)} alt="profile icon" width={40} height={40} />
              <p className={nickname}>{member.nickname}</p>
            </div>
            <button
              className={button}
              onClick={() => {
                setSelectedPetSubscriberId(member.id);
                openModalFunc();
              }}
            >
              차단해제
            </button>
          </section>
        ))}
        {isModalOpen && <Modal text={`차단을 해제하시겠습니까?\n 앞으로 어쩌구저쩌구`} buttonText="확인" onClick={handleConfirm} onClose={closeModalFunc} />}
      </main>
    </>
  );
};

export default BlockedUserList;
