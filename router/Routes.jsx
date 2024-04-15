// recat
import React from 'react';
// use stack
import { useAuth } from '../context/AuthContext';
// react hooks
// stack navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// stacks
import Home from '../stacks/Home';
import Checkout from '../stacks/Checkout';
import Favorites from '../stacks/Favorites';
import Survey from '../stacks/Survery';
import Search from '../stacks/Search';
import Product from '../stacks/Product';
import Login from '../stacks/Login';
import Analytics from '../stacks/Analytics';
import Dashboard from '../stacks/Dashboard';

const Routes = () => {

    // auth data
    const { authData, authLoading } = useAuth();  // auth data

    // stack components
    const Stack = createNativeStackNavigator();

    	//   function to load font
	// useCallback(async () => {
	// 	// wait fpr font and authData to finish loading
	// 	if (!authLoading) {
	// 		// remove splash screen
	// 		await SplashScreen.hideAsync();
	// 	}
	// }, [authLoading]);

    if (authLoading) return null;

    return (
        <Stack.Navigator
            initialRouteName={authData ? 'Dashboard' : 'Home'}
            screenOptions={{
                headerShown: false
            }}
        >
            {authData ? (
                <Stack.Group>
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name="Analytics" component={Analytics} />
                </Stack.Group>
            ) : (
                <Stack.Group>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Checkout" component={Checkout} />
                    <Stack.Screen name="Favorites" component={Favorites} />
                    <Stack.Screen name="Product" component={Product} />
                    <Stack.Screen name="Search" component={Search} />
                    <Stack.Screen name="Survey" component={Survey} />
                    <Stack.Screen name="Login" component={Login} />
                </Stack.Group>
            )}
        </Stack.Navigator>
    )
}

export default Routes