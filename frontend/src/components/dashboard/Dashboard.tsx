import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { apartmentsAPI } from "@/lib/api/apartmentsApi";
import { ebAPI } from "@/lib/api/ebApi";
import { approvalsAPI } from "@/lib/api/approvalsApi";
import { apiErrorMessage } from "@/lib/api/apiError";
import { EBAccount, EBBill, EBPayment, Flat, PendingApproval } from "@/types";
import ApartmentManagement from "@/Pages/ApartmentManagement";
import CommunityManagement from "@/Pages/CommunityManagement";
import Header from "./Header";
import Sidebar, { NavSection } from "./Sidebar";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function Dashboard() {
  const {
    user,
    apartments,
    activeApartmentId,
    selectApartment,
    refreshUser,
    logout,
  } = useAuth();

  const [activeNav, setActiveNav] = useState<NavSection>("eb");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [accounts, setAccounts] = useState<EBAccount[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [accountId, setAccountId] = useState("");
  const [bills, setBills] = useState<EBBill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showBillForm, setShowBillForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showApartmentManagement, setShowApartmentManagement] = useState(false);
  const [showCommunityManagement, setShowCommunityManagement] = useState(false);
  const [paymentBillId, setPaymentBillId] = useState("");
  const [editingPayment, setEditingPayment] = useState<EBPayment | null>(null);
  const [editingBill, setEditingBill] = useState<EBBill | null>(null);
  const [accountType, setAccountType] = useState<"common" | "individual">(
    "common",
  );
  const [selectedFlatId, setSelectedFlatId] = useState("");
  const [billForm, setBillForm] = useState({
    period_start: "",
    period_end: "",
    opening_balance: "0",
    bill_amount: "",
    description: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_date: "",
    payment_method: "",
  });

  const activeMembership = useMemo(
    () =>
      user?.memberships.find(
        (membership) =>
          membership.apartment_id === activeApartmentId &&
          membership.status === "approved",
      ),
    [activeApartmentId, user],
  );
  const canAddEB = Boolean(
    user?.is_super_admin || activeMembership?.permissions.can_add_eb,
  );
  const canManageApartment = Boolean(
    user?.is_super_admin || activeMembership?.relationship === "Owner",
  );
  const selectedAccount = accounts.find((account) => account.id === accountId);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError("");
    setAccounts([]);
    setAccountId("");
    setBills([]);
    if (!activeApartmentId) {
      setIsLoading(false);
      return;
    }
    ebAPI
      .getAccounts()
      .then((data) => {
        if (!active) return;
        setAccounts(data);
        setAccountId(data[0]?.id || "");
      })
      .catch(() => {
        if (active) setError("Could not load EB accounts for this apartment.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeApartmentId]);

  useEffect(() => {
    let active = true;
    if (!activeApartmentId) {
      setFlats([]);
      return;
    }
    apartmentsAPI
      .getFlats(activeApartmentId)
      .then((items) => {
        if (active) setFlats(items);
      })
      .catch(() => {
        if (active) setFlats([]);
      });
    return () => {
      active = false;
    };
  }, [activeApartmentId]);

  useEffect(() => {
    let active = true;
    approvalsAPI
      .getPending()
      .then((items) => {
        if (active) setApprovals(items);
      })
      .catch(() => {
        if (active) setApprovals([]);
      });
    return () => {
      active = false;
    };
  }, [activeApartmentId]);

  useEffect(() => {
    let active = true;
    setBills([]);
    if (!accountId) return;
    ebAPI
      .getBills(accountId)
      .then((data) => {
        if (active) setBills(data);
      })
      .catch(() => {
        if (active) setError("Could not load EB bills.");
      });
    return () => {
      active = false;
    };
  }, [accountId]);

  const reload = async () => {
    if (!activeApartmentId) return;
    const updatedAccounts = await ebAPI.getAccounts();
    setAccounts(updatedAccounts);
    const nextAccount =
      updatedAccounts.find((account) => account.id === accountId) ||
      updatedAccounts[0];
    setAccountId(nextAccount?.id || "");
    if (nextAccount) setBills(await ebAPI.getBills(nextAccount.id));
  };

  const submitAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const account = await ebAPI.createAccount({
        account_type: accountType,
        flat_id:
          accountType === "individual"
            ? selectedFlatId ||
              flats.find((flat) =>
                user?.memberships.some(
                  (membership) =>
                    membership.flat_id === flat.id &&
                    membership.status === "approved" &&
                    membership.permissions.can_add_eb,
                ),
              )?.id
            : undefined,
      });
      setShowAccountForm(false);
      setMessage("EB account created.");
      await reload();
      setAccountId(account.id);
    } catch (requestError: unknown) {
      setError(apiErrorMessage(requestError, "Could not create EB account."));
    }
  };

  const submitBill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accountId) return;
    setError("");
    try {
      const result = await ebAPI.createBill(accountId, {
        period_start: billForm.period_start,
        period_end: billForm.period_end,
        opening_balance: Number(billForm.opening_balance),
        bill_amount: Number(billForm.bill_amount),
        description: billForm.description || undefined,
      });
      setShowBillForm(false);
      setMessage(
        result.status === "pending"
          ? "Bill submitted for Owner approval."
          : "Bill added.",
      );
      setBillForm({
        period_start: "",
        period_end: "",
        opening_balance: "0",
        bill_amount: "",
        description: "",
      });
      await reload();
    } catch (requestError: unknown) {
      setError(apiErrorMessage(requestError, "Could not save this bill."));
    }
  };

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const paymentData = {
        amount: Number(paymentForm.amount),
        payment_date: new Date(
          `${paymentForm.payment_date}T00:00:00`,
        ).toISOString(),
        payment_method: paymentForm.payment_method || undefined,
      };
      if (editingPayment)
        await ebAPI.updatePayment(editingPayment.id, paymentData);
      else await ebAPI.addPayment(paymentBillId, paymentData);
      setPaymentBillId("");
      setEditingPayment(null);
      setPaymentForm({ amount: "", payment_date: "", payment_method: "" });
      setMessage("Payment recorded.");
      await reload();
    } catch (requestError: unknown) {
      setError(apiErrorMessage(requestError, "Could not record this payment."));
    }
  };

  const submitBillEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingBill) return;
    try {
      const result = await ebAPI.updateBill(editingBill.id, {
        bill_amount: Number(billForm.bill_amount),
        description: billForm.description,
      });
      setEditingBill(null);
      setMessage(
        result.status === "pending"
          ? "Bill change submitted for Owner approval."
          : "Bill updated.",
      );
      await reload();
    } catch (requestError: unknown) {
      setError(apiErrorMessage(requestError, "Could not update this bill."));
    }
  };

  const formatPeriod = (bill: EBBill) =>
    `${bill.period_start} to ${bill.period_end}`;

  const approveRequest = async (item: PendingApproval) => {
    setError("");
    if (
      item.apartment_id &&
      apartments.some((apartment) => apartment.id === item.apartment_id)
    ) {
      selectApartment(item.apartment_id);
    }
    try {
      const result = await approvalsAPI.approve(item.id);
      setMessage(
        result.status === "pending"
          ? "Approval recorded. More approvals are still required."
          : "Request approved.",
      );
      await refreshUser();
      setApprovals(await approvalsAPI.getPending());
      await reload();
    } catch (requestError: unknown) {
      setError(
        apiErrorMessage(requestError, "Could not approve this request."),
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header
        user={user}
        apartments={apartments}
        activeApartmentId={activeApartmentId}
        onSelectApartment={selectApartment}
        approvals={approvals}
        onToggleMobileSidebar={() =>
          setIsMobileSidebarOpen(!isMobileSidebarOpen)
        }
        onOpenCommunity={() => setShowCommunityManagement(true)}
        onNavigateProfile={() => setActiveNav("profile")}
        onLogout={logout}
      />

      <div className="flex flex-1">
        <Sidebar
          activeNav={activeNav}
          onSelectNav={(nav) => {
            setActiveNav(nav);
            if (nav === "community") setShowCommunityManagement(true);
          }}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-x-hidden">
          {activeNav === "eb" ? (
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
              {!activeApartmentId && (
                <p className="border-l-4 border-amber-500 bg-white p-4 text-sm">
                  No approved apartment is available for this account yet.
                </p>
              )}
              {error && (
                <p
                  role="alert"
                  className="mb-4 border-l-4 border-red-600 bg-white p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}
              {message && (
                <p
                  role="status"
                  className="mb-4 border-l-4 border-emerald-700 bg-white p-3 text-sm text-emerald-800"
                >
                  {message}
                </p>
              )}

              {approvals.length > 0 && (
                <section className="mb-6 border border-gray-200 bg-white">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <h2 className="font-semibold">
                      Requests awaiting your approval
                    </h2>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {approvals.map((item) => (
                      <li
                        key={`${item.type}-${item.id}`}
                        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">
                            {item.name} · {item.relationship}
                            {item.flat_name ? ` · Flat ${item.flat_name}` : ""}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {item.apartment_name} ·{" "}
                            {item.type.replace(/_/g, " ")}
                            {item.required_approvals
                              ? ` · ${item.approved_count || 0}/${item.required_approvals} approvals`
                              : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => approveRequest(item)}
                          className="rounded border border-emerald-700 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
                        >
                          Approve
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="font-semibold">
                    {selectedAccount?.name || "EB accounts"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedAccount?.account_type === "common"
                      ? "Shared by members of this apartment"
                      : "Private to the selected flat"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {accounts.length > 0 && (
                    <select
                      aria-label="EB account"
                      value={accountId}
                      onChange={(event) => setAccountId(event.target.value)}
                      className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {canManageApartment && activeApartmentId && (
                    <button
                      type="button"
                      onClick={() => setShowApartmentManagement(true)}
                      className="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Members &amp; settings
                    </button>
                  )}
                  {canAddEB && (
                    <button
                      type="button"
                      onClick={() => setShowAccountForm(true)}
                      className="rounded bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                    >
                      Add EB account
                    </button>
                  )}
                  {canAddEB && accounts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowBillForm(true)}
                      className="rounded border border-emerald-700 px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
                    >
                      Add bill
                    </button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <p className="py-10 text-center text-sm text-gray-600">
                  Loading EB accounts...
                </p>
              ) : accounts.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-600">
                  No EB accounts have been set up for this apartment.
                </p>
              ) : bills.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-600">
                  No bills have been recorded for this account.
                </p>
              ) : (
                <div className="space-y-5">
                  {bills.map((bill) => (
                    <article
                      key={bill.id}
                      className="border border-gray-200 bg-white"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 px-4 py-4">
                        <div>
                          <h3 className="font-semibold">
                            {formatPeriod(bill)}
                          </h3>
                          {bill.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {bill.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${bill.payment_status === "Paid" ? "bg-emerald-100 text-emerald-800" : bill.payment_status === "Partially Paid" ? "bg-amber-100 text-amber-900" : "bg-rose-100 text-rose-800"}`}
                        >
                          {bill.payment_status}
                        </span>
                      </div>
                      <dl className="grid grid-cols-2 gap-4 px-4 py-4 sm:grid-cols-5">
                        <Metric
                          label="Current bill"
                          value={money.format(bill.bill_amount)}
                        />
                        <Metric
                          label="Previous balance"
                          value={money.format(bill.previous_balance)}
                        />
                        <Metric
                          label="Total payable"
                          value={money.format(bill.total_payable)}
                        />
                        <Metric
                          label="Total paid"
                          value={money.format(bill.total_paid)}
                        />
                        <Metric
                          label="Remaining"
                          value={money.format(bill.closing_balance)}
                          emphasis
                        />
                      </dl>
                      <p className="px-4 pb-4 text-xs text-gray-500">
                        Total payable = previous balance + current bill. Total
                        paid is the sum of payment entries; remaining balance =
                        total payable − total paid.
                      </p>
                      <div className="border-t border-gray-200 px-4 py-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold">Payments</h4>
                          <div className="flex gap-2">
                            {bill.closing_balance > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPaymentBillId(bill.id);
                                  setPaymentForm({
                                    amount: "",
                                    payment_date: new Date()
                                      .toISOString()
                                      .slice(0, 10),
                                    payment_method: "",
                                  });
                                }}
                                className="rounded border border-emerald-700 px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-50"
                              >
                                Record payment
                              </button>
                            )}
                            {(user?.is_super_admin ||
                              activeMembership?.relationship === "Owner") && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingBill(bill);
                                  setBillForm({
                                    period_start: bill.period_start,
                                    period_end: bill.period_end,
                                    opening_balance: String(
                                      bill.opening_balance,
                                    ),
                                    bill_amount: String(bill.bill_amount),
                                    description: bill.description || "",
                                  });
                                }}
                                className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                              >
                                Request bill edit
                              </button>
                            )}
                          </div>
                        </div>
                        {bill.payments.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No payments recorded.
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px] text-left text-sm">
                              <thead className="text-xs uppercase text-gray-500">
                                <tr>
                                  <th className="py-2 pr-3">Paid by</th>
                                  <th className="py-2 pr-3">Amount</th>
                                  <th className="py-2 pr-3">Date</th>
                                  <th className="py-2">Method</th>
                                </tr>
                              </thead>
                              <tbody>
                                {bill.payments.map((payment) => (
                                  <tr
                                    key={payment.id}
                                    className="border-t border-gray-100"
                                  >
                                    <td className="py-2 pr-3">
                                      {payment.payer_name}
                                    </td>
                                    <td className="py-2 pr-3">
                                      {money.format(payment.amount)}
                                    </td>
                                    <td className="py-2 pr-3">
                                      {new Date(
                                        payment.payment_date,
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="py-2">
                                      {payment.payment_method || "—"}
                                    </td>
                                    <td className="py-2 text-right">
                                      {payment.paid_by === user?.id && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingPayment(payment);
                                            setPaymentBillId(payment.bill_id);
                                            setPaymentForm({
                                              amount: String(payment.amount),
                                              payment_date: new Date(
                                                payment.payment_date,
                                              )
                                                .toISOString()
                                                .slice(0, 10),
                                              payment_method:
                                                payment.payment_method || "",
                                            });
                                          }}
                                          className="text-xs font-medium text-emerald-800 underline"
                                        >
                                          Edit
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold capitalize text-gray-900">
                  {activeNav}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {activeNav} section content goes here.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Modals */}
      {(showAccountForm || showBillForm || paymentBillId || editingBill) && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4">
          <section className="my-6 w-full max-w-lg border border-gray-200 bg-white p-5 shadow-lg">
            {showAccountForm ? (
              <form className="space-y-4" onSubmit={submitAccount}>
                <h2 className="text-lg font-semibold">Add EB account</h2>
                <label className="block text-sm font-medium">
                  Account type
                  <select
                    value={accountType}
                    onChange={(event) =>
                      setAccountType(
                        event.target.value as "common" | "individual",
                      )
                    }
                    className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2"
                  >
                    <option value="common">Common EB</option>
                    <option value="individual">Individual EB</option>
                  </select>
                </label>
                {accountType === "individual" && (
                  <label className="block text-sm font-medium">
                    Flat
                    <select
                      required
                      value={selectedFlatId || ""}
                      onChange={(event) =>
                        setSelectedFlatId(event.target.value)
                      }
                      className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2"
                    >
                      <option value="">Select an enabled flat</option>
                      {flats
                        .filter(
                          (flat) =>
                            flat.individual_eb_enabled &&
                            (user?.is_super_admin ||
                              user?.memberships.some(
                                (membership) =>
                                  membership.flat_id === flat.id &&
                                  membership.status === "approved" &&
                                  membership.permissions.can_add_eb,
                              )),
                        )
                        .map((flat) => (
                          <option key={flat.id} value={flat.id}>
                            {flat.name}
                          </option>
                        ))}
                    </select>
                  </label>
                )}
                <ModalActions
                  onCancel={() => setShowAccountForm(false)}
                  submitLabel="Create account"
                />
              </form>
            ) : showBillForm || editingBill ? (
              <form
                className="space-y-4"
                onSubmit={editingBill ? submitBillEdit : submitBill}
              >
                <h2 className="text-lg font-semibold">
                  {editingBill ? "Request bill edit" : "Add EB bill"}
                </h2>
                {!editingBill && (
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm font-medium">
                      Period from
                      <input
                        required
                        type="date"
                        value={billForm.period_start}
                        onChange={(event) =>
                          setBillForm({
                            ...billForm,
                            period_start: event.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium">
                      Period to
                      <input
                        required
                        type="date"
                        value={billForm.period_end}
                        onChange={(event) =>
                          setBillForm({
                            ...billForm,
                            period_end: event.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                      />
                    </label>
                  </div>
                )}
                {!editingBill && (
                  <label className="block text-sm font-medium">
                    Opening balance (first bill only)
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={billForm.opening_balance}
                      onChange={(event) =>
                        setBillForm({
                          ...billForm,
                          opening_balance: event.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </label>
                )}
                <label className="block text-sm font-medium">
                  {editingBill
                    ? "Updated bill amount"
                    : "Current EB bill amount"}
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={billForm.bill_amount}
                    onChange={(event) =>
                      setBillForm({
                        ...billForm,
                        bill_amount: event.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Description (optional)
                  <input
                    maxLength={500}
                    value={billForm.description}
                    onChange={(event) =>
                      setBillForm({
                        ...billForm,
                        description: event.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  />
                </label>
                <ModalActions
                  onCancel={() => {
                    setShowBillForm(false);
                    setEditingBill(null);
                  }}
                  submitLabel={
                    editingBill ? "Submit for approval" : "Save bill"
                  }
                />
              </form>
            ) : (
              <form className="space-y-4" onSubmit={submitPayment}>
                <h2 className="text-lg font-semibold">
                  {editingPayment ? "Edit your payment" : "Record payment"}
                </h2>
                <label className="block text-sm font-medium">
                  Amount
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        amount: event.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Payment date
                  <input
                    required
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        payment_date: event.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Method (optional)
                  <input
                    maxLength={80}
                    value={paymentForm.payment_method}
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        payment_method: event.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  />
                </label>
                <ModalActions
                  onCancel={() => {
                    setPaymentBillId("");
                    setEditingPayment(null);
                  }}
                  submitLabel={editingPayment ? "Save changes" : "Save payment"}
                />
              </form>
            )}
          </section>
        </div>
      )}

      {showApartmentManagement && activeApartmentId && user && (
        <ApartmentManagement
          apartmentId={activeApartmentId}
          user={user}
          onClose={() => setShowApartmentManagement(false)}
          onStatus={(nextMessage, isError = false) => {
            setMessage(isError ? "" : nextMessage);
            setError(isError ? nextMessage : "");
          }}
        />
      )}
      {showCommunityManagement && (
        <CommunityManagement
          onClose={() => {
            setShowCommunityManagement(false);
            void refreshUser();
          }}
        />
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd
        className={`mt-1 font-semibold ${emphasis ? "text-emerald-800" : "text-gray-900"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function ModalActions({
  onCancel,
  submitLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded border border-gray-300 px-3 py-2 text-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
      >
        {submitLabel}
      </button>
    </div>
  );
}
