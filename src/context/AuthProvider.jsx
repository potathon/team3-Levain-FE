import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('accessToken'))

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)