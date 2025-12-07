import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import Header from "@/components/Header";
import FormField from "@/components/common/forms/FormField";
import { MailIcon, UserIcon, PhoneIcon, LockIcon } from "@/components/icons";
import {
  PageContainer,
  FormWrapper,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Form,
  Button,
  ErrorMessage
} from "@/styles/shared";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !userId || !phone) {
      setError("Please fill in all verification fields");
      return;
    }

    // Simple client-side validation - in a real app, you'd verify these details with the server
    setStep('reset');
    toast.success("Identity verified! Please set your new password.");
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          user_id: userId,
          phone,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (data.status) {
        toast.success("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to update password");
        toast.error(data.message || "Failed to update password");
      }
    } catch (error) {
      const errorMessage = "Failed to update password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header variant="auth" />
      <PageContainer>
        <FormWrapper>
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 'verify' ? 'Forgot Password' : 'Reset Password'}
              </CardTitle>
              <CardDescription>
                {step === 'verify' 
                  ? 'Enter your details to verify your identity'
                  : 'Enter your new password'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'verify' ? (
                <Form onSubmit={handleVerifySubmit}>
                  <FormField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<MailIcon />}
                  />

                  <FormField
                    id="userId"
                    name="userId"
                    type="text"
                    label="User ID"
                    placeholder="Enter your user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    icon={<UserIcon />}
                  />

                  <FormField
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    icon={<PhoneIcon />}
                  />

                  {error && <ErrorMessage>{error}</ErrorMessage>}

                  <Button type="submit">
                    Verify Identity
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate("/login")}
                  >
                    Back to Login
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={handleResetSubmit}>
                  <FormField
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    label="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    icon={<LockIcon />}
                  />

                  <FormField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    icon={<LockIcon />}
                  />

                  {error && <ErrorMessage>{error}</ErrorMessage>}

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating Password..." : "Update Password"}
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setStep('verify')}
                  >
                    Back to Verification
                  </Button>
                </Form>
              )}
            </CardContent>
          </Card>
        </FormWrapper>
      </PageContainer>
    </>
  );
}