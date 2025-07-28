import { STALE_TIME, STATUSES_KEY } from "~/lib/const";
import { getStatuses } from "../task.api";
import { useQuery } from "@tanstack/react-query";

export const useStatusesQuery = () => {
  return useQuery({
    queryKey: [STATUSES_KEY],
    queryFn: getStatuses,
    staleTime: STALE_TIME,
  });
};
