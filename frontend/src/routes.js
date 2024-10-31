/** 
  All of the routes for the Argon Dashboard 2 PRO MUI are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Argon Dashboard 2 PRO MUI layouts

import Default from "layouts/dashboards/default";

import SignInBasic from "layouts/authentication/sign-in/basic";
import SignUpBasic from "layouts/authentication/sign-up/basic";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";

//Admin LUVs

import NewBattery from "layouts/pages/admin/batteries/new-battery";
// import RankList from "layouts/pages/admin/batteries/batteries-list";
// import EditRank from "layouts/pages/admin/batteries/edit-battery";

import NewLocation from "layouts/pages/admin/location/new-location";
import LocationList from "layouts/pages/admin/location/location-list";
import EditLocation from "layouts/pages/admin/location/edit-location";
import NewDuty from "layouts/pages/admin/duty/new-duty";
import DutyList from "layouts/pages/admin/duty/duty-list";
import EditDuty from "layouts/pages/admin/duty/edit-duty";
import NewBioData from "layouts/pages/admin/biodata/new-biodata";
import BioDataList from "layouts/pages/admin/biodata/biodata-list";
import EditBioData from "layouts/pages/admin/biodata/edit-biodata";
import NewContact from "layouts/pages/admin/contact/new-contact";
import ContactList from "layouts/pages/admin/contact/contact-list";
import EditContact from "layouts/pages/admin/contact/edit-contact";
import NewNOK from "layouts/pages/admin/nok/new-nok";
import NOKList from "layouts/pages/admin/nok/nok-list";
import NewEmployee from "layouts/pages/admin/employee/new-employee";
import EmployeeList from "layouts/pages/admin/employee/employee-list";
import EmployeList from "layouts/pages/admin/employee/employee-list";
import EditEmployee from "layouts/pages/admin/employee/edit-employee";
import EditNOK from "layouts/pages/admin/nok/edit-nok";
import NewCourse from "layouts/pages/admin/course/new-course";
import CourseList from "layouts/pages/admin/course/courses-list";
import EditCourse from "layouts/pages/admin/course/edit-course";
import NewCourseCompletion from "layouts/pages/admin/coursecompletion/new-coursecompletion";
import EditCourseCompletion from "layouts/pages/admin/coursecompletion/edit-coursecompletion";
import CourseCompletionList from "layouts/pages/admin/coursecompletion/coursecompletion-list";
import NewLeave from "layouts/pages/admin/leave/new-leave";
import LeaveList from "layouts/pages/admin/leave/leave-list";
import EditLeave from "layouts/pages/admin/leave/edit-leave";
import NewSchedule from "layouts/pages/admin/schedule/new-schedule";
import ScheduleList from "layouts/pages/admin/schedule/schedule-list";
import EditSchedule from "layouts/pages/admin/schedule/edit-schedule";
import DailySchedule from "layouts/applications/calendar";
import NewAppt from "layouts/pages/admin/appts/new-appt";
import ApptList from "layouts/pages/admin/appts/appts-list";
import EditAppt from "layouts/pages/admin/appts/edit-appt";
import BatteryList from "layouts/pages/admin/batteries/batteries-list";
import EditBattery from "layouts/pages/admin/batteries/edit-battery";
import SearchData from "layouts/pages/search";

//Reports
import LeaveReport from "layouts/pages/reports/leavereport";
// Admin Latest LUVs
import Users from "layouts/pages/admin/users";
import Trade from "layouts/pages/admin/trade";
import LeaveType from "layouts/pages/admin/leavetype";
import LeaveCircle from "layouts/pages/admin/leavecircle";
import MedicalStatus from "layouts/pages/admin/medicalstatus"
import Ranks from "layouts/pages/admin/ranks"
import DefaultManager from "layouts/dashboards/manager";
import DefaultUser from "layouts/dashboards/user";
import UserInfo from "layouts/pages/user_doc_upload";




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
