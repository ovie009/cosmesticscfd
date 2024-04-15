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

const Routes = () => {

    const { authData } = useAuth();  // auth data

    // stack components
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Favorites" component={Favorites} />
            <Stack.Screen name="Product" component={Product} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Survey" component={Survey} />
        </Stack.Navigator>
    )
}

export default Routes