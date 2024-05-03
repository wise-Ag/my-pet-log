import { container, root } from "@/app/diary/(diary)/my-pet/style.css";
import CreateForm from "@/app/diary/_components/Form/CreateForm";
import BackHeader from "@/app/diary/create/BackHeader";
import { cookies } from "next/headers";
const CreatePage = async () => {
  const petId = Number(cookies().get("petId")?.value);

  return (
    <div className={root}>
      <BackHeader />
      <div className={container}>
        <CreateForm petId={petId} />
      </div>
    </div>
  );
};
export default CreatePage;
