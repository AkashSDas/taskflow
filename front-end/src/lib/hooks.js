import { useQuery } from "react-query";
import { getNewAccessToken } from "../services/auth";

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
