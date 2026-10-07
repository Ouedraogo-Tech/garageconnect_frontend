import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import VehiculesList from './pages/VehiculesList';
import Header from './components/Header';
import './App.css';
import VehiculeDetail from './pages/VehiculeDetail';
import TechniciensList from './pages/TechniciensList';
import TechnicienDetail from './pages/TechnicienDetail';
import ReparationsList from './pages/ReparationsList';
import ReparationDetail from './pages/ReparationDetail';
import UsersManagement from './pages/UsersManagement';
import VehiculeForm from './pages/VehiculeForm';
import TechnicienForm from './pages/TechnicienForm';
import ReparationForm from './pages/ReparationForm';
import Footer from './components/Footer';
import PiecesList from './pages/PiecesList';
import PieceDetail from './pages/PieceDetail';
import PieceForm from './pages/PieceForm';
import FacturesList from './pages/FacturesList';
import FactureDetail from './pages/FactureDetail';
import RegisterClient from './pages/RegisterClient';
import ClientDashboard from './pages/ClientDashboard';
import RendezVousForm from './pages/RendezVousForm';
import RendezVousAdmin from './pages/RendezVousAdmin';
import Statistiques from './pages/Statistiques';

function estConnecte() {
  return !!sessionStorage.getItem('token');
}

function PageProtegee({ role, onLogout, children }) {
  if (!estConnecte()) return <Navigate to="/login" />;
  return (
    <>
      <Header role={role} onLogout={onLogout} />
      <main className="app-content">{children}</main>
      <Footer />
    </>
  );
}

function PageClient({ role, onLogout, children }) {
  if (!estConnecte()) return <Navigate to="/login" />;
  if (role !== 'client') return <Navigate to="/vehicules" />;
  return (
    <>
      <Header role={role} onLogout={onLogout} />
      <main className="app-content">{children}</main>
      <Footer />
    </>
  );
}

function App() {
  const [role, setRole] = useState(sessionStorage.getItem('role'));

  function handleLogin(nouveauRole) {
    setRole(nouveauRole);
  }

  function handleLogout() {
    setRole(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/inscription" element={<RegisterClient onLogin={handleLogin} />} />
        <Route
          path="/vehicules"
          element={
            <PageProtegee role={role} onLogout={handleLogout}>
              <VehiculesList role={role} />
            </PageProtegee>
          }

          />
          <Route
  path="/vehicules/:id/modifier"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <VehiculeForm />
    </PageProtegee>
  }
/>
        <Route
          path="/vehicules/:id"
          element={
            <PageProtegee role={role} onLogout={handleLogout}>
              <VehiculeDetail />
            </PageProtegee>
          }
        />
        <Route
  path="/techniciens"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <TechniciensList role={role} />
    </PageProtegee>
  }
/>
<Route
  path="/vehicules/nouveau"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <VehiculeForm />
    </PageProtegee>
  }
/>
<Route
  path="/techniciens/nouveau"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <TechnicienForm />
    </PageProtegee>
  }
/>
<Route

  path="/techniciens/:id/modifier"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <TechnicienForm />
    </PageProtegee>
  }
/>
<Route
  path="/techniciens/:id"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <TechnicienDetail />
    </PageProtegee>
  }
/>
<Route
  path="/reparations"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <ReparationsList role={role} />
    </PageProtegee>
  }
/>
<Route
  path="/reparations/nouvelle"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <ReparationForm />
    </PageProtegee>
  }
/>
<Route
  path="/reparations/:id/modifier"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <ReparationForm />
    </PageProtegee>
  }
/>
<Route
  path="/reparations/:id"
  element={<PageProtegee role={role} onLogout={handleLogout}><ReparationDetail role={role} /></PageProtegee>}

/>
<Route
  path="/utilisateurs"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <UsersManagement />
    </PageProtegee>
  }
/>
<Route
  path="/pieces/nouvelle"
  element={<PageProtegee role={role} onLogout={handleLogout}><PieceForm /></PageProtegee>}
/>
<Route
  path="/pieces/:id/modifier"
  element={<PageProtegee role={role} onLogout={handleLogout}><PieceForm /></PageProtegee>}
/>
<Route
  path="/pieces/:id"
  element={<PageProtegee role={role} onLogout={handleLogout}><PieceDetail /></PageProtegee>}
/>
<Route
  path="/pieces"
  element={<PageProtegee role={role} onLogout={handleLogout}><PiecesList role={role} /></PageProtegee>}
/>
<Route
  path="/factures"
  element={<PageProtegee role={role} onLogout={handleLogout}><FacturesList /></PageProtegee>}
/>
<Route
  path="/factures/:id"
  element={<PageProtegee role={role} onLogout={handleLogout}><FactureDetail role={role} /></PageProtegee>}
/>

<Route
  path="/client"
  element={
    <PageClient role={role} onLogout={handleLogout}>
      <ClientDashboard />
    </PageClient>
  }
/>
<Route
  path="/client/rendez-vous/nouveau"
  element={
    <PageClient role={role} onLogout={handleLogout}>
      <RendezVousForm />
    </PageClient>
  }
/>
<Route
  path="/rendez-vous"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <RendezVousAdmin />
    </PageProtegee>
  }
/>
<Route
  path="/statistiques"
  element={
    <PageProtegee role={role} onLogout={handleLogout}>
      <Statistiques />
    </PageProtegee>
  }
/>
        <Route path="/" element={<Navigate to="/vehicules" />} />
      </Routes>
    </BrowserRouter>


  );
}

export default App;