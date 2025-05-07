import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import AdminPage from "./pages/admin/AdminPage";
import Login from "./pages/auth/Login";
import PublicRoute from "./components/auth/PublicRoute";
import PrivateRoute from "./components/auth/PrivateRoute";
import { Button } from "react-day-picker";
import ErrorPage from "./components/ErrorPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
