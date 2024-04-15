import { StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import React, { useState, useMemo, useEffect } from 'react'
import { colors } from '../styles/colors'
// shadow component
import { Shadow } from 'react-native-shadow-2';
// expo image
import { Image } from 'expo-image';
// components
import CustomButton from '../components/CustomButton';
// auth
import { auth } from "../Firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// window width
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Login = ({navigation, route}) => {

    // destruct route paramters
    const { user_signup } = useMemo(() => {
        return route?.params || {}
    }, [route?.params]);

    // tab
    const [tab, setTab] = useState(user_signup ? "Signup" : "Login");

    // email input
    const [email, setEmail] = useState("");

    // passowrd input
    const [password, setPassword] = useState("");

    // disable button state
    const disabled = !email || !password

    // isloading state
    const [isLoading, setIsLoading] = useState(false);

    // handle signup funcion
    const handleSignup = async () => {
        try {
            // enable loading state
            setIsLoading(true);

            await createUserWithEmailAndPassword(
                auth, 
                email, 
                password
            );
            
        } catch (error) {
            
        } finally {
            // disable loading state
            setIsLoading(false);
        }
    }

    const handleLogin = async () => {
        try {
            // enable loading state
            setIsLoading(true);
            await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
        } catch (error) {
            console.log(error.message);
        } finally {
            // disable loading state
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Shadow 
                style={styles.tabContainer}
                distance={30}
                offset={[0, 4]}
                startColor='#0000000F'
            >
                <View style={styles.iconWrapper}>
                    <Image
                        source={require('../assets/app/icon.png')}
                        style={styles.icon}
                    />
                </View>
                <View style={styles.tabWrapper}>
                    <TouchableOpacity 
                        style={[
                            styles.tabButton,
                        ]}
                        onPress={() => setTab("Login")}
                    >
                        <Text style={styles.tabText}>Login</Text>
                        {tab === "Login" && (
                            <Shadow 
                                style={styles.activeTab}
                                distance={4}
                                offset={[0, 4]}
                                startColor='#C33F151A'
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.tabButton
                        ]}
                        onPress={() => setTab("Signup")}
                    >
                        <Text style={styles.tabText}>Sign-up</Text>
                        {tab === "Signup" && (
                            <Shadow 
                                style={styles.activeTab}
                                distance={4}
                                offset={[0, 4]}
                                startColor='#C33F151A'
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </Shadow>
            <View style={styles.inputsContainer}>
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContent}>
                        <Text style={styles.inputLabel}>
                            Email address
                        </Text>
                        <TextInput
                            placeholder='johndoe@gamil.com'
                            placeholderTextColor={colors.neutral}
                            style={styles.searchBarInput}
                            onChangeText={setEmail}
                            textAlignVertical='bottom'
                            value={email}
                        />
                    </View>
                    <View style={styles.inputContent}>
                        <Text style={styles.inputLabel}>
                            Password
                        </Text>
                        <TextInput
                            placeholder={'••••••••••••'}
                            placeholderTextColor={colors.neutral}
                            style={styles.searchBarInput}
                            onChangeText={setPassword}
                            textAlignVertical='bottom'
                            secureTextEntry={true}
                            value={password}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {}}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <CustomButton
                    text={tab}
                    onPress={tab === "Login" ? handleLogin : handleSignup}
                    isLoading={isLoading}
                    disabled={disabled}
                />
            </View>
        </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    tabContainer: {
        height: 0.4 * windowHeight,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        width: windowWidth,
        backgroundColor: colors.white,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 50,
    },
    tabWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 30,
    },
    tabButton: {
        width: 120,
        height: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    tabText: {
        fontFamily: 'sf-pro-text-semibold',
        fontSize: 18,
        lineHeight: 21,
        color: colors.black,
    },
    activeTab: {
        // position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: 120,
        height: 3,
        backgroundColor: colors.primary,
        borderRadius: 40
    },
    iconWrapper: {
        width: 120,
        height: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 120,
        height: 120,
    },
    searchBarInput: {
        fontFamily: 'sf-pro-text-semibold',
        fontSize: 17,
        color: colors.black,
        height: 41,
        paddingBottom: 12,
        width: '100%',
        borderBottomColor: colors.black,
        borderBottomWidth: 0.5,
    },
    inputsContainer: {
        flex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
        // height: windowHeight * 0.6,
        height: '60%',
        // gap: 30,
        // paddingHorizontal: 30,
        // marginTop: 50
    },
    inputWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 46,
    },
    inputContent: {
        width: '100%',
    },
    inputLabel: {
        fontFamily: 'sf-pro-text-semibold',
        fontSize: 17,
        color: colors.black,
        opacity: 0.4,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontFamily: 'sf-pro-text-semibold',
        fontSize: 17,
        lineHeight: 20,
    }
})