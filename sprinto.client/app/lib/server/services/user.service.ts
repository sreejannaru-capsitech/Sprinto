import { useQuery } from "@tanstack/react-query";
import { getMe } from "../auth.api";
import { PROFILE_KEY } from "~/lib/const";

export const useProfileQuery = () => {
  return useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getMe,
    staleTime: 55 * 60 * 1000, // 55 minutes
  });
};
