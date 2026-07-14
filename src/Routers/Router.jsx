import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layouts/Dashboard";
import SignIn from "../Pages/Auth/SignIn";
import PrivateRoute from "./PrivateRoute";
import Profile from "../components/Profile/Profile";
import Categories from "../components/Categories/Categories";
import Overview from "../components/Overview/Overview";
import RequestsPanel from "../components/Requestspanel/Requestspanel";
import AllBusinessListing from "../components/Allbusinesslisting/Allbusinesslisting";
import Pricing from "../components/Pricing/Pricing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    errorElement: <h1>404</h1>,
    children: [
      {
        path: "/",
        element: <Overview />,
      },
      {
        path: "/listings",
        element: <AllBusinessListing />,
      },
      {
        path: "/requests",
        element: <RequestsPanel />
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },

    
   
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },

]);
