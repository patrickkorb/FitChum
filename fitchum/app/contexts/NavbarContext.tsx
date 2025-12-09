'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextType {
  isNavbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType>({
  isNavbarVisible: true,
  setNavbarVisible: () => {},
});

export function useNavbar() {
  return useContext(NavbarContext);
}

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [isNavbarVisible, setNavbarVisible] = useState(true);

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, setNavbarVisible }}>
      {children}
    </NavbarContext.Provider>
  );
}
