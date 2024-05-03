import { getDiaryList } from "@/app/_api/diary";
import DiaryList from "@/app/diary/_components/DiaryList";
import { DIARY_PAGE_SIZE } from "@/app/diary/(diary)/constant";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { container, root } from "./style.css";
import { getPets } from "@/app/_api/pets";
import SelectPet from "@/app/_components/SelectPet";

const MyPetDiaryPage = async () => {
  const queryClient = new QueryClient();
  const petId = Number(cookies().get("petId")?.value);
  if (petId)
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["diaries", petId],
      queryFn: ({ pageParam }) => getDiaryList({ page: pageParam, size: DIARY_PAGE_SIZE }),
      initialPageParam: 0,
    });

  if (!petId) await queryClient.prefetchQuery({ queryKey: ["pets"], queryFn: () => getPets() });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={root}>
      <HydrationBoundary state={dehydratedState}>
        <div className={container}>{petId ? <DiaryList petId={petId} /> : <SelectPet type="육아일기" path="/diary/my-pet" />}</div>
      </HydrationBoundary>
    </div>
  );
};

export default MyPetDiaryPage;
