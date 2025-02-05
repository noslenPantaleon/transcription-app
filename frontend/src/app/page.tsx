import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import UploadForm from "./components/uploadForm";
import { getTranscriptions } from "./services/getTranscriptions";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["transcriptions"],
    queryFn: getTranscriptions,
  });
  return (
    <div className="min-h-screen grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <UploadForm />
        </HydrationBoundary>
      </main>
    </div>
  );
}
