import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ServiceDetail from './components/ServiceDetail';
import MortgageOverview from './pages/MortgageOverview';
import ProtectionOverview from './pages/ProtectionOverview';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import InsuranceAssessment from './pages/InsuranceAssessment';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { serviceData } from './utils/serviceData';
import MortgageCalculator from './components/calculators/MortgageCalculator/MortgageCalculator';
import ReferralPage from './pages/ReferralPage';
import ReferralLanding from './pages/ReferralLanding';

import axios from 'axios';
import { getApiUrl } from './config';

const ServiceWrapper = ({ id }) => {
  const data = serviceData[id];
  if (!data) return <div>Service not found</div>;
  return <ServiceDetail {...data} />;
};

function App() {
  React.useEffect(() => {
    // Warm up the backend (mitigate Render's cold start)
    const apiUrl = getApiUrl();
    axios.get(apiUrl).catch(() => {
      // Ignore errors, we just want to trigger the wake-up
    });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Isolated Routes (No Header/Footer/Chatbot) */}
        <Route path="/insurance-assessment" element={<InsuranceAssessment />} />
        <Route path="/insurance-client-questionnaire" element={<InsuranceAssessment />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/referral/:code" element={<ReferralLanding />} />

        {/* Global Layout Routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Mortgages */}
              <Route path="/mortgages/first-time-buyer" element={<ServiceWrapper id="first-time-buyer" />} />
              <Route path="/mortgages/remortgaging" element={<ServiceWrapper id="remortgaging" />} />
              <Route path="/mortgages/buy-to-let" element={<ServiceWrapper id="buy-to-let" />} />
              <Route path="/mortgages/shared-ownership" element={<ServiceWrapper id="shared-ownership" />} />
              <Route path="/mortgages/bad-credit" element={<ServiceWrapper id="bad-credit" />} />
              <Route path="/mortgages/high-net-worth" element={<ServiceWrapper id="high-net-worth" />} />

              {/* Protection */}
              <Route path="/protection/life-insurance" element={<ServiceWrapper id="life-insurance" />} />
              <Route path="/protection/critical-illness" element={<ServiceWrapper id="critical-illness" />} />
              <Route path="/protection/income-protection" element={<ServiceWrapper id="income-protection" />} />
              <Route path="/protection/mortgage-protection" element={<ServiceWrapper id="mortgage-protection" />} />
              <Route path="/protection/buildings-contents" element={<ServiceWrapper id="buildings-contents" />} />

              {/* Overviews */}
              <Route path="/mortgages" element={<MortgageOverview />} />
              <Route path="/protection" element={<ProtectionOverview />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
              <Route path="/tools/referral" element={<ReferralPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
