import { FormInput } from "@/app/diary/_components/Form/EditForm";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import * as styles from "./style.css";

interface Props {
  register: UseFormRegister<FormInput>;
  watch: UseFormWatch<FormInput>;
  setValue: UseFormSetValue<FormInput>;
}

const PublicPrivateToggle = ({ register, watch, setValue }: Props) => {
  return (
    <div className={styles.root}>
      <div>
        <label className={styles.label}>일기 공개 *</label>
        <p className={styles.p}>{watch("isPublic") === "PUBLIC" ? "다른 사용자가 이 일기를 볼 수 있습니다." : "다른 사용자가 이 일기를 볼 수 없습니다."}</p>
      </div>
      <div className={styles.toggleContainer}>
        <input className={styles.checkbox} type="checkbox" id="PUBLIC" value="PUBLIC" {...register("isPublic")} />
        <div
          onClick={() => {
            setValue("isPublic", watch("isPublic") === "PUBLIC" ? null : "PUBLIC");
          }}
          className={`${styles.circle} ${watch("isPublic") === "PUBLIC" && styles.checkedCircle}`}
        />
      </div>
    </div>
  );
};

export default PublicPrivateToggle;
