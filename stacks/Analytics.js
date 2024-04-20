import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect, useCallback, useRef } from 'react'
// icons
import CloseIcon from '../assets/svg/CloseIcon';
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
import { Image } from 'expo-image';
// bottomsheet component
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetScrollView
} from "@gorhom/bottom-sheet";

// components
import ModalHandle from '../components/ModalHandle';


// window width
const windowWidth = Dimensions.get("window").width;

const Analytics = ({navigation, route}) => {

	// destruct route paramters
	const {product_survey, selected_product, survey_questions} = route?.params || {};
	
	// survey questions
	const [surveyQuestions, setSurveyQuestions] = useState(survey_questions);

    // bottomsheet ref
    const bottomSheetScreenRef = useRef(null);

    // question list in select question bottomsheet
    const [questionList, setQuestionList] = useState(survey_questions);


    // set updating question number
    const [questionNumber, setQuestionNumber] = useState(1);

    // open bottom sheet modal
    const openModal = (questionNumber) => {
        // update question number
        setQuestionNumber(questionNumber);
        // open sheet
        bottomSheetScreenRef.current?.present();
    }
    
    // close bottom sheet modal
    const closeModal = () => {
        // close sheet
        bottomSheetScreenRef.current?.close();
    }

    // render popup bottomsheet modal backdrop 
    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.3}
                // onPress={bottomSheetParameters.closeModal}
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
    

    const [surveys, setSurveys] = useState(product_survey);

    // retunr only unique full_name and email address
    const participants = [...new Set(product_survey.map(survey => `${survey.full_name}::${survey.email}`))].map(participant => {
        const [full_name, email] = participant.split('::');
        return {
            full_name,
            email,
        };
    });

    // question 1
    const [question1, setQuestion1] = useState(survey_questions[1])
    
    // question 2
    const [question2, setQuestion2] = useState(survey_questions[6])

    // select question function
    const handleSelectQuestion = (questionId) => {

        if (questionNumber === 1) {
            setQuestion1(surveyQuestions.find(question => question.id === questionId))
            return closeModal();
        }
        
        setQuestion2(surveyQuestions.find(question => question.id === questionId))
        return closeModal();
    }

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

    const chiSquareTest = (question1, question2) => {
        
        // question 1 options
        const question1options = surveyQuestions
            .find(question => question.id === question1)
            .options.map(option => option.text);

        // question 2 options
        const question2options = surveyQuestions
            .find(question => question.id === question2)
            .options.map(option => option.text);

        // get all data
        const participantsSurveys = surveys.map(survey => {
            return {survey: survey.data}
        });

        const contigencyTable = question1options.flatMap(q1 => {
            return question2options.map(q2 => {
                const count = participantsSurveys
                    .filter(surveys => {
                        // console
                        const firstCriteria = surveys.survey.find(survey => survey.questionId === question1 && survey.answer.text === q1);
                        // console.log(firstCriteria);
                        const secondCriteria = surveys.survey.find(survey => survey.questionId === question2 && survey.answer.text === q2);
                        // console.log(secondCriteria);

                        return ![firstCriteria, secondCriteria].includes(undefined);
                }).length
                
                return {
                    q1,
                    q2,
                    count
                }
            })
        });

        // total for reach row
        const totalRows = question1options.map(q1 => {
            const row = contigencyTable
                .filter(item => item.q1 === q1)
                .map(item => item.count);

            const total = row.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return {
                q1,
                total
            };
        });

        // total for each column
        const totalColumns = question2options.map(q2 => {
            const row = contigencyTable
                .filter(item => item.q2 === q2)
                .map(item => item.count);

            const total = row.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return {
                q2,
                total
            };
        });

        // grand total
        const grandTotal = [...totalColumns, ...totalRows].reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);


        // expected frequency table
        const expectedFrequencyTable = totalRows.flatMap(row => {
            return totalColumns.map(column => {
                
                const frequency = row.total * column.total / grandTotal;
                
                return {
                    q1: row.q1,
                    q2: column.q2,
                    frequency,
                }
            })
        });

        // chi square table
        const chiSquareTable = contigencyTable.map((data, index) => {
            return (((data.count - expectedFrequencyTable[index].frequency) ** 2) / expectedFrequencyTable[index].frequency) || 0
        });

        // chi squared statistics
        const chiSquaredStatistics = chiSquareTable.reduce((a, b) => a + b, 0).toFixed(2);

        // const degree of freedom
        // const df = (totalRows.length - 1) * (totalColumns.length - 1);

        // significance level
        const sl = 0.05;

        // critical value
        const criticalValue = 16.92;

        const hypothesis = chiSquaredStatistics > criticalValue;

        return {
            contigencyTable,
            expectedFrequencyTable,
            chiSquaredStatistics,
            criticalValue,
            summary: hypothesis ? 
                `H0: There is association between the two questions because the Chi-Squared Statistic (${chiSquaredStatistics}) is greater than the Critical Value (${criticalValue})at a significance level of ${sl}.` : 
                `H1: There is no association between the two questions because the Chi-Squared Statistic (${chiSquaredStatistics}) is less than the Critical Value (${criticalValue}) at a significance level of ${sl}.`,
        }
    }


    // chiSquareTest(surveyQuestions[1].id, surveyQuestions[6].id);

    // get s=chart data
    const getQuestionChartData = (questionId, chartType) => {
        const labels = surveyQuestions.find(question => question.id === questionId).options.map(option => option.value);

        // get all data
        const getAllData = surveys.flatMap(survey => {
            return survey.data
        });

        // get all answers for target question
        const questionSurveys = getAllData.filter(item => item.questionId === questionId);

        // get all data
        const data = labels.map(label => {
            const count = questionSurveys.filter(item => item.answer.value === label).length;
            return count;
        });

        const pieData = labels.map((label, index) => {
            return {
                name: label,
                value: data[index],
                color: colors.pieChart[index],
                legendFontSize: 17,
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

        // get all data
        const getAllData = surveys.flatMap(survey => {
            return survey.data
        });

        
        // get all answers for target question
        const questionSurveys = getAllData.filter(item => item.questionId === questionId);
    
        // data 
        const surveyValues = questionSurveys.map(survey => survey.answer.value);

        const getMode = (numbers) => {
            const counts = {};
            let maxCount = 0;
            let mode;
          
            for (let i = 0; i < numbers.length; i++) {
              const num = numbers[i];
              counts[num] = (counts[num] || 0) + 1;
              if (counts[num] > maxCount) {
                maxCount = counts[num];
                mode = num;
              }
            }
          
            const modes = Object.keys(counts).filter(num => counts[num] === maxCount);
            if (modes.length > 1) {
              const sum = modes.reduce((total, num) => total + parseInt(num), 0);
              mode = sum / modes.length;
            }
          
            return mode;
        }

        // evaluate mean
        const mean = surveyValues.reduce((a, b) => a + b, 0) / surveyValues.length;
        // evaluate mode
        const mode = getMode(surveyValues);
        // evluate median
        const sortedData = surveyValues.sort((a, b) => a - b);
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
        const deviation = surveyValues.map(value => {
            return Math.pow(value - mean, 2);
        });

        const standardDeviation = Math.sqrt(deviation.reduce((a, b) => a + b, 0) / surveyValues.length);
        // round answer o 2 dp

        return standardDeviation.toPrecision(3);
    }

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

    console.log(questionNumber);

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
            <Text style={styles.statisticsHeading}>
                Chi-Square Test for Association
            </Text>
            <Shadow 
                style={styles.optionsWrapper}
                distance={40}
                offset={[0, 40]}
                startColor='#00000008'
            >
                <TouchableOpacity
                    style={styles.selectQuestionButton}
                    onPress={() => openModal(1)}
                >
                    <Text style={styles.questionLabel}>
                        Question 1
                    </Text>
                    <View style={styles.questionWrapper}>
                        <Text style={styles.selectQuestionButtonText}>
                            {question1.question}
                        </Text>
                        <View style={styles.dropDownArrow}>
                            <BackArrowIcon />
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.selectQuestionButton}
                    onPress={() => openModal(2)}
                >
                    <Text style={styles.questionLabel}>
                        Question 2
                    </Text>
                    <View style={styles.questionWrapper}>
                        <Text style={styles.selectQuestionButtonText}>
                            {question2.question}
                        </Text>
                        <View style={styles.dropDownArrow}>
                            <BackArrowIcon />
                        </View>
                    </View>
                </TouchableOpacity>
                <View>
                    <Text style={styles.question}>Question 1 Options</Text>
                    {question1.options.map(option => (
                        <Text key={option.value} style={styles.chiTextResults}>
                            {option.text}
                        </Text>
                    ))}
                </View>
                <View>
                    <Text style={styles.question}>Question 2 Options</Text>
                    {question2.options.map(option => (
                        <Text key={option.value} style={styles.chiTextResults}>
                            {option.text}
                        </Text>
                    ))}
                </View>
                <View>
                    <Text style={styles.question}>Contigency Table</Text>
                    {chiSquareTest(question1.id, question2.id).contigencyTable.map(data => (
                        <Text key={data.q1 + data.q2} style={styles.chiTextResults}>
                            {`${data.q1}, ${data.q2} - ${data.count}`}
                        </Text>
                    ))}
                </View>
                <View>
                    <Text style={styles.question}>Chi-Squared Result</Text>
                    <Text style={styles.chiTextResults}>
                        Chi-Squared Statistics - {chiSquareTest(question1.id, question2.id).chiSquaredStatistics}
                    </Text>
                    <Text style={styles.chiTextResults}>
                        Critical Value - {chiSquareTest(question1.id, question2.id).criticalValue}
                    </Text>
                    <Text style={styles.chiTextResults}>
                        {chiSquareTest(question1.id, question2.id).summary}
                    </Text>
                </View>
            </Shadow>

            {/* survey results */}
            <Text style={[styles.statisticsHeading, {marginBottom: -15}]}>
                Survey Statistics
            </Text>
            {/* survey results */}
            {surveys.length !== 0 && surveyQuestions.map((surveyQuestion, index) => (
                <View key={surveyQuestion.id} style={styles.questionGroup}>
                    <Text style={styles.question}>
                        {`${surveyQuestion.serial_number}) ${surveyQuestion.question}`}
                    </Text>
                    <Shadow 
                        style={styles.optionsWrapper}
                        distance={40}
                        offset={[0, 40]}
                        startColor='#00000008'
                    >
                        {([0, 2, 9].includes(index)) ? (
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
                        <View style={styles.keyWrapper}>
                            <Text style={styles.keyHeading}>Keys</Text>
                            {surveyQuestion.options.map(option => (
                                <Text key={option.value} style={styles.keyText}>
                                    {`${option.value} - ${option.text}`}
                                </Text>
                            ))}
                        </View>
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

            {/* survey participants */}
            {surveys.length !== 0 && (
                <Shadow 
                    style={[styles.optionsWrapper, styles.surveyParticipantsContainer]}
                    distance={40}
                    offset={[0, 40]}
                    startColor='#00000008'
                >
                    <Text style={styles.surveyParticpantsHeading}>
                        Survey Participants
                    </Text>
                    <View style={styles.participantWrapper}>
                        {participants.map((participant, index) => (
                            <View key={index} style={styles.surveyParticipant}>
                                <Image
                                    style={styles.surveyParticipantImage}
                                    source={require('../assets/images/user.png')}
                                />
                                <View style={styles.participantOnformation}>
                                    <Text style={styles.participantName}>{participant.full_name}</Text>
                                    <Text style={styles.participantEmail}>{participant.email}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Shadow>
            )}
            
            {surveys.length === 0 && (
                <Text style={styles.noSurveysText}>
                    No Surveys Found
                </Text>
            )}
		</ScrollView>
        {/* bottom sheet*/}
        <BottomSheetModal
            ref={bottomSheetScreenRef}
            index={0}
            snapPoints={["50%", "75%", "100%"]}
            enablePanDownToClose={true}
            backgroundStyle={styles.backgroundStyle}
            // over other bottomsheet
            stackBehavior={"replace"}
            backdropComponent={renderBackdrop}
            onChange={(index) => handleOpenSheetStates(index)}
            handleComponent={() => (
                <ModalHandle />
            )}
        >
            <View style={styles.sheetTitle}>
                <TouchableOpacity 
                    style={styles.closeButtonWrapper} 
                    onPress={closeModal}
                >
                    <CloseIcon />
                </TouchableOpacity>
                <View style={styles.titleWrapper}>
                    <Text style={styles.sheetTitleText}>
                        Select Question
                    </Text>
                </View>
            </View>
            <View 
                style={styles.modalWrapper}
            >
                {/* selection for question number 1 */}
                {questionNumber === 1 ? surveyQuestions.filter(question => question.id !== question1.id).map(question => (
                    <TouchableOpacity
                        style={styles.listItem}
                        key={question.id}
                        onPress={() => handleSelectQuestion(question.id)}
                    >
                        <Text style={styles.listItemText}>{question.question}</Text>
                    </TouchableOpacity>
                )) : surveyQuestions.filter(question => question.id !== question2.id).map(question => (
                    <TouchableOpacity
                        style={styles.listItem}
                        key={question.id}
                        onPress={() => handleSelectQuestion(question.id)}
                    >
                        <Text style={styles.listItemText}>{question.question}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </BottomSheetModal>
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
    statisticsHeading: {
        marginTop: 42,
        marginBottom: 20,
		fontSize: 20,
		lineHeight: 22,
		fontFamily: 'sf-pro-text-semibold',
		color: colors.black,
    },
    selectQuestionButton: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'column',
        width: '100%',
        gap: 8,
        marginBottom: 20,
    },
    questionLabel: {
        fontSize: 12,
        lineHeight: 14,
        fontFamily: 'sf-pro-text-regular',
        color: colors.black,
        opacity: 0.7,
        width: '100%',
    },
    questionWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
        width: '100%',
        gap: 10,
    },
    selectQuestionButtonText: {
        width: windowWidth - 134,
        fontSize: 16,
		lineHeight: 20,
		fontFamily: 'sf-pro-rounded-regular',
        color: colors.black,
    },
    dropDownArrow: {
        // rotate 90deg
        transform: [{rotate: '-90deg'}],
    },
    chiTextResults: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'sf-pro-text-regular',
        color: colors.black,
        opacity: 0.7,
        marginTop: 8,
    },
	questionGroup: {
        marginTop: 30,
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
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'column',
		padding: 30,
        gap: 20,
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
    },
    keyHeading: {
		fontSize: 17,
		lineHeight: 20,
		fontFamily: 'sf-pro-rounded-semibold',
		color: colors.black,
	},
    keyText: {
        fontSize: 14,
		lineHeight: 20,
		fontFamily: 'sf-pro-text-regular',
		color: colors.black,
        opacity: 0.7,
	},
    surveyParticipantsContainer: {
        marginTop: 30,
    },
    surveyParticpantsHeading: {
        fontSize: 17,
        lineHeight: 20,
        fontFamily: 'sf-pro-rounded-semibold',
        color: colors.black,
	},
    participantWrapper: {
        display: 'flex',
        gap: 20,
    },
    surveyParticipant: {
        width:'100%',
        height: 50,
        display:'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 15,
    },
    surveyParticipantImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    participantName: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'sf-pro-rounded-semibold',
        color: colors.black,
    },
    participantEmail: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'sf-pro-rounded-regular',
        color: colors.black,
        opacity: 0.7,
        marginTop: 8,
    },
    noSurveysText: {
        marginVertical: 30,
        fontSize: 17,
        lineHeight: 20,
        fontFamily: 'sf-pro-rounded-regular',
        color: colors.black,
    },
    
    // bottom sheet styles
    backgroundStyle: {
        borderRadius: 24,
        backgroundColor: colors.white,
    },
    sheetTitle: {
        width: "100%",
        minHeight: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    sheetTitleText: {
        fontFamily: 'sf-pro-rounded-bold',
        fontSize: 16,
        position: "relative",
        color: colors.black,
    },
    titleWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonWrapper: {
        width: 20,
        height: 20,
        position: "absolute",
        right: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    listItem: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        // backgroundColor: 'red',
    }
})