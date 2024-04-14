import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useMemo, useState } from 'react';
import { colors } from '../styles/colors'
import { Image } from 'expo-image';
// shadow component
import { Shadow } from 'react-native-shadow-2';
// data
import { skincareProducts } from '../data/skincareProducts';
import { makeupProducts } from '../data/makeupProducts';
import { hairProducts } from '../data/hairProducts';
import { fragranceProducts } from '../data/fragranceProducts';
import { personalCareProducts } from '../data/personalCareProducts';
// icons
import CartIcon from '../assets/svg/CartIcon';
import MenuIcon from '../assets/svg/MenuIcon';

const Home = ({navigation}) => {

    // tabs for cosmetics categories
    const [tabs, setTabs] = useState([
        {title: 'Skincare', active: true},
        {title: 'Makeup', active: false},
        {title: 'Haircare', active: false},
        {title: 'Fragrance', active: false},
        {title: 'Personal Care', active: false},
    ]);

    // products data
    const products = useMemo(() => {
        const activeTabs = tabs.find(tab => tab.active);``
        if (activeTabs.title === 'Skincare') return skincareProducts;
        if (activeTabs.title === 'Makeup') return makeupProducts;
        if (activeTabs.title === 'Haircare') return hairProducts;
        if (activeTabs.title === 'Fragrance') return fragranceProducts;
        if (activeTabs.title === 'Personal Care') return personalCareProducts;
        return []
    }, [tabs])


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

    return (
        <ScrollView style={styles.container}>
            {/* header cions wrapper */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton}>
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
                contentContainerStyle={styles.tabsContainer}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
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
            </ScrollView>
            <View style={styles.productListHeading}>
                <TouchableOpacity style={styles.productListHeadingButton}>
                    <Text style={styles.productListHeadingText}>see more</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={styles.productList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {products.map((product, index) => (
                    <TouchableOpacity
                        key={product.name + index}
                        style={styles.productCard}
                        onPress={() => navigation.navigate("Product", {
                            product_name: product.name,
                            product_price: product.price, 
                            product_image: product.image, 
                        })}
                    >
                        <Shadow 
                            style={styles.productImageShadow}
                            distance={40}
                            offset={[0, 40]}
                            startColor='#00000012'
                        >
                            <Image 
                                source={product.image}
                                style={styles.productImage}
                            />
                        </Shadow>
                        <View style={styles.productTextWrapper}>
                            <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
                                {product.name}
                            </Text>
                            <Text style={styles.productPrice}>
                                ₦{product.price.toLocaleString()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ScrollView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.background,
        paddingVertical: 30,
        minHeight: "100%",
        paddingBottom: 60,
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
    tabsContainer: {
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
        marginTop: 20,
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
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingTop: 70,
        gap: 34,
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
    }

})