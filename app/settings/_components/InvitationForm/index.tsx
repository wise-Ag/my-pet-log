import { form, formTitle, input, button } from "./style.css";
import { useForm } from "react-hook-form";
import { ERROR_MESSAGE } from "@/app/_constants/inputConstant";
import { postInviteGuardian } from "@/app/_api/guardians";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { showToast } from "@/app/_components/Toast";

interface IForm {
  inputValue: string;
}

const InvitationForm = ({ petId }: { petId: number }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IForm>({ mode: "onTouched" });

  const inviteMutation = useMutation({
    mutationFn: (email: string) => postInviteGuardian(email),
    onSuccess: (res) => {
      if (res == "true") {
        showToast("초대 완료!", true);
        queryClient.invalidateQueries({ queryKey: ["my-invitations", petId] });
      }
      if (res === 404) return setError("inputValue", { message: "초대한 사용자를 찾을 수 없습니다." });
      if (res === 400) return setError("inputValue", { message: "공동집사이거나 이미 초대 되었습니다." });
    },
  });

  const onSubmit = (data: IForm) => {
    inviteMutation.mutate(data.inputValue);
  };

  return (
    <form className={form} onSubmit={handleSubmit(onSubmit)}>
      <label className={formTitle}>초대할 이메일</label>
      <input
        className={input}
        type="text"
        placeholder="이메일 입력"
        {...register("inputValue", {
          required: ERROR_MESSAGE.emailRequired,
        })}
      />
      {errors.inputValue && <ErrorMessage message={errors.inputValue.message} />}

      <button className={button} type="submit">
        등록
      </button>
    </form>
  );
};
export default InvitationForm;
