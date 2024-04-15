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

const DashboardSkeleton = () => {
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
                <Skeleton 
                    height={24}
                    width={24}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 2}}
                />
            </View>


            <View style={skeleton.paragraphWrapper}>
                <Skeleton 
                    height={20}
                    width={120}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 2}}
                />
                <Skeleton 
                    height={34}
                    width={100}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 2}}
                />
            </View>

            <View style={skeleton.tabWrapper}>
                <Skeleton 
                    height={30}
                    width={70}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 2}}
                />
                <Skeleton 
                    height={30}
                    width={70}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 2}}
                />
                <Skeleton 
                    height={30}
                    width={70}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 2}}
                />
            </View>

            {/* search bar */}

            <View style={skeleton.cardsWrapper}>
                <Skeleton 
                    height={120}
                    width={windowWidth - 90}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 30}}
                />
                <Skeleton 
                    height={120}
                    width={windowWidth - 90}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 30}}
                />
                <Skeleton 
                    height={120}
                    width={windowWidth - 90}
                    shimmerColors={shimmerColorArray}
                    style={{borderRadius: 30}}
                />
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
        flexDirection: 'row',
        gap: 30,
        marginTop: 10,
    },
    cardsWrapper: {
        // paddingHorizontal: 30,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 70,
        gap: 34,
    },
})
 
export default DashboardSkeleton;