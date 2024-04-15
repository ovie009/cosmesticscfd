import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
// icons
import BackArrowIcon from '../assets/svg/BackArrowIcon';
import { colors } from '../styles/colors';
// shadow
import { Shadow } from 'react-native-shadow-2';
// charts
import {
    BarChart,
    PieChart,
} from "react-native-chart-kit";

// firebase
import {
    database,
} from "../Firebase";

// firestore functions
import {
    orderBy,
    where,
    onSnapshot,
    query,
    collection,
} from "firebase/firestore";



// window width
const windowWidth = Dimensions.get("window").width;

const Analytics = ({navigation, route}) => {

	// destruct route paramters
	const {product_survey, selected_product} = route?.params || {};
	
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

    // handle sign out function
    const handleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error.message);
        }
    }


    const [surveys, setSurveys] = useState(product_survey);


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
    // const dataTest = survey.filter(item => item.data.filter(i => i.questionId === 'qRzwquEGnJB503WnpIK9'));

    
    const getQuestionChartData = (questionId, chartType) => {
        const labels = surveyQuestions.find(question => question.id === questionId).options.map(option => option.text);

        // get all data
        const getAllData = surveys.flatMap(survey => {
            return survey.data
        });

        // get all answers for target question
        const questionSurveys = getAllData.filter(item => item.questionId === questionId);

        // get all data
        const data = labels.map(label => {
            const count = questionSurveys.filter(item => item.answer.text === label).length;
            return count;
        });

        const pieData = labels.map((label, index) => {
            return {
                name: label,
                value: data[index],
                color: colors.pieChart[index],
                legendFontSize: 15,
                legendFontSColor: colors.neutral,
            }
        })

        
        return chartType === 'BarChart' ? {
            labels: labels,
            datasets: [
                {
                    data: data
                }
            ],
        } : pieData;
    }

    // get average of data
    const getQuestionAverage = (questionId, averageType) => {
        const labels = surveyQuestions.find(question => question.id === questionId).options.map(option => option.text);

        // get all data
        const getAllData = surveys.flatMap(survey => {
            return survey.data
        });

        // get all answers for target question
        const questionSurveys = getAllData.filter(item => item.questionId === questionId);

        // get all data
        const data = labels.map(label => {
            const count = questionSurveys.filter(item => item.answer.text === label).length;
            return count;
        });

        // evaluate mean
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        // evaluate mode
        const mode = Math.max(...data);
        // evluate median
        const sortedData = data.sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedData.length / 2);
        const median = sortedData.length % 2 === 0 ? 
            (sortedData[middleIndex - 1] + sortedData[middleIndex]) / 2 :
            sortedData[middleIndex];
        // return mean
        if (averageType === 'mean') return mean;
        // return mode
        if (averageType === 'mode') return mode;
        // return median
        if (averageType === 'median') return median;

        // evaluate standard deviation
        const deviation = data.map(value => {
            return Math.pow(value - mean, 2);
        });

        const standardDeviation = Math.sqrt(deviation.reduce((a, b) => a + b, 0) / data.length);
        // round answer o 2 dp

        return standardDeviation.toPrecision(3);
    }

    console.log(selected_product.id)

    // chart configuration
    const chartConfig = {
        // backgroundColor: colors.primary,
        backgroundGradientFrom: colors.white,
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: colors.white,
        backgroundGradientToOpacity: 0.5,
        color: () => `${colors.black}`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        style: {
            borderRadius: 30,
            margin: 0,
            padding: 0,
        },
        barPercentage: 1,
    };
    
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                // get snpashot of dat from surveys collection
                const surveysRef = collection(database, "surveys");

                const q = query(surveysRef,
                    where('product_id', '==', selected_product.id),
                    orderBy("created_at", "desc")
                );

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

        fetchSurveys().catch(error => console.log(error));
    }, []);

    return (<>
		{/* mai page content */}
		<ScrollView 
			showsVerticalScrollIndicator={false} 
			contentContainerStyle={styles.contentContainer}
		>
            <View style={styles.headerWrapper}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    Analytics
                </Text>
            </View>
            <View style={styles.productNameWrapper} >
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
                    {selected_product.product_name}
                </Text>
            </View>
            {surveyQuestions.map((surveyQuestion, index) => (
                <View key={surveyQuestion.id} style={styles.questionGroup}>
                    <Text style={styles.question}>
                        {surveyQuestion.question}
                    </Text>
                    <Shadow 
                        style={styles.optionsWrapper}
                        distance={40}
                        offset={[0, 40]}
                        startColor='#00000008'
                    >
                        {(index === 0 || index === surveyQuestions.length - 1) ? (
                            <BarChart
                                style={styles.graphStyle}
                                data={getQuestionChartData(surveyQuestion.id, 'BarChart')}
                                width={windowWidth - 100}
                                height={300}
                                chartConfig={chartConfig}
                                verticalLabelRotation={90}
                                withInnerLines={false}
                                fromZero={true}
                                withShadow={false}
                                showBarTops={false}
                                showValuesOnTopOfBars={true}
                            />
                        ) : (
                            <PieChart
                                style={styles.graphStyle}
                                data={getQuestionChartData(surveyQuestion.id, 'PieChart')}
                                width={windowWidth - 100}
                                height={300}
                                chartConfig={chartConfig}
                                accessor='value'
                                backgroundColor={colors.white}
                                paddingLeft='15'
                                center={[40, 0]}
                            />
                        )}
                        <View style={styles.averages}>
                            <Shadow 
                                style={styles.average}
                                distance={20}
                                offset={[0, 0]}
                                startColor='#00000008'
                            >
                                <Text style={styles.averageHeading}>
                                    Mean
                                </Text>
                                <Text style={styles.averageValue}>
                                    {getQuestionAverage(surveyQuestion.id, 'mean')}
                                </Text>
                            </Shadow>
                            <Shadow 
                                style={styles.average}
                                distance={20}
                                offset={[0, 0]}
                                startColor='#00000008'
                            >
                                <Text style={styles.averageHeading}>
                                    Mode
                                </Text>
                                <Text style={styles.averageValue}>
                                    {getQuestionAverage(surveyQuestion.id, 'mode')}
                                </Text>
                            </Shadow>
                            <Shadow 
                                style={styles.average}
                                distance={20}
                                offset={[0, 0]}
                                startColor='#00000008'
                            >
                                <Text style={styles.averageHeading}>
                                    Median
                                </Text>
                                <Text style={styles.averageValue}>
                                    {getQuestionAverage(surveyQuestion.id, 'median')}
                                </Text>
                            </Shadow>
                            <Shadow 
                                style={styles.average}
                                distance={20}
                                offset={[0, 0]}
                                startColor='#00000008'
                            >
                                <Text style={styles.averageHeading}>
                                    Standard Deviation
                                </Text>
                                <Text style={styles.averageValue}>
                                    {getQuestionAverage(surveyQuestion.id)}
                                </Text>
                            </Shadow>
                        </View>
                    </Shadow>
                </View>
            ))}
		</ScrollView>
	</>);
}

