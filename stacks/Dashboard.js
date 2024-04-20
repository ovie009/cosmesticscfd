import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'
// icons
import BackArrowIcon from '../assets/svg/BackArrowIcon';
import { colors } from '../styles/colors';
// shadow
import { Shadow } from 'react-native-shadow-2';
// components
import CustomButton from '../components/CustomButton';
import SuccessPrompt from '../components/SuccessPrompt';
import { Image } from 'expo-image';

// firebase
import {
    database,
} from "../Firebase";

// firestore functions
import {
    collection,
    getDocs,
    onSnapshot,
    query,
    orderBy,
} from "firebase/firestore";
// sign out
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
// skeleton screen
import DashboardSkeleton from '../skeleton/DashboardSkeleton';

// window width
const windowWidth = Dimensions.get("window").width;

const Dashboard = ({navigation}) => {

	// survey questions
	const [surveyQuestions, setSurveyQuestions] = useState([
		{
			id: 'qRzwquEGnJB503WnpIK9',
			question: 'Have you used this product before?',
			options: [
				{text: 'Yes', value: 1},
				{text: 'No', value: 0},
			],
			answer: null,
		},
		{
			id: 'yqkgJiwS6Gz4pzEOqH8P',
			question: 'What factors influence your decision to purchase this product?',
			options: [
				{text: 'Price', value: 1},
				{text: 'Ingredients', value: 2},
				{text: 'Brand Reputation', value: 3},
				{text: 'Products Reviews', value: 4},
			],
			answer: null,
		},
		{
			id: 'slWnymirA3Z4VQEHj3BI',
			question: 'How often are you likely to buy this product?',
			options: [
				{text: 'Weekly', value: 1},
				{text: 'Monthly', value: 2},
				{text: 'Bi-Monthly', value: 3},
				{text: 'Occassionally', value: 4},
			],
			answer: null,
		},
		{
			id: 't3PUQ5Z5YGpjU3Iv29rc',
			question: 'What specific skin concerns or needs do you look to address?',
			options: [
				{text: 'Dryness', value: 1},
				{text: 'Sensitivity', value: 2},
				{text: 'Aging', value: 3},
				{text: 'Uneven Skin Tone', value: 4},
			],
			answer: null,
		},
		{
			id: 'ZTlzJyeWQtWIh6DBFxCr',
			question: 'Would you recommend this product to your family or friends?',
			options: [
				{text: 'Strongly Agree', value: 1},
				{text: 'Agree', value: 2},
				{text: 'Disagree', value: 3},
				{text: 'Strongly Disagree', value: 4},
			],
			answer: null,
		},
		{
			id: 'V1jPI3OtJR72mekbHGFJ',
			question: 'How satisfied are you with this product?',
			options: [
				{text: 'Very Satisfied', value: 1},
				{text: 'Somewhat Satisfied', value: 2},
				{text: 'Neutral', value: 3},
				{text: 'Dissatisfied', value: 4},
			],
			answer: null,
		},
		{
			id: 'D2pLIevZ2MjDqoCXKwFb',
			question: 'Are you willing to pay more for similar products with more organic or natural ingredients?',
			options: [
				{text: 'Yes, significantly more', value: 1},
				{text: 'Yes, slightly more', value: 2},
				{text: 'No, not willing to pay more', value: 3},
				{text: 'No preference', value: 4},
			],
			answer: null,
		},
		{
			id: 'rkENGpEIY8OjfuZjHp6H',
			question: 'Have you ever switched brands or tried a new product? If so, what motivated this change?',
			options: [
				{text: 'Price', value: 1},
				{text: 'Ingredient Preference', value: 2},
				{text: 'Recommendation from friend/family', value: 3},
				{text: 'Advertisement/marketing campaign', value: 4},
			],
			answer: null,
		},
		{
			id: 'HE8ksoiocQPl32WL5sno',
			question: 'Do you think the price of this product is worth the quality of the product?',
			options: [
				{text: 'Strongly Agree', value: 1},
				{text: 'Agree', value: 2},
				{text: 'Maybe', value: 3},
				{text: 'Never', value: 4},
			],
			answer: null,
		},
	]);

    const [products, setProducts] = useState([]);

    const [surveys, setSurveys] = useState([]);

    const [pageLoading, setPageLoading] = useState(true);

    // tabs for cosmetics categories
    const [tabs, setTabs] = useState([
        {title: 'Skincare', active: true},
        {title: 'Makeup', active: false},
        {title: 'Haircare', active: false},
        {title: 'Fragrance', active: false},
        {title: 'Personal Care', active: false},
    ]);

    // products data
    const renderedProducts = useMemo(() => {
        const activeTabs = tabs.find(tab => tab.active);
        if (activeTabs.title === 'Skincare') {
            if (products.length !== 0) setPageLoading(false);
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
    }, [tabs, products]);

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
    };

	const handleSelectedOption = (questionId, answerValue) => {
		setSurveyQuestions(prevSurveyQuestions => {
			return prevSurveyQuestions.map(prevSurveyQuestion => {
				if (questionId === prevSurveyQuestion.id) {
					return {
						...prevSurveyQuestion,
						answer: prevSurveyQuestion.options.find(option => option.value === answerValue),
					}
				}
				return {...prevSurveyQuestion}
			})
		})
	}

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                // get snpashot of dat from surveys collection
                const surveysRef = collection(database, "surveys");

                const q = query(surveysRef, orderBy("created_at", "desc"));

                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const surveyDocs = querySnapshot.docs;
                    const surveyArray = [];
                    surveyDocs.map(async (surveyDoc) => {
                        try {
                            const surveyData = surveyDoc.data();
                            surveyArray.push(surveyData);
                            // console.log(surveyData);
                        } catch (error) {
                            throw error;
                        }
                    })

                    setSurveys(surveyArray);
                })

                return unsubscribe;

            } catch (error) {
                console.log("error fetching surveys", error.message);
            }
        }

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

        fetchProducts().catch(error => console.log(error));
        fetchSurveys().catch(error => console.log(error));
    }, [tabs]);


    const handleNavigateToAnalytics = (productId) => {
        // all surveys for product
        const productSurvey = surveys.filter(survey => survey.product_id === productId);

        const selectedProduct = products.find(product => product.id === productId);

        navigation.navigate("Analytics", {
            product_survey: productSurvey,
            selected_product: selectedProduct,
        })
    }

    // get total number of surveys for product
    const getSurveyCount = (productId) => {
        const surveyCount = surveys.filter(survey => survey.product_id === productId).length;
        return surveyCount;
    }

    // handle sign out function
    const handleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error.message);
        }
    }

    return !pageLoading ?(<>
		{/* mai page content */}
		<ScrollView 
			showsVerticalScrollIndicator={false} 
			contentContainerStyle={styles.contentContainer}
		>
            <View style={styles.headerWrapper}>
                <TouchableOpacity
                    style={styles.sigoutButton}
                    onPress={handleSignOut}
                >
                    <Text style={styles.signoutText}>Signout</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    Dashboard
                </Text>
            </View>
            <View style={styles.productNameWrapper} >
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
                    Categories
                </Text>
            </View>
            <ScrollView
                horizontal
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
            <View style={styles.productsListContainer}>
                {renderedProducts.map(product => (
                    <TouchableOpacity 
                        key={product.id} 
                        style={styles.productWrapper}
                        onPress={() => handleNavigateToAnalytics(product.id)}
                    >
                        <Shadow 
                            style={styles.optionsWrapper}
                            distance={40}
                            offset={[0, 40]}
                            startColor='#00000008'
                        >
                            <Image 
                                source={{uri: product.product_image}} 
                                style={styles.productImage} 
                            />
                            <View style={styles.productListItemTextWrapper}>
                                <Text style={styles.productListItemName} numberOfLines={2} ellipsizeMode='tail'>
                                    {product.product_name}
                                </Text>
                                <Text style={styles.productListItemPrice}>
                                    ₦{product.price.toLocaleString()}
                                </Text>
                                <Text style={styles.surveyCountText}>
                                    {getSurveyCount(product.id)} surveys provided
                                </Text>
                            </View>
                        </Shadow>
                    </TouchableOpacity>
                ))}
            </View>
		</ScrollView>
	</>) : <DashboardSkeleton />;
}

