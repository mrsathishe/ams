import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { api } from "../../api";
import { useSession } from "../../session";
import type {
  ApprovalItem,
  EBAccount,
  EBBill,
  EBPayment,
  Flat,
} from "../../types";
import {
  Attribution,
  BrandHeader,
  Choice,
  Chip,
  Field,
  Metric,
  Notice,
  PrimaryButton,
  SecondaryButton,
  SegmentButton,
  SmallButton,
  styles,
} from "../../ui";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function EBBillsRoute() {
  const {
    user,
    token,
    apartments,
    activeApartmentId,
    selectApartment,
    refresh,
    logout,
  } = useSession();
  const [accounts, setAccounts] = useState<EBAccount[]>([]);
  const [accountId, setAccountId] = useState("");
  const [bills, setBills] = useState<EBBill[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [accountType, setAccountType] = useState<"common" | "individual">(
    "common",
  );
  const [individualFlatId, setIndividualFlatId] = useState("");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);
  const [paymentBillId, setPaymentBillId] = useState("");
  const [editingPayment, setEditingPayment] = useState<EBPayment | null>(null);
  const [billForm, setBillForm] = useState({
    period_start: "",
    period_end: "",
    opening_balance: "0",
    bill_amount: "",
    description: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const activeMemberships = useMemo(
    () =>
      user?.memberships.filter(
        (membership) =>
          membership.apartment_id === activeApartmentId &&
          membership.status === "approved",
      ) || [],
    [activeApartmentId, user],
  );
  const canAddEB = Boolean(
    user?.is_super_admin ||
    activeMemberships.some((membership) => membership.permissions.can_add_eb),
  );
  const currentAccount = accounts.find((account) => account.id === accountId);
  const visibleApprovals =
    activeApartmentId || user?.is_super_admin ? approvals : [];
  const allowedIndividualFlats = flats.filter(
    (flat) =>
      flat.individual_eb_enabled &&
      (user?.is_super_admin ||
        activeMemberships.some(
          (membership) =>
            membership.flat_id === flat.id && membership.permissions.can_add_eb,
        )),
  );

  const loadAccounts = useCallback(async () => {
    if (!token || !activeApartmentId) return;
    const [nextAccounts, nextFlats] = await Promise.all([
      api.accounts(token, activeApartmentId),
      api.flats(token, activeApartmentId),
    ]);
    setAccounts(nextAccounts);
    setFlats(nextFlats);
    const nextAccount =
      nextAccounts.find((item) => item.id === accountId) || nextAccounts[0];
    setAccountId(nextAccount?.id || "");
    setBills(
      nextAccount
        ? await api.bills(token, activeApartmentId, nextAccount.id)
        : [],
    );
  }, [accountId, activeApartmentId, token]);

  useEffect(() => {
    if (!token || (!activeApartmentId && !user?.is_super_admin)) return;
    let active = true;
    api
      .pendingApprovals(token, activeApartmentId || null)
      .then((items) => {
        if (active) setApprovals(items);
      })
      .catch(() => {
        if (active) setApprovals([]);
      });
    return () => {
      active = false;
    };
  }, [activeApartmentId, token, user?.is_super_admin]);

  useEffect(() => {
    let mounted = true;
    if (!token || !activeApartmentId) {
      return;
    }
    void Promise.resolve()
      .then(() => {
        if (!mounted) return;
        setLoading(true);
        return loadAccounts();
      })
      .catch((requestError: Error) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [activeApartmentId, loadAccounts, token]);

  const reload = async () => {
    await loadAccounts();
  };

  const createAccount = async () => {
    if (!token || !activeApartmentId) return;
    setBusy(true);
    setError("");
    try {
      const flatId =
        accountType === "individual"
          ? individualFlatId || allowedIndividualFlats[0]?.id
          : undefined;
      await api.addAccount(token, activeApartmentId, {
        account_type: accountType,
        flat_id: flatId,
      });
      setShowAccountForm(false);
      setIndividualFlatId("");
      setMessage("EB account created.");
      await reload();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create account.",
      );
    } finally {
      setBusy(false);
    }
  };

  const createBill = async () => {
    if (!token || !activeApartmentId || !accountId) return;
    setBusy(true);
    setError("");
    try {
      const result = await api.addBill(token, activeApartmentId, accountId, {
        period_start: billForm.period_start,
        period_end: billForm.period_end,
        opening_balance: Number(billForm.opening_balance),
        bill_amount: Number(billForm.bill_amount),
        description: billForm.description.trim() || undefined,
      });
      setShowBillForm(false);
      setBillForm({
        period_start: "",
        period_end: "",
        opening_balance: "0",
        bill_amount: "",
        description: "",
      });
      setMessage(
        result.status === "pending"
          ? "Bill submitted for Owner approval."
          : "Bill saved.",
      );
      await reload();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save bill.",
      );
    } finally {
      setBusy(false);
    }
  };

  const savePayment = async () => {
    if (!token || !activeApartmentId || !paymentBillId) return;
    setBusy(true);
    setError("");
    try {
      const data = {
        amount: Number(paymentForm.amount),
        payment_date: new Date(
          `${paymentForm.payment_date}T00:00:00`,
        ).toISOString(),
        payment_method: paymentForm.payment_method.trim() || undefined,
      };
      if (editingPayment)
        await api.updatePayment(
          token,
          activeApartmentId,
          editingPayment.id,
          data,
        );
      else await api.addPayment(token, activeApartmentId, paymentBillId, data);
      setPaymentBillId("");
      setEditingPayment(null);
      setMessage(editingPayment ? "Payment updated." : "Payment recorded.");
      await reload();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save payment.",
      );
    } finally {
      setBusy(false);
    }
  };

  const approve = async (item: ApprovalItem) => {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      if (apartments.some((apartment) => apartment.id === item.apartment_id)) {
        await selectApartment(item.apartment_id);
      }
      const approvalScope = user?.is_super_admin ? null : item.apartment_id;
      const result = await api.approve(token, item.id, approvalScope);
      setMessage(
        result.status === "pending"
          ? "Approval recorded. More approvals are required."
          : "Request approved.",
      );
      await refresh();
      router.replace("/");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to approve request.",
      );
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator color="#14745b" />
        <Text style={styles.muted}>Loading EB accounts...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <BrandHeader
            subtitle={`Welcome, ${user?.name || "Member"}`}
            compact
          />
          <Text
            onPress={() => void logout().then(() => router.replace("/sign-in"))}
            style={styles.inlineLink}
          >
            Log out
          </Text>
        </View>
        {error ? <Notice text={error} type="error" /> : null}
        {message ? <Notice text={message} type="success" /> : null}

        {apartments.length > 0 && (
          <>
            <Text style={styles.label}>Apartment</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {apartments.map((apartment) => (
                <Chip
                  key={apartment.id}
                  label={
                    apartment.name || `Apartment ${apartment.id.slice(-6)}`
                  }
                  active={activeApartmentId === apartment.id}
                  onPress={() => void selectApartment(apartment.id)}
                />
              ))}
            </ScrollView>
          </>
        )}

        {visibleApprovals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requests awaiting approval</Text>
            {visibleApprovals.map((item) => (
              <View key={`${item.type}-${item.id}`} style={styles.listRow}>
                <View style={styles.flex}>
                  <Text style={styles.panelTitle}>
                    {item.name} · {item.relationship}
                    {item.flat_name ? ` · Flat ${item.flat_name}` : ""}
                  </Text>
                  <Text style={styles.muted}>
                    {item.apartment_name} · {item.type.replace(/_/g, " ")}
                    {item.required_approvals
                      ? ` · ${item.approved_count || 0}/${item.required_approvals}`
                      : ""}
                  </Text>
                </View>
                <SmallButton
                  label="Approve"
                  disabled={busy}
                  onPress={() => void approve(item)}
                />
              </View>
            ))}
          </View>
        )}

        {!activeApartmentId ? (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>No active apartment</Text>
            <Text style={styles.bodyText}>
              A Super Admin must approve the apartment before it can be
              selected.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.flex}>
                <Text style={styles.sectionTitle}>
                  {currentAccount?.name || "EB accounts"}
                </Text>
                <Text style={styles.muted}>
                  {currentAccount?.account_type === "common"
                    ? "Shared by this apartment"
                    : "Private to this flat"}
                </Text>
              </View>
              {canAddEB && (
                <SmallButton
                  label="Add account"
                  onPress={() => {
                    setAccountType("common");
                    setShowAccountForm((value) => !value);
                  }}
                />
              )}
            </View>

            {accounts.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
              >
                {accounts.map((account) => (
                  <Chip
                    key={account.id}
                    label={account.name}
                    active={account.id === accountId}
                    onPress={() => setAccountId(account.id)}
                  />
                ))}
              </ScrollView>
            )}

            {showAccountForm && (
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>Create EB account</Text>
                <View style={styles.row}>
                  <SegmentButton
                    label="Common EB"
                    active={accountType === "common"}
                    onPress={() => setAccountType("common")}
                  />
                  <SegmentButton
                    label="Individual EB"
                    active={accountType === "individual"}
                    onPress={() => setAccountType("individual")}
                  />
                </View>
                {accountType === "individual" &&
                  allowedIndividualFlats.map((flat) => (
                    <Choice
                      key={flat.id}
                      label={`Flat ${flat.name}`}
                      selected={individualFlatId === flat.id}
                      onPress={() => setIndividualFlatId(flat.id)}
                    />
                  ))}
                {accountType === "individual" &&
                  allowedIndividualFlats.length === 0 && (
                    <Text style={styles.muted}>
                      No enabled flat is available for Individual EB.
                    </Text>
                  )}
                <PrimaryButton
                  label="Create account"
                  disabled={
                    busy ||
                    (accountType === "individual" &&
                      !individualFlatId &&
                      allowedIndividualFlats.length === 0)
                  }
                  onPress={() => void createAccount()}
                />
              </View>
            )}

            {canAddEB && accounts.length > 0 && (
              <SecondaryButton
                label={showBillForm ? "Close bill form" : "Add bill"}
                onPress={() => setShowBillForm((value) => !value)}
              />
            )}
            {showBillForm && (
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>New EB bill</Text>
                <Field
                  label="Period from (YYYY-MM-DD)"
                  value={billForm.period_start}
                  onChangeText={(value) =>
                    setBillForm({ ...billForm, period_start: value })
                  }
                  placeholder="2026-01-01"
                />
                <Field
                  label="Period to (YYYY-MM-DD)"
                  value={billForm.period_end}
                  onChangeText={(value) =>
                    setBillForm({ ...billForm, period_end: value })
                  }
                  placeholder="2026-01-31"
                />
                <Field
                  label="Opening balance (first bill only)"
                  value={billForm.opening_balance}
                  onChangeText={(value) =>
                    setBillForm({ ...billForm, opening_balance: value })
                  }
                  keyboardType="decimal-pad"
                />
                <Field
                  label="Current bill amount"
                  value={billForm.bill_amount}
                  onChangeText={(value) =>
                    setBillForm({ ...billForm, bill_amount: value })
                  }
                  keyboardType="decimal-pad"
                />
                <Field
                  label="Description (optional)"
                  value={billForm.description}
                  onChangeText={(value) =>
                    setBillForm({ ...billForm, description: value })
                  }
                />
                <PrimaryButton
                  label={busy ? "Saving..." : "Save bill"}
                  disabled={busy}
                  onPress={() => void createBill()}
                />
              </View>
            )}

            {bills.map((bill) => (
              <View key={bill.id} style={styles.bill}>
                <View style={styles.sectionHeader}>
                  <View style={styles.flex}>
                    <Text style={styles.panelTitle}>
                      {bill.period_start} to {bill.period_end}
                    </Text>
                    <Text style={styles.muted}>{bill.payment_status}</Text>
                  </View>
                  <Text style={styles.statusAmount}>
                    {money.format(bill.closing_balance)}
                  </Text>
                </View>
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
                <Text style={styles.calculation}>
                  Remaining = previous balance + bill amount − all payments
                </Text>
                <View style={styles.divider} />
                <Text style={styles.label}>Payments</Text>
                {bill.payments.map((payment) => (
                  <View key={payment.id} style={styles.listRow}>
                    <View style={styles.flex}>
                      <Text style={styles.bodyText}>
                        {payment.payer_name} · {money.format(payment.amount)}
                      </Text>
                      <Text style={styles.muted}>
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </Text>
                    </View>
                    {payment.paid_by === user?.id && (
                      <SmallButton
                        label="Edit"
                        onPress={() => {
                          setEditingPayment(payment);
                          setPaymentBillId(bill.id);
                          setPaymentForm({
                            amount: String(payment.amount),
                            payment_date: payment.payment_date.slice(0, 10),
                            payment_method: payment.payment_method || "",
                          });
                        }}
                      />
                    )}
                  </View>
                ))}
                {bill.closing_balance > 0 && (
                  <SecondaryButton
                    label="Record payment"
                    onPress={() => {
                      setEditingPayment(null);
                      setPaymentBillId(bill.id);
                      setPaymentForm({
                        amount: "",
                        payment_date: new Date().toISOString().slice(0, 10),
                        payment_method: "",
                      });
                    }}
                  />
                )}
                {paymentBillId === bill.id && (
                  <View style={styles.panel}>
                    <Text style={styles.panelTitle}>
                      {editingPayment ? "Edit your payment" : "Record payment"}
                    </Text>
                    <Field
                      label="Amount"
                      value={paymentForm.amount}
                      onChangeText={(value) =>
                        setPaymentForm({ ...paymentForm, amount: value })
                      }
                      keyboardType="decimal-pad"
                    />
                    <Field
                      label="Payment date (YYYY-MM-DD)"
                      value={paymentForm.payment_date}
                      onChangeText={(value) =>
                        setPaymentForm({ ...paymentForm, payment_date: value })
                      }
                      placeholder="2026-01-31"
                    />
                    <Field
                      label="Method (optional)"
                      value={paymentForm.payment_method}
                      onChangeText={(value) =>
                        setPaymentForm({
                          ...paymentForm,
                          payment_method: value,
                        })
                      }
                    />
                    <PrimaryButton
                      label={busy ? "Saving..." : "Save payment"}
                      disabled={busy}
                      onPress={() => void savePayment()}
                    />
                    <SecondaryButton
                      label="Cancel"
                      onPress={() => {
                        setPaymentBillId("");
                        setEditingPayment(null);
                      }}
                    />
                  </View>
                )}
              </View>
            ))}
            {accounts.length === 0 && (
              <View style={styles.panel}>
                <Text style={styles.bodyText}>
                  No EB accounts have been set up for this apartment.
                </Text>
              </View>
            )}
          </>
        )}
        <Attribution />
      </ScrollView>
    </SafeAreaView>
  );
}
