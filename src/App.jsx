import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp.jsx';
import SignIn from './pages/SignIn/SignIn.jsx';
import Home from './pages/Home/Home';
import AppTheme from './shared-theme/AppTheme.jsx'; // Ensure this import is present

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
                    <Route path="/food" element={<Home />} />
                    <Route path="/community" element={<Home />} />
                </Routes>
            </Router>
        </AppTheme>
    );
}

export default App;