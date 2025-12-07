import { AuthSection, TextButton } from "@/styles/shared";

interface AuthNavigationProps {
  text: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function AuthNavigation({ text, buttonText, onButtonClick }: AuthNavigationProps) {
  return (
    <AuthSection>
      {text}{" "}
      <TextButton
        variant="text"
        onClick={onButtonClick}
      >
        {buttonText}
      </TextButton>
    </AuthSection>
  );
}