import { AuthProvider } from "./lib/auth";
import { Router } from "./Router";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
