import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ServiceDetail from './components/ServiceDetail';
import MortgageOverview from './pages/MortgageOverview';
import ProtectionOverview from './pages/ProtectionOverview';
import { serviceData } from './utils/serviceData';

const ServiceWrapper = ({ id }) => {
  const data = serviceData[id];
  if (!data) return <div>Service not found</div>;
  return <ServiceDetail {...data} />;
};

function App() {
  return (
    <Router>
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
