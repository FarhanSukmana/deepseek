'use client'

import { useUser } from "@clerk/nextjs";
import { Children, useContext } from "react";

export const AppContext = createContext();

export const useAppContext = () =>{
  return useContext(AppContext)
}

export const AppContextProvider = ({children}) =>{
  const {user} = useUser()

  const value ={
    user
  }
  
  return <AppContext.privider value={value}>{children}</AppContext.privider>
}