// import { useState, useEffect, useMemo } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import Icon from "@mui/material/Icon";
// import ArgonBox from "components/ArgonBox";
// import Sidenav from "examples/Sidenav";
// import Configurator from "examples/Configurator";
// import theme from "assets/theme";
// import themeRTL from "assets/theme/theme-rtl";
// import themeDark from "assets/theme-dark";
// import themeDarkRTL from "assets/theme-dark/theme-rtl";
// import rtlPlugin from "stylis-plugin-rtl";
// import { CacheProvider } from "@emotion/react";
// import createCache from "@emotion/cache";
// import routes from "routes";
// import {
//   useArgonController,
//   setMiniSidenav,
//   setOpenConfigurator,
// } from "context";
// import brand from "assets/images/logo-ct.png";
// import brandDark from "assets/images/logo-ct-dark.png";
// import "assets/css/nucleo-icons.css";
// import "assets/css/nucleo-svg.css";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";


// const handleSessionTimeout = () => {
//   // Clear session storage or any other session-related data
//   sessionStorage.clear();
//   localStorage.clear();

//   // Redirect to the sign-in page
//   window.location.replace("/authentication/sign-in/basic");

//   // Show the alert with a brief delay to give a chance to display it
//   setTimeout(() => {
//     Swal.fire({
//       title: 'Session Timeout',
//       text: 'No user activity detected. You are being redirected to sign in again.',
//       icon: 'warning',
//       confirmButtonText: 'OK',
//     });
//   }, 100); // Short delay before showing the alert
// };

// export default function App() {
//   const [controller, dispatch] = useArgonController();
//   const {
//     miniSidenav,
//     direction,
//     layout,
//     openConfigurator,
//     sidenavColor,
//     darkSidenav,
//     darkMode,
//   } = controller;
//   const [onMouseEnter, setOnMouseEnter] = useState(false);
//   const [rtlCache, setRtlCache] = useState(null);
//   const { pathname } = useLocation();
//   const navigate = useNavigate(); // Hook to navigate programmatically

//   // Cache for the rtl
//   useMemo(() => {
//     const cacheRtl = createCache({
//       key: "rtl",
//       stylisPlugins: [rtlPlugin],
//     });

//     setRtlCache(cacheRtl);
//   }, []);

//   // Open sidenav when mouse enter on mini sidenav
//   const handleOnMouseEnter = () => {
//     if (miniSidenav && !onMouseEnter) {
//       setMiniSidenav(dispatch, false);
//       setOnMouseEnter(true);
//     }
//   };

//   // Close sidenav when mouse leave mini sidenav
//   const handleOnMouseLeave = () => {
//     if (onMouseEnter) {
//       setMiniSidenav(dispatch, true);
//       setOnMouseEnter(false);
//     }
//   };

//   // Change the openConfigurator state
//   const handleConfiguratorOpen = () =>
//     setOpenConfigurator(dispatch, !openConfigurator);

//   // Setting the dir attribute for the body element
//   useEffect(() => {
//     document.body.setAttribute("dir", direction);
//   }, [direction]);

//   // Setting page scroll to 0 when changing the route
//   useEffect(() => {
//     document.documentElement.scrollTop = 0;
//     document.scrollingElement.scrollTop = 0;
//   }, [pathname]);

//   // Timer for session inactivity
//   useEffect(() => {
//     let timeout;
//     const resetTimer = () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(handleSessionTimeout, 5 * 60 * 1000); // 5 minutes timeout
//     };

//     // Set up event listeners to detect user activity
//     window.addEventListener('mousemove', resetTimer);
//     window.addEventListener('keypress', resetTimer);

//     // Clean up event listeners and timer on component unmount
//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener('mousemove', resetTimer);
//       window.removeEventListener('keypress', resetTimer);
//     };
//   }, []);

//   const getRoutes = (allRoutes) =>
//     allRoutes.map((route) => {
//       if (route.collapse) {
//         return getRoutes(route.collapse);
//       }

//       if (route.route && !route.hideInMenu) {
//         return (
//           <Route
//             exact
//             path={route.route}
//             element={route.component}
//             key={route.key}
//           />
//         );
//       }

