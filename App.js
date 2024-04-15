// react hooks
import { useCallback } from 'react';
// splash screen
import * as SplashScreen from 'expo-splash-screen';
// fonts
import { useFonts } from 'expo-font';
// gesture handler
import 'react-native-gesture-handler'; //required import for bottomsheet to function
// react native components
import { SafeAreaView, StatusBar, AppRegistry } from 'react-native';
// navigation paramters
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// routes
import Routes from './router/Routes';
// bottom sheet components
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// components
import BottomNavigation from './components/BottomNavigation';
import Taskbar from './components/Taskbar';
// conetxt
import AppProvider from './context/AppContext';
import AuthProvider from './context/AuthContext';

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
		'poppins-semibold': require('./assets/fonts/Poppins-SemiBold.ttf'),
	});

	//   function to load font
	const onLayoutRootView = useCallback(async () => {
		// wait fpr font and authData to finish loading
		if (fontsLoaded) {
			// remove splash screen
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	// if fonts has not loaded
	if (!fontsLoaded) return null

	return (
		<SafeAreaView style={{flex: 1}} onLayout={onLayoutRootView}>
			<NavigationContainer>
				<AuthProvider>
					<AppProvider>
						<GestureHandlerRootView style={{ flex: 1 }}>
							<BottomSheetModalProvider>
								<Taskbar />
								<Routes />
								<BottomNavigation />
							</BottomSheetModalProvider>
						</GestureHandlerRootView>
					</AppProvider>
				</AuthProvider>
			</NavigationContainer>
		</SafeAreaView>
	);
}

AppRegistry.registerComponent('MyApp', () => App);