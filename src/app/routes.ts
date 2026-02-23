import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import AddLocation from "./pages/AddLocation";
import Policies from "./pages/Policies";
import AddPolicy from "./pages/AddPolicy";
import WorkGroups from "./pages/WorkGroups";
import AddWorkGroup from "./pages/AddWorkGroup";
import PayrollContract from "./pages/PayrollContract";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "locations", Component: Locations },
      { path: "locations/add", Component: AddLocation },
      { path: "policies", Component: Policies },
      { path: "policies/add", Component: AddPolicy },
      { path: "policies/:id", Component: AddPolicy },
      { path: "work-groups", Component: WorkGroups },
      { path: "work-groups/add", Component: AddWorkGroup },
      { path: "work-groups/:id", Component: AddWorkGroup },
      { path: "employees", Component: Employees },
      { path: "employees/add", Component: AddEmployee },
      { path: "employees/:id", Component: AddEmployee },
      { path: "payroll-contract", Component: PayrollContract },
    ],
  },
]);
