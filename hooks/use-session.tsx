import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useSession = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher, {
    onErrorRetry: () => false,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useSession;
