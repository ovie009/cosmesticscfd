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

// firebase
import {
    database,
} from "../Firebase";

// firestore functions
import {
    addDoc,
    collection,
    serverTimestamp,
	getDocs,
	query,
	orderBy,
} from "firebase/firestore";

// bottomsheet componens
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

// skeleton screen
import SurveySkeleton from '../skeleton/SurveySkeleton';

// window width
const windowWidth = Dimensions.get("window").width;

const Survey = ({navigation, route}) => {

	// destruct route paramters
	const {product_id, product_name, product_price, product_image, survey_questions} = useMemo(() => {
		return route?.params || {}
	}, [route?.params]);
	
	// survey questions
	const [surveyQuestions, setSurveyQuestions] = useState(survey_questions.map(surveyQuestion => {
		return {
			...surveyQuestion,
			answer: null,
		}
	}));

	const [pageLoading, setPageLoading] = useState(survey_questions.length === 0);

	// console.log("SURVEY QUESTIONS", survey_questions[0]);

	useEffect(() => {
        // fetch producs from database
        const fetchQuestions = async () => {
            try {
                const productsRef = collection(database, "survey_questions");
                const q = query(productsRef, orderBy("serial_number"));
                const querySnapshot = await getDocs(q);
                const products = [];
                querySnapshot.forEach((doc) => {
                    products.push({...doc.data(), id: doc.id});
                });
				setSurveyQuestions(products.map(product => {
					return {
						...product,
						answer: null,
					}
				}));
            } catch (error) {
                console.log(error);
            } finally {
				setPageLoading(false)
			}
        }

        fetchQuestions();

    }, []);

	// users
	const users = [
		{
			"full_name": "Michael Smith",
			"email": "michael.smith@gmail.com"
		},
		{
			"full_name": "David Johnson",
			"email": "david.johnson@gmail.com"
		},
		{
			"full_name": "John Williams",
			"email": "john.williams@gmail.com"
		},
		{
			"full_name": "Matthew Brown",
			"email": "matthew.brown@gmail.com"
		},
		{
			"full_name": "Daniel Davies",
			"email": "daniel.davies@gmail.com"
		},
		{
			"full_name": "Emily Taylor",
			"email": "emily.taylor@gmail.com"
		},
		{
			"full_name": "Sarah Martinez",
			"email": "sarah.martinez@gmail.com"
		},
		{
			"full_name": "Jessica Anderson",
			"email": "jessica.anderson@gmail.com"
		},
		{
			"full_name": "Rachel Garcia",
			"email": "rachel.garcia@gmail.com"
		},
		{
			"full_name": "Olivia Thomas",
			"email": "olivia.thomas@gmail.com"
		}
	];

	// useEffect(() => {
	// 	const uploadData = async () => {
	// 		try {
	// 			console.log('uploading data...');
	// 			// ref to products collection
	// 			const productsRef = collection(database, "survey_questions");
	
	// 			surveyQuestions.forEach(async (surveyQuestion) => {
	// 				try {
	
	// 					// check if product name exist, if it does then skip
	// 					const q = query(productsRef, where("question", "==", surveyQuestion.question));
	
	// 					// get docs
	// 					const querySnapshot = await getDocs(q);
	
	// 					if (querySnapshot.size > 0) {
	// 						console.log("Data", querySnapshot.docs[0].data())
	// 						console.log("Document already exists");
	// 						return;
	// 					}
	
	// 					// add doc
	// 					await addDoc(productsRef, {
	// 						serial_number: surveyQuestion.id,
	// 						question: surveyQuestion.question,
	// 						options: surveyQuestion.options,
	// 						created_at: serverTimestamp(),
	// 						edited_at: serverTimestamp(),
	// 					});

	// 					console.log('data uploaded succesfully');
	
	// 				} catch (error) {
	// 					console.log("Error adding document: ", error.messsage);
	// 				}
	// 			})
	// 		} catch (error) {
	// 			console.log("Erorr creating collection: ", error.messsage);
	// 		}
	// 	}

	// 	uploadData().catch(error => {
	// 		console.log(error.message)
	// 	});

	// }, [])

	// question and answer data
	
	const data = useMemo(() => {
		if (surveyQuestions.length === 0) return {};
		// reduce survey arry to return an array of objects
		// object should have two fields, quesionId and answers
		return surveyQuestions?.map((surveyQuestion) => {
			return {
				questionId: surveyQuestion.id,
				answer: surveyQuestion.answer,
			}
		});
	}, [surveyQuestions]);

	// is loading state
	const [isLoading, setIsLoading] = useState(false);

	const handleSelectedOption = (questionId, answerValue) => {
		setSurveyQuestions(prevSurveyQuestions => {
			return prevSurveyQuestions?.map(prevSurveyQuestion => {
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
			setIsLoading(true);
			// upload data to surveys collection
			const surveysRef = collection(database, "surveys");

			await addDoc(surveysRef, {
				full_name: users[9].full_name,
				email: users[9].email,
				product_id: product_id,
				product_name: product_name,
				data: data,
				created_at: serverTimestamp(),
				edited_at: serverTimestamp(),
			})

			// open success modal
			openModal();
			
		} catch (error) {
			console.log("error uploading survey", error.message);
		} finally {
			// disable button loading state
			setIsLoading(false);
		}
	}


	const handleSurveyCompleted = () => {
		closeModal();
		navigation.navigate('Home');
	}

	// check if there is an unanswered question
	const unansweredQuestion = surveyQuestions.some(surveyQuestion => surveyQuestion.answer === null);

	// render popup bottomsheet modal backdrop 
	const renderBackdrop = useCallback(
		props => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.3}
				onPress={handleSurveyCompleted}
			/>
		),
		[]
	);

	const handleOpenSheetStates = (index) => {
		// if sheet is closed
		if (index === -1) {
			// close modal
			closeModal();
		}
	}

	const bottomSheetRef = useRef(null);

	const openModal = () => {
		// open bottomsheet
		bottomSheetRef.current?.present();
	}
	
	const closeModal = () => {
		// close bottomsheet
		bottomSheetRef.current?.close();
	}
	// console.log(generateRandomAnswers());
	

    return !pageLoading ? (<>
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
						Survey
					</Text>
				</View>
				<View style={styles.productNameWrapper} >
					<Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
						{product_name}
					</Text>
				</View>
				{surveyQuestions?.map((surveyQuestion, index) => (
					<View key={surveyQuestion.id + index} style={styles.questionGroup}>
						<Text style={styles.question}>
							{`${surveyQuestion.serial_number}) ${surveyQuestion.question}`}
						</Text>
						<Shadow 
							style={styles.optionsWrapper}
							distance={40}
							offset={[0, 40]}
							startColor='#00000008'
						>
							{surveyQuestion?.options?.map((option, index) => (
								<TouchableOpacity
									key={index}
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
				<CustomButton
					text={"Submit Survey"}
					onPress={() => handleSubmitSurvey()}
					disabled={unansweredQuestion}
					isLoading={isLoading}
				/>
		</ScrollView>
		{/* success bottomsheet modal */}
		<BottomSheetModal
			ref={bottomSheetRef}
			index={0}
			snapPoints={[350]}
			enablePanDownToClose={false}
			backgroundStyle={{
				borderRadius: 24,
			}}
			handleComponent={() => (
				<></>
			)}
			backdropComponent={renderBackdrop}
			onChange={handleOpenSheetStates}
		>
			<View style={[styles.modalWrapper]}>
				<View style={styles.modalContent}>
					{/* i need closing text for this confirmation modal */}
					<Text style={styles.modalText}>
						Thank you for completing the survey! Your feedback is important to us
					</Text>
					<SuccessPrompt />
				</View>
				{/* {children} */}
				<CustomButton
					text={"Proceed"}
					onPress={() => handleSurveyCompleted()}
				/>
			</View>
		</BottomSheetModal>
	</>) : <SurveySkeleton />;
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
		width: windowWidth - 151,
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
	}
})