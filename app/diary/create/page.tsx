import { getDiaryDraftCheck } from "@/app/_api/diary";
import BackHeader from "@/app/_components/BackHeader";
import { container, root } from "@/app/diary/(diary)/my-pet/style.css";
import CreateForm from "@/app/diary/_components/Form/CreateForm";
import { cookies } from "next/headers";
import { Suspense } from "react";

const CreatePage = async () => {
  const petId = Number(cookies().get("petId")?.value);

  const { hasDiaryDraft } = await getDiaryDraftCheck();

  return (
    <div className={root}>
      <BackHeader title="육아일기 글작성" styleTop="0" />
      <div className={container}>
        <Suspense fallback={<div>Loading</div>}>{hasDiaryDraft ? <div></div> : <CreateForm petId={petId} />}</Suspense>
      </div>
    </div>
  );
};

export default CreatePage;
