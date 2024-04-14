import { createContext, useState, useEffect, useContext, } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
// back handler

const AppContext = createContext();

export const useGlobals = () => useContext(AppContext);

const AppProvider = ({children}) => {

    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [currentStack, setCurrentStack] = useState("");

    // function to listen for change in navigation, and update currentStack
    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            // update currentStack
            setCurrentStack(navigation.getCurrentRoute().name);
        });
        return unsubscribe;
    }, [isFocused, navigation]);
    
    return (
        <AppContext.Provider 
            value={{
                currentStack,
            }}
        >
           {children}
        </AppContext.Provider>
    );
}
 
export default AppProvider;