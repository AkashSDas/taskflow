import { useQuery } from "react-query";
import { getNewAccessToken } from "../services/auth";
import { getAllTask } from "../services/task";

export function useUser() {
  var { data, error } = useQuery("new-access-token", getNewAccessToken, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  return {
    loading: !data && !error,
    error: error || data?.error,
    user: data?.user,
    accessToken: data?.accessToken,
    success: data?.success,
  };
}

export function useTasks() {
  var { accessToken } = useUser();
  var { data, error, isFetching } = useQuery(
    "tasks",
    () => getAllTask(accessToken),
    {
      enabled: accessToken != null,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );

  return {
    loading: !data && !error && isFetching,
    error: error || data?.error,
    tasks: data?.tasks,
    success: data?.success,
  };
}
