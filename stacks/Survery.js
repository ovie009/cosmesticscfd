import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, {useMemo, useState} from 'react'
// icons
import BackArrowIcon from '../assets/svg/BackArrowIcon';
import { colors } from '../styles/colors';
// shadow
import { Shadow } from 'react-native-shadow-2';

// window width
const windowWidth = Dimensions.get("window").width;

const Survey = ({navigation, route}) => {

	// destruct route paramters
	const {product_name, product_price, product_image} = useMemo(() => {
		return route?.params || {}
	}, [route?.params]);

	// survey questions
	const [surveyQuestions, setSurveyQuestions] = useState([
		{
			id: 1,
			question: 'Have you used this product before?',
			options: [
				{text: 'Yes', value: 1},
				{text: 'No', value: 0},
			],
			answer: null,
		},
		{
			id: 2,
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
			id: 3,
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
			id: 9,
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
			id: 4,
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
			id: 5,
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
			id: 6,
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
			id: 7,
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
			id: 8,
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

	// funtion to send data to db
	const handleSubmitSurvey = async () => {
		try {
			
		} catch (error) {
			
		}
	}

	const unansweredQuestion = surveyQuestions.some(surveyQuestion => surveyQuestion.answer === null);


    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
			<View style={styles.headerWrapper}>
				<TouchableOpacity
					style={styles.backButton}
                    onPress={() => navigation.goBack()}
				>
					<BackArrowIcon />
				</TouchableOpacity>
				<Text style={styles.headerText}>
					Survey
				</Text>
			</View>
			<View style={styles.productNameWrapper} >
				<Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
					{product_name}
				</Text>
			</View>
			{surveyQuestions.map(surveyQuestion => (
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
						{surveyQuestion.options.map((option, index) => (
							<TouchableOpacity
								key={option.value}
								style={styles.option}
								onPress={() => handleSelectedOption(surveyQuestion.id, option.value)}
							>
								<View 
									style={[
										styles.optionRadio, 
										option.value === surveyQuestion.answer?.value && styles.activeRadio
									]}
								>
									{option.value === surveyQuestion.answer?.value && <View style={styles.activeRadioChild} />}
								</View>
								<Text 
									style={[
										styles.optionText, 
										index + 1 !== surveyQuestion.options.length && styles.listSeperator
									]}
								>
									{option.text}
								</Text>
							</TouchableOpacity>
						))}
					</Shadow>
				</View>
			))}
			{/* action button */}
            <View style={styles.actionButtonWrapper}>
                <TouchableOpacity
                    style={[
						styles.actionButton,
						unansweredQuestion && styles.disabledButton
					]}
                    onPress={!unansweredQuestion ? 
						() => handleSubmitSurvey() : 
						() => {}
					}
                >
                    <Text style={styles.actionButtonText}>Submit Survey</Text>
                </TouchableOpacity>
            </View>
      </ScrollView>
    );
}

export default Survey

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
		paddingTop: 25,
		paddingHorizontal: 30,
		backgroundColor: colors.white,
		borderRadius: 20,
		gap: 25,
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
		borderBottomColor: colors.listSeperaor,
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
    }
})