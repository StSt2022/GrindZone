import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp.jsx';
import SignIn from './pages/SignIn/SignIn.jsx';
import Home from './pages/Home/Home';
import Food from './pages/Food/Food';
import Community from './pages/Community/Community';
import AppTheme from './shared-theme/AppTheme.jsx';
import ChatWidget from "./widgets/ChatWidget.jsx";

function App() {
    return (
        <AppTheme>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/profile" element={<Home />} />
                    <Route path="/activities" element={<Home />} />
                    <Route path="/food" element={<Food />} />
                    <Route path="/community" element={<Community />} />
                </Routes>
                <ChatWidget />
            </Router>
        </AppTheme>
    );
}

export default App;