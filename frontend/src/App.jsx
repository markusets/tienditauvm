import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShoesCollectionTop from './components/marketing/shoes-cards.jsx'
import ModernNavbar from './components/layouts/navbar'
import ShoesHero from './components/marketing/hero-shoes'
import InstagramInfo from './components/marketing/instagram-info'
import Footer from './components/layouts/footer'
import { Toaster } from '@/components/customs/toast-container.jsx'
import HeroCarousel from '@/components/marketing/hero-carousel.jsx'
import NewsletterSubscription from '@/components/marketing/newsletter-subscription.jsx'
import MissionVision from '@/components/marketing/mission-vision.jsx'
import AuthForms from '@/components/auth/auth-form.jsx'
import Dashboard from '@/components/dashboard/dashboard.jsx'
import ProtectedRoute from '@/middlewares/ProtectedRoutes.jsx'

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={
          <>
            <ModernNavbar />
            <HeroCarousel />
            <ShoesHero />
            <ShoesCollectionTop />
            <InstagramInfo />
            <MissionVision />
            <NewsletterSubscription />
            <Footer />
          </>
        } />


        <Route path="/auth" element={<AuthForms />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>)
}

export default App
