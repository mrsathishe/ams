import {
  ApartmentRegistrationOption,
  Apartment,
  Flat,
  ApartmentMember,
} from "@/types";
import api from "./apiConfig";

export const apartmentsAPI = {
  getRegistrationOptions: async (): Promise<ApartmentRegistrationOption[]> => {
    const response = await api.get("/apartments/registration-options");
    return response.data;
  },
  getUserApartments: async (): Promise<Apartment[]> => {
    const response = await api.get("/apartments");
    return response.data;
  },
  getFlats: async (apartmentId: string): Promise<Flat[]> =>
    (await api.get(`/apartments/${apartmentId}/flats`)).data,
  getMemberships: async (apartmentId: string): Promise<ApartmentMember[]> =>
    (await api.get(`/apartments/${apartmentId}/memberships`)).data,
  updatePermissions: async (
    membershipId: string,
    permissions: Partial<ApartmentMember["permissions"]>,
  ) =>
    (await api.patch(`/memberships/${membershipId}/permissions`, permissions))
      .data,
  updateFlatPolicy: async (
    flatId: string,
    policy: Flat["tenant_membership_approval"],
  ) =>
    (
      await api.patch(
        `/apartments/flats/${flatId}/membership-approval-policy`,
        { tenant_membership_approval: policy },
      )
    ).data,
  setIndividualEB: async (flatId: string, enabled: boolean) =>
    (await api.patch(`/flats/${flatId}/individual-eb`, { enabled })).data,
  requestChange: async (
    apartmentId: string,
    changes: { name?: string; total_flat_count?: number },
  ) =>
    (await api.post(`/apartments/${apartmentId}/change-requests`, changes))
      .data,
  getChanges: async (apartmentId: string) =>
    (await api.get(`/apartments/${apartmentId}/change-requests`)).data,
};
