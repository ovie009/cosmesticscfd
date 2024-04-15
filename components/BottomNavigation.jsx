import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react';
// icons
import HomeIcon from '../assets/svg/HomeIcon';
import HomeActiveIcon from '../assets/svg/HomeActiveIcon';
import LoveActiveIcon from '../assets/svg/LoveActiveIcon';
import LoveIcon from '../assets/svg/LoveIcon';
import SearchIcon from '../assets/svg/SearchIcon';
import SearchActiveIcon from '../assets/svg/SearchActiveIcon';
// react navigation
import { useNavigation } from '@react-navigation/native';
// app context
import { useGlobals } from "../context/AppContext";

const BottomNavigation = () => {

    const navigation = useNavigation();

    // get current stact
    const { currentStack, sideNavOpen } = useGlobals();

    if (sideNavOpen) return <></>;

    // stacks to show navigation
    const visibleStacks = ["Home", "Favorites", "Search"];

    return visibleStacks.includes(currentStack) ?  (
        <View 
            style={[
                styles.container,
            ]}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
            >
                {currentStack === "Home" ? <HomeActiveIcon /> : <HomeIcon />}
            </TouchableOpacity>
            <TouchableOpacity
                // onPress={() => navigation.navigate('Search')}
            >
                {currentStack === "Search" ? <SearchActiveIcon /> : <SearchIcon />}
            </TouchableOpacity>
            <TouchableOpacity
                // onPress={() => navigation.navigate('Favorites')}
                >
                {currentStack === "Favorites" ? <LoveActiveIcon /> : <LoveIcon />}
            </TouchableOpacity>
        </View>
    ) : <></>
}

export default BottomNavigation

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        paddingTop: 20,
        paddingBottom: 50,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        flexDirection: 'row',
        zIndex: 9,
    }
})