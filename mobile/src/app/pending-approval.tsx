import { useEffect } from "react";
import { Redirect, router } from "expo-router";
import { SafeAreaView, ScrollView, StatusBar, Text } from "react-native";
import { useSession } from "../session";
import {
  Attribution,
  BrandHeader,
  PrimaryButton,
  SecondaryButton,
  styles,
} from "../ui";

export default function PendingApprovalRoute() {
  const { user, token, isLoading, refresh, logout } = useSession();

  useEffect(() => {
    if (user?.approval_status === "approved" || user?.is_super_admin)
      router.replace("/(app)/eb");
  }, [user]);

  if (isLoading) return null;
  if (!user || !token) return <Redirect href="/sign-in" />;
  if (user.approval_status === "approved" || user.is_super_admin)
    return <Redirect href="/(app)/eb" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <BrandHeader subtitle="Approval pending" />
        <Text style={styles.bodyText}>
          Your membership needs approval before you can view apartment
          information.
        </Text>
        {user.memberships
          .filter((membership) => membership.status === "pending")
          .map((membership) => (
            <SafeAreaView key={membership.id} style={styles.panel}>
              <Text style={styles.panelTitle}>
                {membership.apartment_name} · Flat {membership.flat_name}
              </Text>
              <Text style={styles.bodyText}>
                {membership.relationship} membership · Approval required from{" "}
                {membership.approval_required_by}.
              </Text>
              <Text style={styles.muted}>
                Eligible approvers:{" "}
                {membership.eligible_approver_names.length
                  ? membership.eligible_approver_names.join(", ")
                  : "No eligible approver is registered yet. A Super Admin can approve."}
              </Text>
            </SafeAreaView>
          ))}
        <PrimaryButton label="Check approval" onPress={() => void refresh()} />
        <SecondaryButton
          label="Log out"
          onPress={() => void logout().then(() => router.replace("/sign-in"))}
        />
        <Attribution />
      </ScrollView>
    </SafeAreaView>
  );
}
