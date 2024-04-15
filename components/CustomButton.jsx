import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native'
import React, {useEffect, useRef} from 'react'
import { colors } from '../styles/colors'

const CustomButton = ({onPress, disabled, inactive, isLoading, text}) => {

    const translate1 = useRef(new Animated.Value(0)).current;
    const translate2 = useRef(new Animated.Value(0)).current;
    const translate3 = useRef(new Animated.Value(0)).current;

    // animate box function
    const animateBox = (translateValue) => {
        Animated.sequence([
            Animated.timing(translateValue, {
              toValue: -10,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
            Animated.timing(translateValue, {
              toValue: 5,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
            Animated.timing(translateValue, {
              toValue: 0,
              duration: 150,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
        ]).start();
    };

    // animate on isloading state being true
    useEffect(() => {
        
        let intervalId;
        
        const animateAllBoxes = () => {
            animateBox(translate1, 0);
            setTimeout(() => animateBox(translate2), 100);
            setTimeout(() => animateBox(translate3), 200);        
        }
        
        const startAnimation = () => {
            animateAllBoxes()
            intervalId = setInterval(animateAllBoxes, 1200);
        };

        const stopAnimation = () => {
            // reset values
            translate1.setValue(0);
            translate2.setValue(0);
            translate3.setValue(0);
            clearInterval(intervalId);
        };

        if (isLoading) {
            startAnimation();
        } else {
            stopAnimation();
        }

        return () => {
            stopAnimation();
        };

    }, [isLoading]);

    // handle on press function
    const handleOnPress = () => {
        if (isLoading) return () => {};
        if (inactive) return () => {};
        return onPress();
    }

    return (
        <View style={styles.actionButtonWrapper}>
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    disabled && styles.disabledButton
                ]}
                onPress={handleOnPress}
            >
                { isLoading ? (
                    <>
                        <Animated.View
                            style={[
                                styles.loadingBalls,
                                {transform: [{ translateY: translate1 }]}
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.loadingBalls,
                                {transform: [{ translateY: translate2 }]}
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.loadingBalls,
                                {transform: [{ translateY: translate3 }]}
                            ]}
                        />
                    </>                    
                ) : (
                    <Text style={styles.actionButtonText}>{text}</Text>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    actionButtonWrapper: {
        width: '100%',
        display: '100%',
        justifyContent:'center',
        alignItems: 'center',
        paddingTop: 30,
    },
    actionButton: {
        width: '100%',
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 30,
    },
	disabledButton: {
		backgroundColor: colors.primaryDisabled,
	},
    actionButtonText: {
        fontFamily: 'sf-pro-text-semibold',
        color: colors.white,
        fontSize: 17,
    },
    loadingBalls: {
        borderRadius: 6,
        width: 12,
        height: 12,
        backgroundColor: colors.white,
        // marginBottom: -5,
    },
})