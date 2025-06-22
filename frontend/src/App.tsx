import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './pages/JoinPage';
import RoomPage from './pages/RoomPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </Router>
  );
}
