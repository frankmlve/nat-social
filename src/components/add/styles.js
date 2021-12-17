import { Dimensions, StyleSheet } from "react-native";
const styles = StyleSheet.create({
    cameraContaier: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
})
export {styles}