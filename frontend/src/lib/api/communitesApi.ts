import type { Community, Building } from "@/types";
import api from "@/lib/api/apiConfig";

export const communitiesAPI = {
  getCommunities: async (): Promise<Community[]> =>
    (await api.get("/communities")).data,
  getManagedCommunities: async (): Promise<Community[]> =>
    (await api.get("/communities/manage")).data,
  getBuildings: async (communityId: string): Promise<Building[]> =>
    (await api.get(`/communities/${communityId}/buildings`)).data,
  createCommunity: async (name: string): Promise<Community> =>
    (await api.post("/communities", { name })).data,
  updateCommunity: async (
    communityId: string,
    name: string,
  ): Promise<Community> =>
    (await api.patch(`/communities/${communityId}`, { name })).data,
  deleteCommunity: async (communityId: string): Promise<void> => {
    await api.delete(`/communities/${communityId}`);
  },
  createBuilding: async (
    communityId: string,
    data: { name: string; total_flat_count: number },
  ): Promise<Building> =>
    (await api.post(`/communities/${communityId}/buildings`, data)).data,
  updateBuilding: async (
    buildingId: string,
    data: { name?: string; total_flat_count?: number },
  ): Promise<Building> =>
    (await api.patch(`/communities/buildings/${buildingId}`, data)).data,
  deleteBuilding: async (buildingId: string): Promise<void> => {
    await api.delete(`/communities/buildings/${buildingId}`);
  },
};
