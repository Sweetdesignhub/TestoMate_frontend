// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import RequirementsPage from "./pages/RequirementsPage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/home" element={<Home />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/requirements" element={<RequirementsPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const RequirementsPage = lazy(() => import("./pages/RequirementsPage"));
const Testing = lazy(() => import("./pages/Testing"));

// Main application component with routing
function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/requirements" element={<RequirementsPage />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
