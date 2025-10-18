import { Route, Routes } from "react-router";

import Chat from "../pages/Chat";
import Auth from "../pages/Auth";
import ProtectedRoute from "./ProtectedRoute";

function Router() {
  return (
    <Routes>

      <Route path="/chats" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default Router;
