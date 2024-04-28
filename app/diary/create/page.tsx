import { getDiaryDraftCheck } from "@/app/_api/diary";
import { container, root } from "@/app/diary/(diary)/my-pet/style.css";
import DiaryLoadModal from "@/app/diary/_components/DiaryDraftModal/DiaryLoadModal";
import CreateForm from "@/app/diary/_components/Form/CreateForm";
import BackHeader from "@/app/diary/create/BackHeader";
import { cookies } from "next/headers";
import { Suspense } from "react";

const CreatePage = async () => {
  const petId = Number(cookies().get("petId")?.value);

  const { hasDiaryDraft } = await getDiaryDraftCheck();

  return (
    <div className={root}>
      <BackHeader />
      <div className={container}>
        <Suspense fallback={<div>Loading</div>}>
          {hasDiaryDraft && <DiaryLoadModal />}
          <CreateForm petId={petId} />
        </Suspense>
      </div>
    </div>
  );
};

export default CreatePage;
