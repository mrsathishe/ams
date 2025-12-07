import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  ContentWrapper,
  Header,
  Title,
  Subtitle,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton
} from "./HomePage/styles";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>AptSync</Title>
          <Subtitle>Apartment Management System</Subtitle>
        </Header>

        <ButtonGroup>
          <PrimaryButton 
            variant="primary" 
            size="large"
            onClick={() => navigate("/login")}
          >
            Sign In
          </PrimaryButton>

          <SecondaryButton 
            variant="default" 
            size="large"
            onClick={() => navigate("/register")}
          >
            Register
          </SecondaryButton>
        </ButtonGroup>
      </ContentWrapper>
    </PageContainer>
  );
}