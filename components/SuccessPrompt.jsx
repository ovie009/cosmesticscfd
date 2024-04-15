// react components
import { View, StyleSheet } from "react-native";
// icon
import MarkIcon from "../assets/svg/MarkIcon";
import { colors } from "../styles/colors";
// color

const SuccessPrompt = () => {
    // render SuccessPrompt component
    return (
        <View style={style.markBackground}>
            <MarkIcon />
        </View>
    );
}
 
// stylesheet
const style = StyleSheet.create({
    markBackground: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: colors?.primaryDisabled,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SuccessPrompt;