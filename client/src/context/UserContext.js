import { createContext, useState } from "react";

export const UserContext = createContext({
    id: null,
    setId: () => {},
});

export const UserProvider = ({ children }) => {
    const [id, setId] = useState(null);

    return(
        <UserContext.Provider value={{ id, setId}}>
            {children}
        </UserContext.Provider>
    )
}