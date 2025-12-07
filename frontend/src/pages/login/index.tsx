import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/contexts/ToastContext";
import Header from "@/components/Header";
import FormField from "@/components/common/forms/FormField";
import QuickAccessButtons from "@/components/common/ui/QuickAccessButtons";
import RememberMeCheckbox from "@/components/common/ui/RememberMeCheckbox";
import AdCarousel from "@/components/common/AdCarousel";
import AuthNavigation from "@/components/common/AuthNavigation";
import { LOGIN_CONSTANTS, NAVIGATION_ROUTES } from "@/constants";
import {
  PageContainer,
  FormWrapper,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Form,
  Button,
  ErrorMessage,
  AuthCard
} from "@/styles/shared";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(identifier, password);
      toast.success(LOGIN_CONSTANTS.messages.success);
      navigate(NAVIGATION_ROUTES.home);
    } catch {
      const errorMessage = LOGIN_CONSTANTS.messages.error;
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
        <AdCarousel />
        <FormWrapper>
          <AuthNavigation
            text={LOGIN_CONSTANTS.links.noAccount}
            buttonText={LOGIN_CONSTANTS.links.signUp}
            onButtonClick={() => navigate(NAVIGATION_ROUTES.register)}
          />
          <AuthCard>
            <CardHeader>
              <CardTitle>{LOGIN_CONSTANTS.page.title}</CardTitle>
              <CardDescription>{LOGIN_CONSTANTS.page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form onSubmit={handleSubmit}>
                <FormField
                  id="identifier"
                  name="identifier"
                  type="text"
                  label={LOGIN_CONSTANTS.fields.identifier.label}
                  placeholder={LOGIN_CONSTANTS.fields.identifier.placeholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoComplete="on"
                />

                <FormField
                  id="password"
                  name="password"
                  type="password"
                  label={LOGIN_CONSTANTS.fields.password.label}
                  placeholder={LOGIN_CONSTANTS.fields.password.placeholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? LOGIN_CONSTANTS.buttons.loading : LOGIN_CONSTANTS.buttons.submit}
                </Button>

                <RememberMeCheckbox 
                  checked={rememberMe}
                  onChange={setRememberMe}
                />

                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                  >
                    {LOGIN_CONSTANTS.buttons.forgotPassword}
                  </Button>
                </div>

                <QuickAccessButtons />
              </Form>
            </CardContent>
          </AuthCard>
        </FormWrapper>
      </PageContainer>
    </>
  );
}