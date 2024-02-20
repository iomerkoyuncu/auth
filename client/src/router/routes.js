import Home from "../pages/Home";
import EditUserRoles from "../pages/EditUserRoles";
import User from "../pages/User";

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/edit-user/:id',
    element: <User />,
  },
  {
    path: '/edit-user-roles',
    element: <EditUserRoles />,
  },

];

export default routes;
