import { RouterProvider, createBrowserRouter } from "react-router-dom";

// *** PAGES ***
import Teams from "./pages/Teams";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminTeamPage from "./pages/AdminTeamPage";
import MemberTeamPage from "./pages/MemberTeamPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Teams />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/adminTeamPage/:id",
    element: <AdminTeamPage />,
  },
  {
    path: "/memberTeamPage/:id",
    element: <MemberTeamPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
