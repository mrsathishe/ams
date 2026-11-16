import { Stack } from "expo-router";
import { SessionProvider } from "../session";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f6f8f6" },
        }}
      />
    </SessionProvider>
  );
}
