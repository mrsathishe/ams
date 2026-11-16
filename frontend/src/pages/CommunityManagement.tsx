import { FormEvent, useEffect, useState } from "react";
import { communitiesAPI } from "@/lib/api/communitesApi";
import { apiErrorMessage } from "@/lib/api/apiError";
import { Building, Community } from "@/types";

export default function CommunityManagement({
  onClose,
}: {
  onClose: () => void;
}) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [communityName, setCommunityName] = useState("");
  const [editingCommunityId, setEditingCommunityId] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildingCapacity, setBuildingCapacity] = useState("");
  const [editingBuildingId, setEditingBuildingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    communitiesAPI
      .getManagedCommunities()
      .then((items) => {
        if (!active) return;
        setCommunities(items);
        setSelectedCommunityId(items[0]?.id || "");
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(
            apiErrorMessage(requestError, "Could not load communities."),
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!selectedCommunityId) {
      setBuildings([]);
      return;
    }
    communitiesAPI
      .getBuildings(selectedCommunityId)
      .then((items) => {
        if (active) setBuildings(items);
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(
            apiErrorMessage(
              requestError,
              "Could not load community buildings.",
            ),
          );
      });
    return () => {
      active = false;
    };
  }, [selectedCommunityId]);

  const reloadCommunities = async (selection = selectedCommunityId) => {
    const items = await communitiesAPI.getManagedCommunities();
    setCommunities(items);
    const nextSelection = items.some((item) => item.id === selection)
      ? selection
      : items[0]?.id || "";
    setSelectedCommunityId(nextSelection);
  };

  const submitCommunity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      if (editingCommunityId) {
        const updated = await communitiesAPI.updateCommunity(
          editingCommunityId,
          communityName,
        );
        setCommunities((items) =>
          items.map((item) => (item.id === updated.id ? updated : item)),
        );
        setSelectedCommunityId(updated.id);
        setMessage("Community updated.");
      } else {
        const created = await communitiesAPI.createCommunity(communityName);
        setCommunities((items) =>
          [...items, created].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setSelectedCommunityId(created.id);
        setMessage("Community created.");
      }
      setCommunityName("");
      setEditingCommunityId("");
    } catch (requestError: unknown) {
      setError(apiErrorMessage(requestError, "Could not save this community."));
    } finally {
      setIsSaving(false);
    }
  };

  const removeCommunity = async (community: Community) => {
    if (!window.confirm(`Delete community "${community.name}"?`)) return;
    setError("");
    setMessage("");
    try {
      await communitiesAPI.deleteCommunity(community.id);
      const next = communities.filter((item) => item.id !== community.id);
      setCommunities(next);
      if (selectedCommunityId === community.id) {
        setSelectedCommunityId(next[0]?.id || "");
      }
      if (editingCommunityId === community.id) {
        setEditingCommunityId("");
        setCommunityName("");
      }
      setMessage("Community deleted.");
    } catch (requestError: unknown) {
      setError(
        apiErrorMessage(
          requestError,
          "Could not delete the community. It may have associated users or records.",
        ),
      );
    }
  };

  const submitBuilding = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCommunityId) return;
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      if (editingBuildingId) {
        const updated = await communitiesAPI.updateBuilding(editingBuildingId, {
          name: buildingName,
          total_flat_count: Number(buildingCapacity),
        });
        setBuildings((items) =>
          items.map((item) => (item.id === updated.id ? updated : item)),
        );
        setMessage("Building updated.");
      } else {
        const created = await communitiesAPI.createBuilding(
          selectedCommunityId,
          {
            name: buildingName,
            total_flat_count: Number(buildingCapacity),
          },
        );
        setBuildings((items) =>
          [...items, created].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setMessage("Building created.");
      }
      await reloadCommunities();
      setBuildingName("");
      setBuildingCapacity("");
      setEditingBuildingId("");
    } catch (requestError: unknown) {
      setError(apiErrorMessage(requestError, "Could not save this building."));
    } finally {
      setIsSaving(false);
    }
  };

  const removeBuilding = async (building: Building) => {
    if (!window.confirm(`Delete building "${building.name}"?`)) return;
    setError("");
    setMessage("");
    try {
      await communitiesAPI.deleteBuilding(building.id);
      setBuildings((items) => items.filter((item) => item.id !== building.id));
      await reloadCommunities();
      if (editingBuildingId === building.id) {
        setEditingBuildingId("");
        setBuildingName("");
        setBuildingCapacity("");
      }
      setMessage("Building deleted.");
    } catch (requestError: unknown) {
      setError(
        apiErrorMessage(
          requestError,
          "Could not delete the building. It may have associated users or records.",
        ),
      );
    }
  };

  const selectedCommunity = communities.find(
    (item) => item.id === selectedCommunityId,
  );

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="community-management-title"
        className="mx-auto my-6 w-full max-w-5xl border border-emerald-200 bg-white p-5 shadow-xl sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Super Admin
            </p>
            <h2
              id="community-management-title"
              className="mt-1 text-xl font-semibold"
            >
              Community management
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage communities, buildings, and unit capacity.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mb-4 border-l-4 border-emerald-700 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {message}
          </p>
        )}

        {isLoading ? (
          <p className="py-8 text-center text-sm text-gray-600">
            Loading communities...
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="space-y-5">
              <form
                onSubmit={submitCommunity}
                className="space-y-3 border border-gray-200 p-4"
              >
                <h3 className="font-semibold">
                  {editingCommunityId ? "Edit community" : "Create community"}
                </h3>
                <label className="block text-sm font-medium">
                  Community / Apartment name
                  <input
                    required
                    maxLength={120}
                    value={communityName}
                    onChange={(event) => setCommunityName(event.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {isSaving
                      ? "Saving..."
                      : editingCommunityId
                        ? "Save community"
                        : "Create community"}
                  </button>
                  {editingCommunityId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCommunityId("");
                        setCommunityName("");
                      }}
                      className="rounded border border-gray-300 px-3 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <ul className="divide-y divide-gray-200 border border-gray-200">
                {communities.length === 0 && (
                  <li className="p-4 text-sm text-gray-500">
                    No communities yet.
                  </li>
                )}
                {communities.map((community) => (
                  <li
                    key={community.id}
                    className={`p-3 ${selectedCommunityId === community.id ? "bg-emerald-50" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCommunityId(community.id)}
                      className="w-full text-left"
                    >
                      <span className="block font-medium">
                        {community.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {community.total_building_count} buildings ·{" "}
                        {community.total_flat_count} units · {community.status}
                      </span>
                    </button>
                    <div className="mt-2 flex gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCommunityId(community.id);
                          setEditingCommunityId(community.id);
                          setCommunityName(community.name);
                        }}
                        className="text-emerald-800 underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeCommunity(community)}
                        className="text-red-700 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  {selectedCommunity
                    ? `${selectedCommunity.name} buildings`
                    : "Buildings"}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Configure the number of units for each building. Units are
                  created as residents register with their flat or unit number.
                </p>
              </div>

              {selectedCommunity ? (
                <>
                  <form
                    onSubmit={submitBuilding}
                    className="grid gap-3 border border-gray-200 p-4 sm:grid-cols-[1fr_150px_auto]"
                  >
                    <label className="text-sm font-medium">
                      Building / Block
                      <input
                        required
                        maxLength={120}
                        value={buildingName}
                        onChange={(event) =>
                          setBuildingName(event.target.value)
                        }
                        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium">
                      Total units
                      <input
                        required
                        type="number"
                        min="1"
                        max="5000"
                        value={buildingCapacity}
                        onChange={(event) =>
                          setBuildingCapacity(event.target.value)
                        }
                        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                      >
                        {editingBuildingId ? "Save" : "Add"}
                      </button>
                      {editingBuildingId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBuildingId("");
                            setBuildingName("");
                            setBuildingCapacity("");
                          }}
                          className="rounded border border-gray-300 px-3 py-2 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  <ul className="divide-y divide-gray-200 border border-gray-200">
                    {buildings.length === 0 && (
                      <li className="p-4 text-sm text-gray-500">
                        No buildings added yet.
                      </li>
                    )}
                    {buildings.map((building) => (
                      <li
                        key={building.id}
                        className="flex flex-wrap items-center justify-between gap-3 p-3"
                      >
                        <div>
                          <p className="font-medium">{building.name}</p>
                          <p className="text-xs text-gray-500">
                            {building.flat_count} of {building.total_flat_count}{" "}
                            units registered
                          </p>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBuildingId(building.id);
                              setBuildingName(building.name);
                              setBuildingCapacity(
                                String(building.total_flat_count),
                              );
                            }}
                            className="text-emerald-800 underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void removeBuilding(building)}
                            className="text-red-700 underline"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="border border-gray-200 p-4 text-sm text-gray-500">
                  Select or create a community to manage its buildings.
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
