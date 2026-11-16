import { Redirect, Stack } from "expo-router";
import { useSession } from "../../session";

export default function ProtectedLayout() {
  const { user, token, isLoading } = useSession();
  if (isLoading) return null;
  if (!user || !token) return <Redirect href="/sign-in" />;
  if (user.approval_status !== "approved" && !user.is_super_admin) {
    return <Redirect href="/pending-approval" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
