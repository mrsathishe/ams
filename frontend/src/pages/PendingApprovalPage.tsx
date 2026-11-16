import { useState } from "react";
import { useAuth } from "../../lib/auth";

export default function PendingApprovalPage() {
  const { user, refreshUser, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const checkStatus = async () => {
    setIsRefreshing(true);
    setMessage("");
    const updatedUser = await refreshUser();
    setIsRefreshing(false);
    if (
      updatedUser?.approval_status === "approved" ||
      updatedUser?.is_super_admin
    ) {
      window.location.assign(
        updatedUser.is_super_admin ? "/admin" : "/dashboard",
      );
    } else {
      setMessage("Your approval is still pending.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gray-50 px-4 py-10">
      <section className="w-full max-w-lg border-t-4 border-emerald-700 bg-white p-7 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Kootukudil
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          Approval pending
        </h1>
        <p className="mt-3 text-gray-600">
          {user?.name ? `${user.name}, ` : ""}your account needs approval before
          you can access apartment information.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          You can check again after your membership has been reviewed.
        </p>
        {user?.memberships
          .filter((membership) => membership.status === "pending")
          .map((membership) => (
            <div
              key={membership.id}
              className="mt-5 border-t border-gray-200 pt-4"
            >
              <p className="font-medium text-gray-900">
                {membership.apartment_name} · Flat {membership.flat_name}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {membership.relationship} membership · Approval required from{" "}
                {membership.approval_required_by}.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Eligible approvers:{" "}
                {membership.eligible_approver_names.length
                  ? membership.eligible_approver_names.join(", ")
                  : "No eligible approver is registered yet. A Super Admin can approve this membership."}
              </p>
            </div>
          ))}
        {user?.memberships
          .filter((membership) => membership.status === "pending")
          .map((membership) => (
            <div
              key={membership.id}
              className="mt-5 border-t border-gray-200 pt-4"
            >
              <p className="font-medium text-gray-900">
                {membership.apartment_name} · Flat {membership.flat_name}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {membership.relationship} membership · Approval required from{" "}
                {membership.approval_required_by}.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Eligible approvers:{" "}
                {membership.eligible_approver_names.length
                  ? membership.eligible_approver_names.join(", ")
                  : "No eligible approver is registered yet. A Super Admin can approve this membership."}
              </p>
            </div>
          ))}
        {message && (
          <p role="status" className="mt-4 text-sm text-amber-800">
            {message}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={checkStatus}
            disabled={isRefreshing}
            className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {isRefreshing ? "Checking..." : "Check approval"}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      </section>
    </main>
  );
}
