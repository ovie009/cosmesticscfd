import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { colors } from '../styles/colors'
import { Image } from 'expo-image';
// app context
import { useGlobals } from "../context/AppContext";
// shadow component
import { Shadow } from 'react-native-shadow-2';
// icons
import CartIcon from '../assets/svg/CartIcon';
import MenuIcon from '../assets/svg/MenuIcon';
import HomeActiveIcon from '../assets/svg/HomeActiveIcon';
import LoveIcon from '../assets/svg/LoveIcon';
import LoveWhiteIcon from '../assets/svg/LoveWhiteIcon';
import SearchIcon from '../assets/svg/SearchIcon';
import SearchWhiteIcon from '../assets/svg/SearchWhiteIcon';
import LoginIcon from '../assets/svg/LoginIcon';
import SignUpIcon from '../assets/svg/SignUpIcon';
// skeletons screen
import HomeSkeleton from '../skeleton/HomeSkeleton';

// firebase
import {
    database,
} from "../Firebase";

// firestore functions
import {
    collection,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";

const Home = ({navigation}) => {

    // page loading
    const [pageLoading, setPageLoading] = useState(true);

    // side navigation open
    const { sideNavOpen, setSideNavOpen } = useGlobals();
    
    // translate ref
    const translate = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(translate, {
            toValue: sideNavOpen ? 0.70 : 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();

        Animated.timing(translateX, {
            toValue: sideNavOpen ? 225 : 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
    }, [sideNavOpen]);
    

    // tabs for cosmetics categories
    const [tabs, setTabs] = useState([
        {title: 'Skincare', active: true},
        {title: 'Makeup', active: false},
        {title: 'Haircare', active: false},
        {title: 'Fragrance', active: false},
        {title: 'Personal Care', active: false},
    ]);

    const [products, setProducts] = useState([]);

    // products data
    const tabProducts = useMemo(() => {
        const activeTabs = tabs.find(tab => tab.active);
        if (activeTabs.title === 'Skincare') {
            return products.filter(product => product.cateory === 'Skincare');
        } 
        if (activeTabs.title === 'Makeup') {
            return products.filter(product => product.cateory === 'Makeup');
        } 
        if (activeTabs.title === 'Haircare') {
            return products.filter(product => product.cateory === 'Haircare');
        } 
        if (activeTabs.title === 'Fragrance') {
            return products.filter(product => product.cateory === 'Fragrance');
        } 
        if (activeTabs.title === 'Personal Care') {
            return products.filter(product => product.cateory === 'Personal Care');
        } 
        return []
    }, [tabs, products])

    useEffect(() => {
        // fetch producs from database
        const fetchProducts = async () => {
            try {
                const productsRef = collection(database, "products");
                const q = query(productsRef, orderBy("product_name"));
                const querySnapshot = await getDocs(q);
                const products = [];
                querySnapshot.forEach((doc) => {
                    products.push({...doc.data(), id: doc.id});
                });
                setProducts(products);
            } catch (error) {
                console.log(error);
            } finally {
                setPageLoading(false);
            }
        }

        fetchProducts();

    }, [tabs]);

    // handle seected tab
    const handleSelectedTab = (tabSelected) => {
        setTabs(prevTabs => {
            return prevTabs.map((item) => {
                return {
                    ...item,
                    active: item.title === tabSelected
                }
            })
        })
    }

    // const uploadData = async () => {
    //     try {
    //         console.log('uploading data...');
    //         // ref to products collection
    //         const productsRef = collection(database, "products");

    //         const products = [
    //             ...skincareProducts,
    //             ...makeupProducts,
    //             ...hairProducts,
    //             ...fragranceProducts,
    //             ...personalCareProducts
    //         ];

    //         products.forEach(async (product) => {
    //             try {

    //                 // check if product name exist, if it does then skip
    //                 const q = query(productsRef, where("product_name", "==", product.name));

    //                 // get docs
    //                 const querySnapshot = await getDocs(q);

    //                 if (querySnapshot.size > 0) {
    //                     console.log("Data", querySnapshot.docs[0].data())
    //                     console.log("Document already exists");
    //                     return;
    //                 }

    //                 // add doc
    //                 await addDoc(productsRef, {
    //                     product_name: product.name,
    //                     price: product.price,
    //                     cateory: product.category,
    //                     created_at: serverTimestamp(),
    //                     edited_at: serverTimestamp(),
    //                 });

    //             } catch (error) {
    //                 console.log("Error adding document: ", error.messsage);
    //             }
    //         })
    //     } catch (error) {
    //         console.log("Erorr creating collection: ", error.messsage);
    //     }
    // }

    return !pageLoading ? <>
        <View 
            style={[
                styles.sideNavigation,
                {backgroundColor: sideNavOpen ? colors.primary : colors.background}
            ]}
        >
            <View style={styles.linksContainer}>
                <TouchableOpacity style={styles.sideNavButton}>
                    <LoveWhiteIcon />
                    <Text style={styles.sideNavButtonText}>Favorites</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sideNavButton}>
                    <SearchWhiteIcon />
                    <Text style={styles.sideNavButtonText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sideNavButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <LoginIcon />
                    <Text style={styles.sideNavButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sideNavButton}
                    onPress={() => navigation.navigate('Login', {
                        user_signup: true,
                    })}
                >
                    <SignUpIcon />
                    <Text style={styles.sideNavButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
        <Animated.ScrollView 
            style={[
                styles.container,
                {transform: [
                    {scale: translate},
                    {translateX: translateX},
                ]},
                sideNavOpen && {borderRadius: 30}
            ]}
            contentContainerStyle={styles.contentContainer}
        >
            {/* header cions wrapper */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => setSideNavOpen(prevValue => !prevValue)}
                >
                    <MenuIcon />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton}>
                    <CartIcon />
                </TouchableOpacity>
            </View>
            {/* header text wrapper */}
            <View style={styles.headerTextWrapper}>
                <Text style={styles.headerSubtext}>
                    Welcome back,
                </Text>
                <Text style={styles.headerMainText}>
                    Promise
                </Text>
            </View>
            {/* tabs container */}
            <ScrollView 
                style={styles.tabMain}
                contentContainerStyle={styles.tabsWrapper}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.tabsContainer}>
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab.title}
                            onPress={() => handleSelectedTab(tab.title)}
                            style={[styles.tab, tab.active && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, tab.active && styles.tabTextActive]}>
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.productListHeading}>
                <TouchableOpacity 
                    style={styles.productListHeadingButton}
                    onPress={() => uploadData()}
                >
                    <Text style={styles.productListHeadingText}>see more</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                style={styles.productListContainer}
                contentContainerStyle={styles.productList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {tabProducts.map((product) => (
                    <TouchableOpacity
                        key={product.id}
                        style={styles.productCard}
                        onPress={() => navigation.navigate("Product", {
                            product_id: product.id,
                            product_name: product.product_name,
                            product_price: product.price, 
                            product_image: product.product_image, 
                        })}
                    >
                        <Shadow 
                            style={styles.productImageShadow}
                            distance={40}
                            offset={[0, 40]}
                            startColor='#00000012'
                        >
                            <Image 
                                source={{uri: product.product_image}}
                                style={styles.productImage}
                            />
                        </Shadow>
                        <View style={styles.productTextWrapper}>
                            <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
                                {product.product_name}
                            </Text>
                            <Text style={styles.productPrice}>
                                ₦{product.price.toLocaleString()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {sideNavOpen && (
                <View style={styles.viewOnlyBottomNavigation}>
                    <HomeActiveIcon />
                    <SearchIcon />
                    <LoveIcon />
                </View>
            )}
        </Animated.ScrollView>
    </> : <HomeSkeleton />
}

export default Home

const styles = StyleSheet.create({
    sideNavigation: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary,
        position: 'absolute',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 30,
        paddingTop: 100,
        paddingBottom: 70,
    },
    linksContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 26,
        width: 120,
    },
    sideNavButton: {
        width: '100%',
        height: 51,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 12,
    },
    sideNavButtonText: {
        flex: 1,
        // width: '100%',
        alignSelf: 'stretch',
        height: '100%',
        borderBottomWidth: 0.3,
        borderColor: colors.listSeperatorLight,
        color: colors.white,
        fontFamily: 'poppins-semibold',
        fontSize: 17,
        lineHeight: 25.5,
        textTransform: 'capitalize',
    },
    container: {
        width: '100%',
        backgroundColor: colors.background,
        paddingVertical: 30,
        paddingBottom: 60,
        zIndex: 3,
        position: 'relative',
        paddingBottom: 100,
    },
    contentContainer: {
        minHeight: '100%',
        // display: 'flex',
        // justifyContent: 'flex-start',
    },
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 30,
    },
    headerButton: {
        height: 24,
        width: 24,
        // backgroundColor: 'lightgrey'
    },
    headerTextWrapper: {
        marginTop: 43,
        display: 'flex',
        gap: 10,
        paddingHorizontal: 30,
    },
    headerSubtext:{
        fontFamily: 'sf-pro-text-regular',
        fontSize: 20,
        color: colors.black
    },
    headerMainText:{
        fontFamily: 'sf-pro-rounded-bold',
        fontSize: 34,
        color: colors.black
    },
    tabMain: {
        // flexGrow: 1,
        maxHeight: 60,
        marginBottom: 20,
        // flexShrink: 0,
        // height: 60,
    },
    tabsWrapper: {
    },
    tabsContainer: {
        height: 50,
        paddingHorizontal: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    tabActive: {
        borderBottomWidth: 3,
        borderColor: colors.primary,
    },
    tabText: {
        fontFamily: 'sf-pro-text-regular',
        fontSize: 17,
        color: colors.neutral,
    },
    tabTextActive: {
        color: colors.primary,
    },
    productListHeading: {
        width: '100%',
        // marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 50,
    },
    productListHeadingText: {
        fontFamily: 'sf-pro-rounded-regular',
        fontSize: 15,
        lineHeight: 18,
        color: colors.primary,
    },
    productList: {
        paddingHorizontal: 30,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingTop: 70,
        gap: 34,
        flexGrow: 0,
        height: 350,
    },
    productCard: {
        height: 270,
        backgroundColor: colors.white,
        width: 220,
        borderRadius: 30,
        padding: 30,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
    },
    productImageShadow: {
        height: 170,
        width: 170,
        top: -30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    productImage: {
        height: 170,
        width: 170,
        borderRadius: 30,
    },
    productTextWrapper: {
        height: 87,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 9,
    },
    productName: {
        fontFamily: 'sf-pro-rounded-semibold',
        fontSize: 22,
        color: colors.black,
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    productPrice: {
        fontFamily: 'sf-pro-rounded-bold',
        fontSize: 17,
        color: colors.primary
    },
    viewOnlyBottomNavigation: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 100,
        paddingTop: 20,
        paddingBottom: 50,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        flexDirection: 'row',
        zIndex: 9,
        borderRadius: 30,
    }
})