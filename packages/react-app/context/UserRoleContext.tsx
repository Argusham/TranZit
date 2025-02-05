// src/context/UserRoleContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface UserRoleContextProps {
  role: 'driver' | 'commuter' | null;
  setRole: (role: 'driver' | 'commuter') => void;
}

const UserRoleContext = createContext<UserRoleContextProps | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<'driver' | 'commuter' | null>(null);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
