import React, { useContext, useEffect } from 'react'
const AuthContext = React.createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            setUser(JSON.parse(userInfo))
        } else {
            setUser(null)
        }
        setLoading(false)
    }, [])

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData))
        localStorage.setItem('token', userData.token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// 2:48:19
