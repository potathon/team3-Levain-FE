// src/App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Password from "./pages/Password";
import MyPage from "./pages/MyPage";
import OthersPage2 from "./pages/OthersPage2";
import NotFound from "./pages/NotFound";
import LetterCreate from "./pages/LetterCreate";
import Main from "./pages/Main";
import Intro from "./pages/Intro";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Intro />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/password" element={<PrivateRoute element={<Password />} />}/>
                    <Route path="/main" element={<PrivateRoute element={<Main />} />} />
                    <Route path="/letter/my" element={<PrivateRoute element={<MyPage />} />} />
                    <Route path="/letter/:userName" element={<PrivateRoute element={<OthersPage2 />} />} />
                    <Route path="/letter/:userName/create" element={<PrivateRoute element={<LetterCreate />} />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
