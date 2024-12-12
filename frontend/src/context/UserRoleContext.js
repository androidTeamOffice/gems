// src/context/UserRoleContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { filterRoutesByRole, routes } from "routes";

const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [role, setRole] = useState("guest");
  const [id, setId] = useState(1);
  const [roleBaseRoutes, setRoleBaseRoutes] = useState([]);

  useEffect(() => {
    setRoleBaseRoutes(filterRoutesByRole(routes, role));
  }, [role]); // Only update when role changes

  const updateRole = (newRole) => setRole(newRole);
  const updateid = (newid) => setId(newid);

  return (
    <UserRoleContext.Provider value={{ role, roleBaseRoutes,id, updateRole, updateid }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
