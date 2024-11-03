// Argon Dashboard 2 PRO MUI layouts

import Default from "layouts/dashboards/default";

import SignInBasic from "layouts/authentication/sign-in/basic";
import SignUpBasic from "layouts/authentication/sign-up/basic";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";

import SearchData from "layouts/pages/search";

// Admin Latest LUVs
import Users from "layouts/pages/admin/users";
import DefaultManager from "layouts/dashboards/manager";
import DefaultUser from "layouts/dashboards/user";
import UserInfo from "layouts/pages/user_doc_upload";
import Verifier from "layouts/pages/garrisonverifier";




const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboards/default",
    component: <Default />,
    role: ["admin"],
    icon: (
      <ArgonBox
        component="i"
        color="primary"
        fontSize="14px"
        className="ni ni-shop"
      />
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboardManager",
    route: "/dashboards/manager",
    component: <DefaultManager />,
    role: ["manager"],
    icon: (
      <ArgonBox
        component="i"
        color="primary"
        fontSize="14px"
        className="ni ni-shop"
      />
    ),
    noCollapse: true,
  }, {
    type: "collapse",
    name: "Dashboard",
    key: "dashboardUser",
    route: "/dashboards/user",
    component: <DefaultUser />,
    role: ["user"],
    icon: (
      <ArgonBox
        component="i"
        color="primary"
        fontSize="14px"
        className="ni ni-shop"
      />
    ),
    noCollapse: true,
  },
  { type: "title", title: "Management", key: "management" },
  {
    type: "collapse",
    name: "Users",
        key: "add-user",
        route: "/admin/users/",
        component: <Users />,
        role: ["admin"],

    icon: (
      <ArgonBox
        component="i"
        color="primary"
        fontSize="14px"
        className="ni ni-shop"
      />
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Users",
        key: "add-user",
        route: "/users/info/",
        component: <UserInfo />,
        role: ["user"],

    icon: (
      <ArgonBox
        component="i"
        color="primary"
        fontSize="14px"
        className="ni ni-shop"
      />
    ),
    hide: true,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Search",
    key: "search",
    route: "/search",
    role: ["admin", "manager", "user"],
    component: <SearchData />,

    icon: (
      <ArgonBox
        component="i"
        color="primary"
        fontSize="14px"
        className="ni ni-zoom-split-in"
      />
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Authentication",

    key: "authentication",

    icon: (
      <ArgonBox
        component="i"
        color="error"
        fontSize="14px"
        className="ni ni-single-copy-04"
      />
    ),
    collapse: [
      {
        name: "Sign In",
        key: "sign-in",
        collapse: [
          {
            name: "Basic",
            key: "basic",
            // invisible: true,
            route: "/authentication/sign-in/basic",
            component: <SignInBasic />,
            role: ["admin", "manager", "user","guest"],
          },
        ],
      },
      {
        name: "Sign Up",
        key: "sign-up",
        collapse: [
          {
            name: "Basic",
            key: "basic",
            // invisible: true,
            route: "/authentication/sign-up/basic",
            component: <SignUpBasic />,
            role: ["admin", "manager", "user","guest"],
          },
          
        ],
      },
    ],
  },
];

function filterRoutesByRole(routes, userRole) {
  return routes
    .map(route => {
      if (route.collapse) {
        const filteredCollapse = filterRoutesByRole(route.collapse, userRole);
        return filteredCollapse.length ? { ...route, collapse: filteredCollapse } : null;
      }
      return route.role && route.role.includes(userRole) ? route : null;
    })
    .filter(route => route !== null);
}

// Example usage:

export { routes, filterRoutesByRole };
