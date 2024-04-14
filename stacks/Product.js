import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
// expo image component
import { Image } from 'expo-image'
import { colors } from '../styles/colors';
// shadow component
import { Shadow } from 'react-native-shadow-2';
// icons
import LoveBlackIcon from '../assets/svg/LoveBlackIcon';
import BackArrowIcon from '../assets/svg/BackArrowIcon';

const Product = ({navigation, route}) => {

    // destruct route paramters
    const {product_name, product_price, product_image} = useMemo(() => {
        return route?.params || {}
    }, [route?.params]);

    // handle like product
    const handleLikeProdcut = () => {
        
    }

    return (
        <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.contentContainer}
        >
            <View style={styles.headerWrapper}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <BackArrowIcon />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleLikeProdcut}
                >
                    <LoveBlackIcon />
                </TouchableOpacity>
            </View>
            <View style={styles.imageWrapper}>
                <Shadow 
                    style={styles.productImageShadow}
                    distance={40}
                    offset={[0, 40]}
                    startColor='#00000012'
                >
                    <Image 
                        source={product_image}
                        style={styles.productImage}
                    />
                </Shadow>
            </View>
            <View style={styles.imageListIndicatorWrapper}>
                <View style={[styles.indicator, styles.active]} />
                <View style={[styles.indicator]} />
            </View>
            <View style={styles.productTextWrapper}>
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
                    {product_name}
                </Text>
                <Text style={styles.price}>
                    ₦{product_price.toLocaleString()}
                </Text>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.headingText}>
                    About Product
                </Text>
                <Text style={styles.paragraph}>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam laborum praesentium eum iste voluptas molestiae natus maxime dolores in vero? Reiciendis minima tenetur temporibus aspernatur sit voluptate consequuntur modi, sed at, nulla quo excepturi porro esse eum earum. Omnis corporis incidunt odit possimus facilis cumque dolore pariatur architecto distinctio ad!
                </Text>
            </View>
            <View style={styles.actionButtonWrapper}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Survey', {
                        product_name: product_name
                    })}
                >
                    <Text style={styles.actionButtonText}>Take Survey</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Product

const styles = StyleSheet.create({
    contentContainer: {
        padding: 30,
        width: "100%",
        minHeight: '100%',
        backgroundColor: colors.background,
    },
    headerWrapper: {
        width: '100%',
        height: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    imageWrapper: {
        width: '100%',
        height: 242,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImageShadow: {
        width: 242,
        height: 242,
        borderRadius: 30,
    },
    productImage: {
        width: 242,
        height: 242,
        borderRadius: 30,
    },
    imageListIndicatorWrapper: {
        width: '100%',
        height: 8,
        marginTop: 38,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        zIndex: 2,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.indicator,
    },
    active: {
        backgroundColor: colors.primary,
    },
    productTextWrapper: {
        marginTop: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    productName: {
        fontFamily: 'sf-pro-rounded-semibold',
        color: colors.black,
        fontSize: 28,
        lineHeight: 33,
        textAlign: 'center',
    },
    price: {
        fontFamily: 'sf-pro-rounded-bold',
        color: colors.primary,
        fontSize: 22,
        lineHeight: 26,
    },
    productInfo: {
        marginTop: 40,
        width: '100%',
    },
    headingText: {
        fontFamily: 'sf-pro-rounded-semibold',
        color: colors.black,
        fontSize: 17,
        lineHeight: 20,
        marginBottom: 7,
    },
    paragraph: {
        fontFamily: 'sf-pro-text-regular',
        color: colors.black,
        fontSize: 15,
        opacity: 0.5,
        lineHeight: 21,
    },
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 30,
    },
    actionButtonText: {
        fontFamily: 'sf-pro-text-semibold',
        color: colors.white,
        fontSize: 17,
    }
})