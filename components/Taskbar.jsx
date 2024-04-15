import { StatusBar } from 'react-native'
import React from 'react'
// app context
import { useGlobals } from "../context/AppContext";
import { colors } from '../styles/colors';

const Taskbar = () => {

    // get current stact
    const { sideNavOpen } = useGlobals();

    return (
        <StatusBar 
            style="dark" 
            backgroundColor={sideNavOpen ? colors.primary : colors.background}
        />
    )
}

export default Taskbar