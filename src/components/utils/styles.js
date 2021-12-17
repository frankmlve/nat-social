import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    closeButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        zIndex: 5,
        top: 5,
        right: 5
    },
    flipButton: {
        position: 'absolute',
        zIndex: 5,
        top: 5,
        left: 5
    },
    takePicture: {
        position: 'absolute',
        zIndex: 5,
        bottom: 0,
        left: '50%',
        transform: [{ translateX: '-50%' }]
        // right: '50%'

    },
    takeVideo: {
        position: 'absolute',
        zIndex: 5,
        bottom: 0,
        // transform: [{ translateX: '-50%' }]
        right: '25%'

    },
    menu: {
        
        position: 'absolute',
        zIndex: 5,
        botton: 5,
        left: 5
    }
})
export {styles};