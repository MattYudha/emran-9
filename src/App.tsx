import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext.tsx"
import { LanguageProvider } from "./contexts/LanguageContext.tsx"
import Navbar from "./components/Navbar.tsx"
import Footer from "./components/Footer.tsx"
import Chatbot from "./components/Chatbot.tsx"
import Home from "./pages/Home.tsx"
import Dashboard from "./pages/Dashboard.tsx"
import UserProfile from "./pages/UserProfile.tsx"
import BusinessCards from "./pages/BusinessCards.tsx"
import Brochures from "./pages/Brochures.tsx"
import Flyers from "./pages/Flyers.tsx"
import Banners from "./pages/Banners.tsx"
import Posters from "./pages/Posters.tsx"
import LogoDesign from "./pages/LogoDesign.tsx"
import BrandIdentity from "./pages/BrandIdentity.tsx"
import Packaging from "./pages/Packaging.tsx"
import Illustration from "./pages/Illustration.tsx"
import AdminDashboard from "./pages/AdminDashboard.tsx"
import NotFound from "./pages/NotFound.tsx"

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/business-cards" element={<BusinessCards />} />
              <Route path="/brochures" element={<Brochures />} />
              <Route path="/flyers" element={<Flyers />} />
              <Route path="/banners" element={<Banners />} />
              <Route path="/posters" element={<Posters />} />
              <Route path="/logo-design" element={<LogoDesign />} />
              <Route path="/brand-identity" element={<BrandIdentity />} />
              <Route path="/packaging" element={<Packaging />} />
              <Route path="/illustration" element={<Illustration />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <Chatbot />
          </div>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App
