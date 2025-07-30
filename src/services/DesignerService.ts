import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD, MESSAGE } from "@/constants";

// Define types for timeline data
interface TimelineRequest {
  designerID?: string;
  startDate?: string;
  endDate?: string;
}

interface TimelineResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  responseRequestModel: {
    progressTimelineItems: ProgressTimelineItem[];
  };
}

interface ProgressTimelineItem {
  order: {
    orderID: string;
    designerID: string;
    orderStatus: string;
    note: string;
    deadlineAt: string;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
  };
  offer: {
    offerID: string;
    designerID: string;
    note: string;
    offerStatus: string;
  };
  offerPhases: OfferPhase[];
}

interface OfferPhase {
  offerPhaseID: string;
  offerID: string;
  phase: number;
  phaseName: string;
  phaseDescription: string;
  offerPhaseStatus: string;
  progressCount: number;
  startDate: string;
  endDate: string;
  modifyDate: string;
}

const DesignerService = () => {
  const { callApi, loading, setIsLoading } = useApiService();

  const getTimeline = useCallback(
    async (values: TimelineRequest): Promise<TimelineResponse | undefined> => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_TIMELINE,
          values
        );
        return res;
      } catch (err: unknown) {
        const error = err as { response?: { data?: string } };
        toast.error(error?.response?.data || MESSAGE.GET_TIMELINE_FAILED);
      }
    },
    [callApi]
  );

  return { getTimeline, loading, setIsLoading };
};

export default DesignerService;
