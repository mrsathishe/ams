import { useEffect, useState } from "react";
import { communitiesAPI } from "@/lib/api/communitesApi";
import { apiErrorMessage } from "@/lib/api/apiError";
import { Building } from "@/types";
import { usePropertyStore } from "@/lib/state-management/communityStore";

export function usePropertyOptions(communityId: string) {
  // const [communities, setCommunities] = useState<Community[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  // const [communityError, setCommunityError] = useState("");
  const [buildingError, setBuildingError] = useState("");
  // const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  const communities = usePropertyStore((state) => state.communities);
  const loadingCommunities = usePropertyStore((state) => state.isLoading);
  const communityError = usePropertyStore((state) => state.error);
  const fetchCommunities = usePropertyStore((state) => state.fetchCommunities);
  // const selectedCommunityId = usePropertyStore((state) => state.selectedCommunityId);
  // const setSelectedCommunity = usePropertyStore((state) => state.setSelectedCommunity);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  useEffect(() => {
    let active = true;
    if (!communityId) {
      setBuildings([]);
      setBuildingError("");
      setLoadingBuildings(false);
      return;
    }

    setBuildings([]);
    setBuildingError("");
    setLoadingBuildings(true);

    communitiesAPI
      .getBuildings(communityId)
      .then((items) => active && setBuildings(items))
      .catch(
        (err) =>
          active &&
          setBuildingError(apiErrorMessage(err, "Could not load buildings.")),
      )
      .finally(() => active && setLoadingBuildings(false));

    return () => {
      active = false;
    };
  }, [communityId]);

  return {
    communities,
    buildings,
    communityError,
    buildingError,
    loadingCommunities,
    loadingBuildings,
  };
}
