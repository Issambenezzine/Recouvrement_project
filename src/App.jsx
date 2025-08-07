import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./login.jsx";
import Adminpage from "./adminpage.jsx";
import ManagerPage from "./manager/managerpage.jsx";
import GestionnairePage from "./gestionnaire/gestionnairepage.jsx"; 
import { Slide } from "react-toastify";
import Unauthorized from "./Unauthorized.jsx";
import VisiteurPage from "./visiteur/visiteurpage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/block" element={<Unauthorized />} />
        <Route path="/admin/*" element={<Adminpage />} />
        <Route path="/manager/*" element={<ManagerPage />} />
        <Route path="/gestionnaire/*" element={<GestionnairePage />} />
        <Route path="/visiteur/*" element={<VisiteurPage />} />
        {/* Redirection par défaut vers la page de connexion */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      {/* <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> */}
      <ToastContainer
        position="bottom-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </Router>
  );
}

export default App;
