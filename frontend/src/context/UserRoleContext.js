// src/context/UserRoleContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { filterRoutesByRole, routes } from "routes";

const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [role, setRole] = useState("guest");
  const [roleBaseRoutes, setRoleBaseRoutes] = useState([]);

  useEffect(() => {
    setRoleBaseRoutes(filterRoutesByRole(routes, role));
  }, [role]); // Only update when role changes

  const updateRole = (newRole) => setRole(newRole);

  return (
    <UserRoleContext.Provider value={{ role, roleBaseRoutes, updateRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}