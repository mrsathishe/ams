import styled from "styled-components";
import { AuthProvider } from "./lib/auth";
import { Router } from "./Router";
import { CombinedThemeProvider } from "./components/CombinedThemeProvider";
import { ToastProvider } from "./contexts/ToastContext";
import { ToastNotifications } from "./components/ui/Toast";
import Footer from "./components/Footer";

const AppLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

function App() {
  return (
    <CombinedThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppLayout>
            <MainContent>
              <Router />
            </MainContent>
            <Footer />
            <ToastNotifications />
          </AppLayout>
        </AuthProvider>
      </ToastProvider>
    </CombinedThemeProvider>
  );
}

export default App;
