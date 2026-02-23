import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import OnboardingEntry from "./pages/OnboardingEntry";
import Locations from "./pages/Locations";
import AddLocation from "./pages/AddLocation";
import Policies from "./pages/Policies";
import AddPolicy from "./pages/AddPolicy";
import DraftTemplates from "./pages/DraftTemplates";
import DraftTemplateEditor from "./pages/DraftTemplateEditor";
import PayrollPackagePurchase from "./pages/PayrollPackagePurchase";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: OnboardingEntry },
      { path: "dashboard", Component: Dashboard },
      { path: "locations", Component: Locations },
      { path: "locations/add", Component: AddLocation },
      { path: "policies", Component: Policies },
      { path: "policies/add", Component: AddPolicy },
      { path: "policies/:id", Component: AddPolicy },
      { path: "draft-templates", Component: DraftTemplates },
      { path: "draft-templates/add", Component: DraftTemplateEditor },
      { path: "draft-templates/:id", Component: DraftTemplateEditor },
      { path: "draft-templates/payroll-package", Component: PayrollPackagePurchase },
    ],
  },
]);
