import { create } from "zustand";
import { communitiesAPI } from "@/lib/api/communitesApi";
import { apiErrorMessage } from "@/lib/api/apiError";

export interface Community {
  id: string;
  name: string;
}

interface PropertyStore {
  communities: Community[];
  selectedCommunityId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchCommunities: () => Promise<void>;
  setSelectedCommunity: (id: string) => void;
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  communities: [],
  selectedCommunityId: null,
  isLoading: false,
  error: null,

  fetchCommunities: async () => {
    // Return early if already cached or currently fetching
    const { communities, isLoading } = get();
    if (communities.length > 0 || isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const data = await communitiesAPI.getCommunities();
      set({ communities: data, isLoading: false });
    } catch (err) {
      set({
        error: apiErrorMessage(err, "Could not load communities."),
        isLoading: false,
      });
    }
  },

  setSelectedCommunity: (id) => set({ selectedCommunityId: id }),
}));
