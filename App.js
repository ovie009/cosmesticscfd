// react hooks
import { useCallback } from 'react';
// splash screen
import * as SplashScreen from 'expo-splash-screen';
// fonts
import { useFonts } from 'expo-font';
// gesture handler
import 'react-native-gesture-handler'; //required import for bottomsheet to function
// react native components
import { SafeAreaView, StatusBar, AppRegistry, Text } from 'react-native';
// navigation paramters
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// stacks
import Home from './stacks/Home';
import Checkout from './stacks/Checkout';
import Favorites from './stacks/Favorites';
import Survey from './stacks/Survery';
import Search from './stacks/Search';
import Product from './stacks/Product';
// bottom sheet components
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// components
import BottomNavigation from './components/BottomNavigation';
// conetxt
import AppProvider from './context/AppContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {

	// declare fonts 
	const [fontsLoaded] = useFonts({
		'sf-pro-rounded-regular': require('./assets/fonts/SF-Pro-Rounded-Regular.ttf'),
		'sf-pro-rounded-semibold': require('./assets/fonts/SF-Pro-Rounded-Semibold.ttf'),
		'sf-pro-rounded-bold': require('./assets/fonts/SF-Pro-Rounded-Bold.ttf'),
		'sf-pro-text-regular': require('./assets/fonts/SF-Pro-Text-Regular.ttf'),
		'sf-pro-text-semibold': require('./assets/fonts/SF-Pro-Text-Semibold.ttf'),
	});

	//   function to load font
	const onLayoutRootView = useCallback(async () => {
		// wait fpr font and authData to finish loading
		if (fontsLoaded) {
			// remove splash screen
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	// stack wrapper
	const Stack = createNativeStackNavigator();

	// if fonts has not loaded
	if (!fontsLoaded) return null

	return (
		<SafeAreaView style={{flex: 1}} onLayout={onLayoutRootView}>
			<NavigationContainer>
				<AppProvider>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<BottomSheetModalProvider>
							<StatusBar 
								style="dark" 
								backgroundColor={'#fff'}
							/>
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
							<BottomNavigation />
						</BottomSheetModalProvider>
					</GestureHandlerRootView>
				</AppProvider>
			</NavigationContainer>
		</SafeAreaView>
	);
}

AppRegistry.registerComponent('MyApp', () => App);