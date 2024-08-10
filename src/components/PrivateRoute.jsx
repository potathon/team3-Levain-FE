import { useAuth } from "../context/AuthProvider"
import { Navigate } from "react-router-dom"
import React from "react"


const PrivateRoute = ({ element }) => {
    const { isAuth } = useAuth()

    return isAuth ? element : <Navigate to="/login" replace />
}

export default PrivateRoute