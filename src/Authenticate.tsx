import React, { useState, useEffect, createContext, useContext, PropsWithChildren } from "react"
import * as fcl from "@blocto/fcl"

const initialUser = await fcl.currentUser().snapshot();
export const AuthContext = createContext<any>({ ...initialUser });

export const useAuth = () => useContext(AuthContext);


export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = React.useState<object | null>({ ...initialUser });

    useEffect(() => {
        fcl
            .currentUser()
            .subscribe((user: any) => setUser({ ...user }));
    }
        , [])



    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};