export default Dashboard;

const styles = StyleSheet.create({
	contentContainer: {
		minHeight: '100%',
		width: '100%',
		paddingVertical: 30,
	},
	headerWrapper: {
        paddingHorizontal: 30,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		position: 'relative',
	},
	sigoutButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		right: 30,
		zIndex: 2,
	},
    signoutText: {
        fontFamily: 'sf-pro-text-regular',
        fontSize: 18,
        lineHeight: 17,
        color: colors.accent,
    },
	headerText: {
		fontSize: 20,
		flexGrow: 1,
		textAlign: 'left',
		fontFamily: 'sf-pro-text-semibold',
		fontSize: 18,
	},
	productNameWrapper: {
		marginTop: 42,
		maxWidth: 250,
        paddingHorizontal: 30,
	},
	productName: {
		fontFamily: 'sf-pro-text-semibold',
		fontSize: 34,
		lineHeight: 46,
		color: colors.black,
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
    productsListContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 40,
        padding: 30,
    },
	productWrapper: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		width: '100%',
	},
    optionsWrapper: {
        width: windowWidth - 90,
        backgroundColor: colors.white,
        borderRadius: 30,
        height: 120,
        padding: 15,
        display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
        flexDirection: 'row',
    },
	productImage: {
        height: 90,
        width: 90,
        borderRadius: 20,
        transform: [
            {translateX: -45}
        ]
    },
    productListItemTextWrapper: {
        marginLeft: -30,
        display: 'flex',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: windowWidth - 180
    },
    productListItemName: {
        fontFamily: 'sf-pro-rounded-semibold',
        fontSize: 20,
        lineHeight: 24,
    }
})