//       return null;
//     });

//   const configsButton = (
//     <ArgonBox
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       width="3.5rem"
//       height="3.5rem"
//       bgColor="white"
//       shadow="sm"
//       borderRadius="50%"
//       position="fixed"
//       right="2rem"
//       bottom="2rem"
//       zIndex={99}
//       color="dark"
//       sx={{ cursor: "pointer" }}
//       onClick={handleConfiguratorOpen}
//     >
//       <Icon fontSize="default" color="inherit">
//         settings
//       </Icon>
//     </ArgonBox>
//   );

//   return direction === "rtl" ? (
//     <CacheProvider value={rtlCache}>
//       <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
//         <CssBaseline />
//         {layout === "dashboard" && (
//           <>
//             <Sidenav
//               color={sidenavColor}
//               brand={darkSidenav || darkMode ? brand : brandDark}
//               brandName="GEMS"
//               routes={routes}
//               onMouseEnter={handleOnMouseEnter}
//               onMouseLeave={handleOnMouseLeave}
//             />
//             <Configurator />
//             {configsButton}
//           </>
//         )}
//         {layout === "vr" && <Configurator />}
//         <Routes>
//           {getRoutes(routes)}
//           <Route
//             path="*"
//             element={<Navigate to="/authentication/sign-in/basic" />}
//           />
//         </Routes>
//       </ThemeProvider>
//     </CacheProvider>
//   ) : (
//     <ThemeProvider theme={darkMode ? themeDark : theme}>
//       <CssBaseline />
//       {layout === "dashboard" && (
//         <>
//           <Sidenav
//             color={sidenavColor}
//             brand={darkSidenav || darkMode ? brand : brandDark}
//             brandName="GEMS"
//             routes={routes}
//             onMouseEnter={handleOnMouseEnter}
//             onMouseLeave={handleOnMouseLeave}
//           />
//           <Configurator />
//           {configsButton}
//         </>
//       )}
//       {layout === "vr" && <Configurator />}
//       <Routes>
//         {getRoutes(routes)}
//         <Route
//           path="*"
//           element={<Navigate to="/authentication/sign-in/basic" />}
//         />
//       </Routes>
//     </ThemeProvider>
//   );
// }


import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import ArgonBox from "components/ArgonBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { useUserRole } from "./context/UserRoleContext"; 
import {
  useArgonController,
  setMiniSidenav,
  setOpenConfigurator,  // Assuming setUserRole exists in the context
} from "context";
import brand from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import "assets/css/nucleo-icons.css";
import "assets/css/nucleo-svg.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const handleSessionTimeout = () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.replace("/authentication/sign-in/basic");

  setTimeout(() => {
    Swal.fire({
      title: 'Session Timeout',
      text: 'No user activity detected. You are being redirected to sign in again.',
      icon: 'warning',
      confirmButtonText: 'OK',
    });
  }, 100);
};

export default function App() {
  const [controller, dispatch] = useArgonController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    darkSidenav,
    darkMode,
   
      // Accessing userRole from context
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Direction and scroll reset on route change
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Timer for session inactivity
  useEffect(() => {
    let timeout;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleSessionTimeout, 5 * 60 * 1000); // 5-minute timeout
    };

    // Set up event listeners to detect user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, [ dispatch]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && !route.hideInMenu) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = (
    <ArgonBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </ArgonBox>
  );

  return (
    <ThemeProvider theme={direction === "rtl" ? (darkMode ? themeDarkRTL : themeRTL) : (darkMode ? themeDark : theme)}>
      <CacheProvider value={rtlCache}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={darkSidenav || darkMode ? brand : brandDark}
              brandName="GEMS"
              routes={roleBaseRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        
        <Routes>
          {getRoutes(routes)}
          <Route
            path="*"
            element={<Navigate to="/authentication/sign-in/basic" />}
          />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={darkSidenav || darkMode ? brand : brandDark}
            brandName="GEMS"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        <Route
          path="*"
          element={<Navigate to="/authentication/sign-in/basic" />}
        />
      </Routes>
    </ThemeProvider>
  );
}
