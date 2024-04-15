// recat
import React from 'react';
// use stack
import { useAuth } from '../context/AuthContext';
// stack navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// stacks
// stacks
import Home from '../stacks/Home';
import Checkout from '../stacks/Checkout';
import Favorites from '../stacks/Favorites';
import Survey from '../stacks/Survery';
import Search from '../stacks/Search';
import Product from '../stacks/Product';
import Login from '../stacks/Login';
import Analytics from '../stacks/Analytics';


const Routes = () => {

    const { authData } = useAuth();  // auth data

    console.log(authData);
    // stack components
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName={authData ? 'Analytics' : 'Home'}
            screenOptions={{
                headerShown: false
            }}
        >
            {authData ? (
                <Stack.Group>
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