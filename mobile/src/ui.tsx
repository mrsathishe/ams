import type { ComponentProps, ReactNode } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export const COLORS = {
  ink: "#1c2824",
  muted: "#68766f",
  green: "#14745b",
  pale: "#edf5f0",
  line: "#dce5df",
  white: "#ffffff",
  danger: "#a83434",
};

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "#f6f8f6" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  authContent: { flexGrow: 1, justifyContent: "center", padding: 22, gap: 14 },
  content: { padding: 18, paddingBottom: 36, gap: 14 },
  brand: { marginBottom: 12 },
  brandCompact: { flex: 1 },
  brandName: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  brandSubtitle: {
    color: COLORS.ink,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },
  topBar: { alignItems: "center", flexDirection: "row", gap: 12 },
  segment: {
    flexDirection: "row",
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: 8,
    padding: 3,
    backgroundColor: COLORS.white,
  },
  row: { flexDirection: "row", gap: 8 },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 10,
  },
  segmentActive: { backgroundColor: COLORS.green },
  segmentText: { color: COLORS.muted, fontSize: 14, fontWeight: "600" },
  segmentTextActive: { color: COLORS.white },
  field: { gap: 6 },
  label: { color: COLORS.ink, fontSize: 13, fontWeight: "700", marginTop: 3 },
  input: {
    minHeight: 46,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: COLORS.white,
    color: COLORS.ink,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  inlineLink: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "700",
    paddingVertical: 4,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: COLORS.green,
    borderRadius: 7,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 3,
  },
  primaryText: { color: COLORS.white, fontSize: 14, fontWeight: "700" },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: 7,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  secondaryText: { color: COLORS.ink, fontSize: 13, fontWeight: "700" },
  smallButton: {
    backgroundColor: COLORS.pale,
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  smallButtonText: { color: COLORS.green, fontSize: 12, fontWeight: "800" },
  disabled: { opacity: 0.55 },
  choice: {
    alignItems: "center",
    borderColor: COLORS.line,
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 42,
    paddingHorizontal: 11,
  },
  choiceSelected: { backgroundColor: COLORS.pale, borderColor: COLORS.green },
  radio: {
    width: 16,
    height: 16,
    borderColor: COLORS.muted,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  radioSelected: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  choiceText: { color: COLORS.ink, fontSize: 13, fontWeight: "600", flex: 1 },
  notice: { borderLeftWidth: 4, padding: 11, borderRadius: 4 },
  errorNotice: { backgroundColor: "#fff0ef", borderLeftColor: COLORS.danger },
  successNotice: {
    backgroundColor: COLORS.pale,
    borderLeftColor: COLORS.green,
  },
  errorText: { color: COLORS.danger, fontSize: 13 },
  successText: { color: COLORS.green, fontSize: 13 },
  endpoint: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
  muted: { color: COLORS.muted, fontSize: 12, lineHeight: 18 },
  bodyText: { color: COLORS.ink, fontSize: 14, lineHeight: 21 },
  panel: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 9,
  },
  panelTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "700" },
  section: { gap: 8 },
  sectionHeader: { alignItems: "center", flexDirection: "row", gap: 10 },
  sectionTitle: { color: COLORS.ink, fontSize: 17, fontWeight: "800" },
  chips: { gap: 8, paddingVertical: 4 },
  chip: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  chipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  chipText: { color: COLORS.ink, fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: COLORS.white },
  listRow: {
    alignItems: "center",
    borderBottomColor: COLORS.line,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    paddingVertical: 9,
  },
  bill: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 7,
  },
  statusAmount: { color: COLORS.green, fontSize: 14, fontWeight: "800" },
  calculation: { color: COLORS.muted, fontSize: 11, lineHeight: 16 },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: 4 },
  metric: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  metricValue: { color: COLORS.ink, fontSize: 14, fontWeight: "700" },
  attribution: { alignItems: "center", gap: 3, paddingVertical: 12 },
});

export function BrandHeader({
  subtitle,
  compact = false,
}: {
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <View style={compact ? styles.brandCompact : styles.brand}>
      <Text style={styles.brandName}>Kootukudil</Text>
      <Text style={styles.brandSubtitle}>{subtitle}</Text>
    </View>
  );
}

export function Field({
  label,
  ...props
}: ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={COLORS.muted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryButton, disabled && styles.disabled]}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

export function SmallButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.smallButton, disabled && styles.disabled]}
    >
      <Text style={styles.smallButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segmentButton, active && styles.segmentActive]}
    >
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceSelected]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]} />
      <Text style={styles.choiceText}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Notice({
  text,
  type,
}: {
  text: string;
  type: "error" | "success";
}) {
  return (
    <View
      style={[
        styles.notice,
        type === "error" ? styles.errorNotice : styles.successNotice,
      ]}
    >
      <Text style={type === "error" ? styles.errorText : styles.successText}>
        {text}
      </Text>
    </View>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function Attribution() {
  return (
    <View style={styles.attribution}>
      <Text style={styles.muted}>Developed by Sathish</Text>
      <Pressable onPress={() => void Linking.openURL("tel:+919790060943")}>
        <Text style={styles.inlineLink}>+91 - 97900 60943</Text>
      </Pressable>
      <Pressable
        onPress={() => void Linking.openURL("mailto:contact@satz.co.in")}
      >
        <Text style={styles.inlineLink}>contact@satz.co.in</Text>
      </Pressable>
    </View>
  );
}

export function ScreenLoading({ children }: { children: ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}
