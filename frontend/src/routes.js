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




const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboards/default",
    component: <Default />,

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

    icon: (
      <ArgonBox
        component="i"
        color="primary"
        fontSize="14px"
        className="ni ni-shop"
      />
    ),
    noCollapse: true,
  },{
    type: "collapse",
    name: "Dashboard",
    key: "dashboardUser",
    route: "/dashboards/user",
    component: <DefaultUser />,

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
    name: "Leave",
    key: "leave",
    icon: (
      <ArgonBox
        component="i"
        color="warning"
        fontSize="14px"
        className="ni ni-send"
      />
    ),

    collapse: [
      {
        name: "Add Leave",
        key: "add-leave",
        route: "/admin/leave/new-leave",
        component: <NewLeave />,
      },
      {
        name: "Edit Leave",
        key: "edit-leave",
        route: "/admin/leave/edit-leave",
        component: <EditLeave />,
      },
      {
        name: "All Leaves",
        key: "all-leaves",
        route: "/admin/leave/leave-list",
        component: <LeaveList />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Duty Schedule",
    key: "dutymgmt",
    icon: (
      <ArgonBox
        component="i"
        color="error"
        fontSize="14px"
        className="ni ni-ruler-pencil"
      />
    ),

    collapse: [
      {
        name: "Add Schedule",
        key: "add-schedule",
        route: "/admin/schedule/new-schedule",
        component: <NewSchedule />,
      },
      {
        name: "Edit Schedule",
        key: "edit-schedule",
        route: "/admin/schedule/edit-schedule",
        component: <EditSchedule />,
      },
      {
        name: "All Schedule",
        key: "all-schedule",
        route: "/admin/schedule/schedule-list",
        component: <ScheduleList />,
      },
      {
        name: "Daily Schedule",
        key: "dailySchedule",
        route: "/applications/calendar",
        component: <DailySchedule />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Search",
    key: "search",
    route: "/search",
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

  { type: "divider", key: "divider-2" },
  { type: "title", title: "Reports", key: "title-reports" },
  {
    type: "collapse",
    name: "Leave Report",
    key: "leavereport",
    route: "/reports/leavereport/",
    component: <LeaveReport />,

    icon: (
      <ArgonBox
        component="i"
        color="success"
        fontSize="14px"
        className="ni ni-bus-front-12"
      />
    ),
    noCollapse: true,
  },

  { type: "divider", key: "divider-1" },
  { type: "title", title: "Admin", key: "title-admin" },
  {
    type: "collapse",
    name: "Basic Information",
    key: "basic",
    icon: (
      <ArgonBox
        component="i"
        color="success"
        fontSize="14px"
        className="ni ni-single-copy-04"
      />
    ),
    collapse: [
      {
        name: "Bio Data",
        key: "biodata",
        collapse: [
          {
            name: "Add BioData",
            key: "add-biodata",
            route: "/admin/biodata/new-biodata",
            component: <NewBioData />,
          },
          {
            name: "Edit BioData",
            key: "edit-biodata",
            route: "/admin/biodata/edit-biodata",
            component: <EditBioData />,
          },

          {
            name: "BioData List",
            key: "biodata-list",
            route: "/admin/biodata/biodata-list",
            component: <BioDataList />,
          },
        ],
      },
      {
        name: "Contact Addresses",
        key: "contactaddresses",
        collapse: [
          {
            name: "Add Contact",
            key: "add-contact",
            route: "/admin/contact/new-contact",
            component: <NewContact />,
          },
          {
            name: "Edit Contact",
            key: "edit-contact",
            route: "/admin/contact/edit-contact",
            component: <EditContact />,
          },

          {
            name: "Contact List",
            key: "contact-list",
            route: "/admin/contact/contact-list",
            component: <ContactList />,
          },
        ],
      },
      {
        name: "NOK",
        key: "nok",
        collapse: [
          {
            name: "Add NOK",
            key: "add-nok",
            route: "/admin/nok/new-nok",
            component: <NewNOK />,
          },
          {
            name: "Edit NOK",
            key: "edit-nok",
            route: "/admin/nok/edit-nok",
            component: <EditNOK />,
          },

          {
            name: "NOK List",
            key: "nok-list",
            route: "/admin/nok/nok-list",
            component: <NOKList />,
          },
        ],
      },
      {
        name: "Employee",
        key: "employee",
        collapse: [
          // {
          //   name: "Add Employee",
          //   key: "add-employee",
          //   route: "/admin/employee/new-employee",
          //   component: <NewEmployee />,
          // },
          {
            name: "Edit Employee",
            key: "edit-employee",
            route: "/admin/employee/edit-employee",
            component: <EditEmployee />,
          },

          {
            name: "Employee List",
            key: "employee-list",
            route: "/admin/employee/employee-list",
            component: <EmployeList />,
          },
        ],
      },
    ],
  },
  {
    type: "collapse",
    name: "Courses/ Promotions",
    key: "courses",
    icon: (
      <ArgonBox
        component="i"
        color="info"
        fontSize="14px"
        className="ni ni-books"
      />
    ),
    collapse: [
      {
        name: "Course",
        key: "course",
        collapse: [
          {
            name: "Add Course",
            key: "add-course",
            route: "/admin/course/new-course",
            component: <NewCourse />,
          },
          {
            name: "Edit Course",
            key: "edit-course",
            route: "/admin/course/edit-course",
            component: <EditCourse />,
          },

          {
            name: "Course List",
            key: "course-list",
            route: "/admin/course/courses-list",
            component: <CourseList />,
          },
        ],
      },
      {
        name: "Course Details",
        key: "coursecompletion",
        collapse: [
          {
            name: "Add Course Completion",
            key: "add-coursecompletion",
            route: "/admin/coursecompletion/new-coursecompletion",
            component: <NewCourseCompletion />,
          },
          {
            name: "Edit Course Completion",
            key: "edit-coursecompletion",
            route: "/admin/coursecompletion/edit-coursecompletion",
            component: <EditCourseCompletion />,
          },

          {
            name: "Course Completion List",
            key: "coursecompletion-list",
            route: "/admin/coursecompletion/coursecompletion-list",
            component: <CourseCompletionList />,
          },
        ],
      },
    ],
  },
  {
    type: "collapse",
    name: "LUVs",
    key: "luvs",
    icon: (
      <ArgonBox
        component="i"
        color="inherit"
        fontSize="14px"
        className="ni ni-settings"
      />
    ),

    collapse: [
      {
        name: "Users",
        key: "add-user",
        route: "/admin/users/",
        component: <Users />,
      },
      {
        name: "Trade",
        key: "trade",
        route: "/admin/trade/",
        component: <Trade />,
      },
      {
        name: "LeaveType",
        key: "trade",
        route: "/admin/leavetype/",
        component: <LeaveType />,
      },
      {
        name: "Medical Status",
        key: "medicalstatus",
        route: "/admin/medicalstatus/",
        component: <MedicalStatus />,
      },
      {
        name: "Ranks",
        key: "ranks",
        route: "/admin/ranks/",
        component: <Ranks />,
      },

      {
        name: "Battery",
        key: "batteries",
        collapse: [
          {
            name: "Add Battery",
            key: "add-battery",
            route: "/admin/batteries/new-battery",
            component: <NewBattery />,
          },
          {
            name: "Edit Battery",
            key: "edit-battery",
            route: "/admin/batteries/edit-battery",
            component: <EditBattery />,
          },

          {
            name: "Batteries List",
            key: "batteries-list",
            route: "/admin/batteries/batteries-list",
            component: <BatteryList />,
          },
        ],
      },
      {
        name: "Appts",
        key: "appts",
        collapse: [
          {
            name: "Add Appt",
            key: "add-appt",
            route: "/admin/appts/new-appt",
            component: <NewAppt />,
          },
          {
            name: "Edit Appt",
            key: "edit-appt",
            route: "/admin/appts/edit-appt",
            component: <EditAppt />,
          },

          {
            name: "Appts List",
            key: "appts-list",
            route: "/admin/appts/appts-list",
            component: <ApptList />,
          },
        ],
      },

      {
        name: "Locations",
        key: "location",
        collapse: [
          {
            name: "Add Location",
            key: "add-location",
            route: "/admin/location/new-location",
            component: <NewLocation />,
          },
          {
            name: "Edit Location",
            key: "edit-location",
            route: "/admin/location/edit-location",
            component: <EditLocation />,
          },

          {
            name: "Locations List",
            key: "locations-list",
            route: "/admin/location/locations-list",
            component: <LocationList />,
          },
        ],
      },
      {
        name: "Duties",
        key: "duty",
        collapse: [
          {
            name: "Add Duty",
            key: "add-duty",
            route: "/admin/duty/new-duty",
            component: <NewDuty />,
          },
          {
            name: "Edit Duty",
            key: "edit-duty",
            route: "/admin/duty/edit-duty",
            component: <EditDuty />,
          },

          {
            name: "Duty List",
            key: "duty-list",
            route: "/admin/duty/duty-list",
            component: <DutyList />,
          },
        ],
      },
      {
        name: "Leave Circle",
        key: "add-lveCircle",
        route: "/admin/leavecircle/",
        component: <LeaveCircle />,
      },
    ],
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
          },
        ],
      },
    ],
  },
];

export default routes;
