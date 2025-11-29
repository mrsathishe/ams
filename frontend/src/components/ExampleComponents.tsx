import React from 'react';
import styled from 'styled-components';
import { StyledButton, StyledCard, StyledHeading, StyledText, StyledFlex } from './styled/StyledComponents';

// Example styled component usage
const ExampleContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.gradients.hero};
  padding: ${({ theme }) => theme.spacing[8]};
`;

const ExampleComponents: React.FC = () => {
  return (
    <ExampleContainer>
      <StyledFlex direction="column" align="center" gap="6">
        <StyledHeading size="4xl" gradient>
          AptSync Styled Components
        </StyledHeading>
        
        <StyledText size="lg" color="600">
          Examples of styled-components using your custom theme
        </StyledText>
        
        <StyledFlex direction="row" gap="4" wrap>
          <StyledButton variant="primary">
            Primary Button
          </StyledButton>
          
          <StyledButton variant="secondary">
            Secondary Button
          </StyledButton>
          
          <StyledButton variant="success">
            Success Button
          </StyledButton>
          
          <StyledButton variant="outline">
            Outline Button
          </StyledButton>
        </StyledFlex>
        
        <StyledFlex direction="row" gap="6" wrap>
          <StyledCard variant="default" padding="md" hoverable>
            <StyledHeading size="xl">Default Card</StyledHeading>
            <StyledText>This is a default card with hover effects.</StyledText>
          </StyledCard>
          
          <StyledCard variant="gradient" padding="md" hoverable>
            <StyledHeading size="xl">Gradient Card</StyledHeading>
            <StyledText>This card uses gradient backgrounds.</StyledText>
          </StyledCard>
          
          <StyledCard variant="brand" padding="md" hoverable>
            <StyledHeading size="xl">Brand Card</StyledHeading>
            <StyledText>This card uses brand gradient colors.</StyledText>
          </StyledCard>
        </StyledFlex>
      </StyledFlex>
    </ExampleContainer>
  );
};

export default ExampleComponents;