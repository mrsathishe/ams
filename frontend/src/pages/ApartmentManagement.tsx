import { FormEvent, useEffect, useState } from "react";
import { apartmentsAPI } from "../../lib/api";
import { apiErrorMessage } from "../../lib/api-error";
import { ApartmentMember, Flat, User } from "../../types";

interface ApartmentManagementProps {
  apartmentId: string;
  user: User;
  onClose: () => void;
  onStatus: (message: string, isError?: boolean) => void;
}

export default function ApartmentManagement({
  apartmentId,
  user,
  onClose,
  onStatus,
}: ApartmentManagementProps) {
  const [members, setMembers] = useState<ApartmentMember[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [apartmentName, setApartmentName] = useState("");
  const [flatCount, setFlatCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const activeMembership = user.memberships.find(
    (membership) =>
      membership.apartment_id === apartmentId &&
      membership.status === "approved",
  );
  const canRequestApartmentChanges = Boolean(
    user.is_super_admin || activeMembership?.permissions.can_manage_apartment,
  );

  useEffect(() => {
    let active = true;
    void Promise.all([
      apartmentsAPI.getMemberships(apartmentId),
      apartmentsAPI.getFlats(apartmentId),
    ])
      .then(([memberData, flatData]) => {
        if (!active) return;
        setMembers(memberData);
        setFlats(flatData);
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            apiErrorMessage(error, "Could not load apartment settings."),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [apartmentId]);

  const updatePermission = async (
    member: ApartmentMember,
    key: keyof ApartmentMember["permissions"],
    value: boolean,
  ) => {
    try {
      await apartmentsAPI.updatePermissions(member.id, { [key]: value });
      setMembers((current) =>
        current.map((item) =>
          item.id === member.id
            ? { ...item, permissions: { ...item.permissions, [key]: value } }
            : item,
        ),
      );
      onStatus("Membership permissions updated.");
    } catch (error: unknown) {
      onStatus(apiErrorMessage(error, "Could not update permissions."), true);
    }
  };

  const updateFlat = async (flat: Flat, enabled: boolean) => {
    try {
      await apartmentsAPI.setIndividualEB(flat.id, enabled);
      setFlats((current) =>
        current.map((item) =>
          item.id === flat.id
            ? { ...item, individual_eb_enabled: enabled }
            : item,
        ),
      );
      onStatus("Individual EB setting updated.");
    } catch (error: unknown) {
      onStatus(
        apiErrorMessage(error, "Could not update the flat setting."),
        true,
      );
    }
  };

  const updatePolicy = async (
    flat: Flat,
    policy: Flat["tenant_membership_approval"],
  ) => {
    try {
      await apartmentsAPI.updateFlatPolicy(flat.id, policy);
      setFlats((current) =>
        current.map((item) =>
          item.id === flat.id
            ? { ...item, tenant_membership_approval: policy }
            : item,
        ),
      );
      onStatus("Tenant approval policy updated.");
    } catch (error: unknown) {
      onStatus(
        apiErrorMessage(error, "Could not update the approval policy."),
        true,
      );
    }
  };

  const submitApartmentChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const changes: { name?: string; total_flat_count?: number } = {};
    if (apartmentName.trim()) changes.name = apartmentName.trim();
    if (flatCount) changes.total_flat_count = Number(flatCount);
    if (Object.keys(changes).length === 0) return;
    try {
      const result = await apartmentsAPI.requestChange(apartmentId, changes);
      setApartmentName("");
      setFlatCount("");
      onStatus(
        result.status === "pending"
          ? `Change submitted for ${result.required_approvals} Owner approvals.`
          : "Apartment updated.",
      );
    } catch (error: unknown) {
      onStatus(
        apiErrorMessage(error, "Could not submit apartment changes."),
        true,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-black/40 p-3 sm:p-6">
      <section className="mx-auto my-4 max-w-5xl border border-gray-200 bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Kootukudil
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              Apartment membership and access
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            Close
          </button>
        </header>
        <div className="space-y-8 p-5">
          {loadError && (
            <p
              role="alert"
              className="border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-700"
            >
              {loadError}
            </p>
          )}
          {loading ? (
            <p className="text-sm text-gray-600">
              Loading apartment settings...
            </p>
          ) : (
            <>
              <section>
                <h3 className="font-semibold">Members</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="py-2 pr-3">Member</th>
                        <th className="py-2 pr-3">Flat</th>
                        <th className="py-2 pr-3">Relationship</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2">Permissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => {
                        const canManageMember =
                          user.is_super_admin ||
                          (activeMembership?.relationship === "Owner" &&
                            activeMembership.flat_id === member.flat_id &&
                            member.relationship === "Tenant");
                        const canSetApartmentPermission =
                          user.is_super_admin &&
                          member.relationship === "Owner";
                        return (
                          <tr
                            key={member.id}
                            className="border-b border-gray-100 align-top"
                          >
                            <td className="py-3 pr-3">
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-gray-500">
                                {member.email}
                              </p>
                            </td>
                            <td className="py-3 pr-3">{member.flat_name}</td>
                            <td className="py-3 pr-3">{member.relationship}</td>
                            <td className="py-3 pr-3">{member.status}</td>
                            <td className="space-y-2 py-3">
                              {(
                                [
                                  ["can_view_common_eb", "View Common EB"],
                                  [
                                    "can_view_individual_eb",
                                    "View Individual EB",
                                  ],
                                  ["can_add_eb", "Add EB records"],
                                ] as const
                              ).map(([key, label]) => (
                                <label
                                  key={key}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <input
                                    type="checkbox"
                                    checked={member.permissions[key]}
                                    disabled={
                                      member.status !== "approved" ||
                                      !canManageMember
                                    }
                                    onChange={(event) =>
                                      void updatePermission(
                                        member,
                                        key,
                                        event.target.checked,
                                      )
                                    }
                                  />
                                  {label}
                                </label>
                              ))}
                              {canSetApartmentPermission && (
                                <label className="flex items-center gap-2 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={
                                      member.permissions.can_manage_apartment
                                    }
                                    disabled={member.status !== "approved"}
                                    onChange={(event) =>
                                      void updatePermission(
                                        member,
                                        "can_manage_apartment",
                                        event.target.checked,
                                      )
                                    }
                                  />
                                  Manage apartment
                                </label>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {members.length === 0 && (
                    <p className="py-4 text-sm text-gray-500">
                      No memberships found.
                    </p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="font-semibold">Flat settings</h3>
                <div className="mt-3 divide-y divide-gray-100 border-y border-gray-200">
                  {flats.map((flat) => {
                    const canManageFlat =
                      user.is_super_admin ||
                      user.memberships.some(
                        (membership) =>
                          membership.flat_id === flat.id &&
                          membership.relationship === "Owner" &&
                          membership.status === "approved",
                      );
                    return (
                      <div
                        key={flat.id}
                        className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                      >
                        <div>
                          <p className="font-medium">Flat {flat.name}</p>
                          <p className="text-xs text-gray-500">{flat.id}</p>
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={flat.individual_eb_enabled}
                            disabled={!canManageFlat}
                            onChange={(event) =>
                              void updateFlat(flat, event.target.checked)
                            }
                          />
                          Individual EB enabled
                        </label>
                        <label className="text-sm">
                          Tenant membership approval
                          <select
                            value={flat.tenant_membership_approval}
                            disabled={!canManageFlat}
                            onChange={(event) =>
                              void updatePolicy(
                                flat,
                                event.target
                                  .value as Flat["tenant_membership_approval"],
                              )
                            }
                            className="mt-1 block w-full rounded border border-gray-300 bg-white px-2 py-1.5 disabled:bg-gray-100"
                          >
                            <option value="owner">Owner</option>
                            <option value="tenant">Tenant</option>
                            <option value="owner_or_tenant">
                              Owner or Tenant
                            </option>
                          </select>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>

              {canRequestApartmentChanges && (
                <section>
                  <h3 className="font-semibold">Apartment details</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Owner changes require approval from two other Owners, or one
                    when there are exactly two Owners.
                  </p>
                  <form
                    onSubmit={submitApartmentChange}
                    className="mt-3 grid gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end"
                  >
                    <label className="text-sm">
                      New apartment name
                      <input
                        maxLength={120}
                        value={apartmentName}
                        onChange={(event) =>
                          setApartmentName(event.target.value)
                        }
                        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm">
                      Total flats
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={flatCount}
                        onChange={(event) => setFlatCount(event.target.value)}
                        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <button
                      type="submit"
                      className="rounded bg-emerald-700 px-3 py-2 text-sm font-medium text-white"
                    >
                      Submit change
                    </button>
                  </form>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
