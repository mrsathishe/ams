import { Redirect } from "expo-router";
import { ActivityIndicator, SafeAreaView, StatusBar, Text } from "react-native";
import { useSession } from "../session";
import { COLORS, styles } from "../ui";

export default function IndexRoute() {
  const { user, isLoading } = useSession();
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator color={COLORS.green} />
        <Text style={styles.muted}>Opening Kootukudil...</Text>
      </SafeAreaView>
    );
  }
  if (!user) return <Redirect href="/sign-in" />;
  if (user.approval_status !== "approved" && !user.is_super_admin) {
    return <Redirect href="/pending-approval" />;
  }
  return <Redirect href="/(app)/eb" />;
}