export default Analytics

const styles = StyleSheet.create({
	contentContainer: {
		minHeight: '100%',
		width: '100%',
		padding: 30,
	},
	headerWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		position: 'relative',
	},
	backButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		zIndex: 2,
	},
	headerText: {
		fontSize: 20,
		flexGrow: 1,
		textAlign: 'center',
		fontFamily: 'sf-pro-text-semibold',
		fontSize: 18,
	},
	productNameWrapper: {
		marginTop: 42,
		maxWidth: 250,
	},
	productName: {
		fontFamily: 'sf-pro-text-semibold',
		fontSize: 34,
		lineHeight: 46,
		color: colors.black,
	},
	questionGroup: {
		marginTop: 42,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		gap: 20,
		width: '100%',
	},
	question: {
		fontSize: 17,
		lineHeight: 20,
		fontFamily: 'sf-pro-text-semibold',
		color: colors.black,
	},
	optionsWrapper: {
		width: windowWidth - 60,
		padding: 20,
		backgroundColor: colors.white,
		borderRadius: 20,
		gap: 25,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        
	},
    graphStyle: {
        borderRadius: 10,
        fontFamily: 'sf-pro-text-regular',
        margin: 0,
        padding: 0,
    },
	option: {
		height: 45,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		gap: 16,
	},
	optionRadio: {
		width: 15,
		height: 15,
		borderRadius: 7.5,
		borderWidth: 1,
		borderColor: colors.radio,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	activeRadio: {
		borderColor: colors.primary,
	},
	activeRadioChild: {
		width: 7,
		height: 7,
		borderRadius: 3.5,
		backgroundColor: colors.primary,
	},
	optionText: {
		flexGrow: 1,
		height: '100%',
	},
	listSeperator: {
		borderBottomWidth: 0.5,
		borderBottomColor: colors.listSeperator,
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
	disabledButton: {
		backgroundColor: colors.primaryDisabled,
	},
    actionButtonText: {
        fontFamily: 'sf-pro-text-semibold',
        color: colors.white,
        fontSize: 17,
    },
	modalWrapper: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'column',
		padding: 30,
		height: '100%',
	},
	modalContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		paddingHorizontal: 20,
		gap: 20,
	}, 
	modalText: {
		fontSize: 17,
		lineHeight: 20,
		fontFamily: 'sf-pro-rounded-regular',
		color: colors.black,
		textAlign: 'center',
	},
    averages: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    average: {
        width: (windowWidth - 120)/2,
        height: 80,
        borderRadius: 20,
        display: 'flex',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    averageHeading: {
        fontFamily: 'sf-pro-text-regular',
        fontSize: 12,
        color: colors.primary,
    },
    averageValue: {
        fontFamily: 'sf-pro-rounded-bold',
        fontSize: 25,
        color: colors.black,
    }
})