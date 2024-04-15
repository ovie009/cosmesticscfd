// react hooks
import {
	createContext,
	useState,
	useContext,
	useEffect,
} from "react";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// firebase AUth
import {
	onAuthStateChanged,
} from "firebase/auth";

// firebase
import { auth } from "../Firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {
	// auth data state
	const [authData, setAuthData] = useState(null);

	// auth listeners
	useEffect(() => {
		// detect changes in auth state
		const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, async (user) => {
			try {
				// console.log("Auth State Changed", user);
				if (!user) {
					return setAuthData(null);
				}
                
                setAuthData(user);
			} catch (error) {
				console.error("auth change arror", error.message);
			}
		})

		return unsubscribeFromAuthStateChanged;
		
				
	}, []);

	return (
		<AuthContext.Provider value={{authData}}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider