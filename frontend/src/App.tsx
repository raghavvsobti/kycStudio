import { Routes, Route } from 'react-router-dom';
import Home from './home';
import Header from './components/Header';
import Body from './components/Body';
import Login from './components/Login';
import NotFound from './components/Notfound';
import { HyperToast } from './components/sonner';
import { Dashboard } from './Dashboard';

function App() {
	return (
		<>
			<Header />
			<Body>
				<HyperToast richColors pauseWhenPageIsHidden closeButton />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="*" element={<NotFound />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</Body>
		</>
	);
}

export default App;
