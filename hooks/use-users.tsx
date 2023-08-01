"use client";
import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useUsers = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/users", fetcher, {
    onErrorRetry: () => false,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useUsers;
