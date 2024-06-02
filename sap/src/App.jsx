import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainComponent from "./components/mainComponent";
import WelcomeComponent from "./components/welcomeComponent";
import LoginComponent from "./components/loginComponent";
import SignUpComponent from "./components/signupComponent";
import Profile from "./components/profile";
import ResetPassword from "./components/resetPassword";
import HistoryContent from "./components/historyContent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/signup" element={<SignUpComponent />} />
        <Route path="/home" element={<MainComponent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/history" element={<HistoryContent />} />

      </Routes>
    </Router>
  );
}

export default App;
