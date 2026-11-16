import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { api } from "../api";
import { useSession } from "../session";
import type { RegistrationOption } from "../types";
import {
  Attribution,
  BrandHeader,
  Choice,
  Field,
  Notice,
  PrimaryButton,
  SegmentButton,
  styles,
} from "../ui";

export default function SignInRoute() {
  const { user, isLoading, login, register } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [options, setOptions] = useState<RegistrationOption[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [relationship, setRelationship] = useState<"Owner" | "Tenant">("Owner");
  const [apartmentChoice, setApartmentChoice] = useState("new");
  const [flatChoice, setFlatChoice] = useState("new");
  const [apartmentName, setApartmentName] = useState("");
  const [flatCount, setFlatCount] = useState("");
  const [flatName, setFlatName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "register")
      api
        .registrationOptions()
        .then(setOptions)
        .catch(() => setOptions([]));
  }, [mode]);

  useEffect(() => {
    if (isLoading || !user) return;
    router.replace(
      user.approval_status === "approved" || user.is_super_admin
        ? "/(app)/eb"
        : "/pending-approval",
    );
  }, [isLoading, user]);

  const submit = async () => {
    setError("");
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "register" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (
      mode === "register" &&
      apartmentChoice === "new" &&
      (!flatCount || !flatName.trim())
    ) {
      setError("Enter the total flat count and your flat name.");
      return;
    }
    if (
      mode === "register" &&
      apartmentChoice !== "new" &&
      flatChoice === "new" &&
      !flatName.trim()
    ) {
      setError("Enter a flat name.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        const profile = await login(email.trim(), password);
        router.replace(
          profile.approval_status === "approved" || profile.is_super_admin
            ? "/(app)/eb"
            : "/pending-approval",
        );
      } else {
        const registration: Parameters<typeof register>[0] = {
          email: email.trim(),
          name: name.trim(),
          password,
          relationship,
        };
        if (apartmentChoice === "new") {
          registration.apartment_name = apartmentName.trim() || undefined;
          registration.total_flat_count = Number(flatCount);
          registration.flat_name = flatName.trim();
        } else {
          registration.apartment_id = apartmentChoice;
          if (flatChoice === "new") registration.flat_name = flatName.trim();
          else registration.flat_id = flatChoice;
        }
        const profile = await register(registration);
        router.replace(
          profile.approval_status === "approved" || profile.is_super_admin
            ? "/(app)/eb"
            : "/pending-approval",
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to complete sign in.",
      );
    } finally {
      setBusy(false);
    }
  };

  const selectedApartment = options.find(
    (apartment) => apartment.id === apartmentChoice,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.authContent}
          keyboardShouldPersistTaps="handled"
        >
          <BrandHeader subtitle="Apartment electricity and community management" />
          <View style={styles.segment}>
            <SegmentButton
              label="Log in"
              active={mode === "login"}
              onPress={() => {
                setMode("login");
                setError("");
              }}
            />
            <SegmentButton
              label="Register"
              active={mode === "register"}
              onPress={() => {
                setMode("register");
                setError("");
              }}
            />
          </View>
          {mode === "register" && (
            <Field
              label="Full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
          />
          <Text
            onPress={() => setShowPassword((value) => !value)}
            style={styles.inlineLink}
          >
            {showPassword ? "Hide password" : "Show password"}
          </Text>

          {mode === "register" && (
            <>
              <Field
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
              />
              <Text style={styles.label}>Apartment</Text>
              <Choice
                label="Create a new apartment"
                selected={apartmentChoice === "new"}
                onPress={() => {
                  setApartmentChoice("new");
                  setFlatChoice("new");
                }}
              />
              {options.map((apartment) => (
                <Choice
                  key={apartment.id}
                  label={apartment.name}
                  selected={apartmentChoice === apartment.id}
                  onPress={() => {
                    setApartmentChoice(apartment.id);
                    setFlatChoice("new");
                  }}
                />
              ))}
              {apartmentChoice === "new" ? (
                <>
                  <Field
                    label="Apartment name (optional)"
                    value={apartmentName}
                    onChangeText={setApartmentName}
                  />
                  <Field
                    label="Total flats"
                    value={flatCount}
                    onChangeText={setFlatCount}
                    keyboardType="number-pad"
                  />
                  <Field
                    label="Your flat name or number"
                    value={flatName}
                    onChangeText={setFlatName}
                  />
                </>
              ) : (
                <>
                  {selectedApartment?.flats.map((flat) => (
                    <Choice
                      key={flat.id}
                      label={`Flat ${flat.name}`}
                      selected={flatChoice === flat.id}
                      onPress={() => {
                        setFlatChoice(flat.id);
                        setFlatName("");
                      }}
                    />
                  ))}
                  <Choice
                    label="Add a flat to this apartment"
                    selected={flatChoice === "new"}
                    onPress={() => setFlatChoice("new")}
                  />
                  {flatChoice === "new" && (
                    <Field
                      label="Flat name or number"
                      value={flatName}
                      onChangeText={setFlatName}
                    />
                  )}
                </>
              )}
              <Text style={styles.label}>Relationship to the flat</Text>
              <View style={styles.row}>
                <SegmentButton
                  label="Owner"
                  active={relationship === "Owner"}
                  onPress={() => setRelationship("Owner")}
                />
                <SegmentButton
                  label="Tenant"
                  active={relationship === "Tenant"}
                  onPress={() => setRelationship("Tenant")}
                />
              </View>
            </>
          )}
          {error ? <Notice text={error} type="error" /> : null}
          <PrimaryButton
            disabled={busy}
            label={
              busy
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : "Log in"
            }
            onPress={() => void submit()}
          />
          <Attribution />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
