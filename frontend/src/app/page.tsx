import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranscriptions } from "@/services/getTranscriptions";
import TranscriptionsDashboard from "@/components/TranscriptionsDashboard";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["transcriptions"],
    queryFn: getTranscriptions,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="min-h-screen items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <HydrationBoundary state={dehydratedState}>
          <TranscriptionsDashboard />
        </HydrationBoundary>
      </main>
    </div>
  );
}
