import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from 'react-router-dom';
import BirthdayCardCreator from './components/BirthdayCardCreator';
import DynamicBirthdayCard from './components/DynamicBirthdayCard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage - Card Creation Form */}
        <Route path="/" element={<BirthdayCardCreator />} />

        {/* Dynamic Card Display - This route handles both auth and card display */}
        <Route path="/card/:cardId" element={<CardPage />} />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Card Page Component
function CardPage() {
  const { cardId } = useParams<{ cardId: string }>();

  // Log for debugging
  console.log('🎂 CardPage rendered with cardId:', cardId);

  if (!cardId) {
    return <NotFound />;
  }

  return <DynamicBirthdayCard cardId={cardId} />;
}

// 404 Page
function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎂 Card Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          This birthday card doesn't exist or may have expired.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Create a New Card
        </a>
      </div>
    </div>
  );
}

export default App;
