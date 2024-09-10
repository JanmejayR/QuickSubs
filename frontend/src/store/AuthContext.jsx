import { createContext , useState} from "react";

export const AuthContext = createContext()

export const AuthContextProvider = ({children})=>{
    const [authState , setAuthState] = useState({
        authStatus : '',
        uuid: '',
        jwt: '',
        loading: false,
    })
    return(
        <AuthContext.Provider value={{authState, setAuthState} }>
            {children}
        </AuthContext.Provider>
    )
}