// react native components
import { StyleSheet, View, Dimensions } from "react-native";
// skeleton components
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
// colors
import { colors } from "../styles/colors";

// shimmer colors
const shimmerColorArray = ["#ebebeb", "#d9d9d9", "#ebebeb",];

// window width
const windowWidth = Dimensions.get("window").width;

const Skeleton = createShimmerPlaceholder(LinearGradient);

const SurveySkeleton = () => {
    return (
        <View 
            style={skeleton.container}
        >   
            <View style={skeleton.header}>
                <Skeleton 
                    height={24}
                    width={24}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 2}}
                />
            </View>


            <View style={skeleton.paragraphWrapper}>
                <Skeleton 
                    height={34}
                    width={200}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 2}}
                />
            </View>

            <Skeleton 
                height={20}
                width={windowWidth - 80}
                shimmerColors={shimmerColorArray}
                style={{borderRadius: 2, marginTop: 42}}
            />
            <View style={skeleton.tabWrapper}>
                <View style={skeleton.optionWrapper}>
                    <Skeleton 
                        height={15}
                        width={15}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 7.6}}
                    />
                    <Skeleton 
                        height={30}
                        width={windowWidth - 151}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 2}}
                    />
                </View>
                
                <View style={skeleton.optionWrapper}>
                    <Skeleton 
                        height={15}
                        width={15}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 7.6}}
                    />
                    <Skeleton 
                        height={30}
                        width={windowWidth - 151}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 2}}
                    />
                </View>
                
                <View style={skeleton.optionWrapper}>
                    <Skeleton 
                        height={15}
                        width={15}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 7.6}}
                    />
                    <Skeleton 
                        height={30}
                        width={windowWidth - 151}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 2}}
                    />
                </View>
                
                <View style={skeleton.optionWrapper}>
                    <Skeleton 
                        height={15}
                        width={15}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 7.6}}
                    />
                    <Skeleton 
                        height={30}
                        width={windowWidth - 151}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 2}}
                    />
                </View>
                
            </View>
            <Skeleton 
                height={20}
                width={windowWidth - 80}
                shimmerColors={shimmerColorArray}
                style={{borderRadius: 2, marginTop: 42}}
            />
            <View style={skeleton.tabWrapper}>
                <View style={skeleton.optionWrapper}>
                    <Skeleton 
                        height={15}
                        width={15}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 7.6}}
                    />
                    <Skeleton 
                        height={30}
                        width={windowWidth - 151}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 2}}
                    />
                </View>
                
                <View style={skeleton.optionWrapper}>
                    <Skeleton 
                        height={15}
                        width={15}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 7.6}}
                    />
                    <Skeleton 
                        height={30}
                        width={windowWidth - 151}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 2}}
                    />
                </View>
                
                <View style={skeleton.optionWrapper}>
                    <Skeleton 
                        height={15}
                        width={15}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 7.6}}
                    />
                    <Skeleton 
                        height={30}
                        width={windowWidth - 151}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 2}}
                    />
                </View>
                
                <View style={skeleton.optionWrapper}>
                    <Skeleton 
                        height={15}
                        width={15}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 7.6}}
                    />
                    <Skeleton 
                        height={30}
                        width={windowWidth - 151}
                        shimmerColors={shimmerColorArray}
                        style={{borderRadius: 2}}
                    />
                </View>
                
            </View>
        </View>
    );
}

// skeleton style
const skeleton = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        padding: 30,
        width: "100%",
        minHeight: "100%",
    },
    header: {
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'ceter',
    },
    paragraphWrapper: {
        marginTop: 43,
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 30,
    },
    tabWrapper: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        width: "100%",
        gap: 30,
        marginTop: 20,
        paddingVertical: 25,
		paddingHorizontal: 30,
		backgroundColor: colors.white,
		borderRadius: 20,
		gap: 25,
    },
    optionWrapper: {
        height: 45,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		gap: 16,
    },
})
 
export default SurveySkeleton;