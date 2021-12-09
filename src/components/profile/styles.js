import {  Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "grey",
  },
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: '#ffffff',
    minHeight: Dimensions.get('window').height
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 15
  },
  carousel: {
    flexGrow: 0,
    height: 450
  },
  carouselItem:{
    width: 400,
    height: 400
  },
  postImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  likeButton: {
    flexShrink: 1,
    flexGrow: 0
  },
  box: {
    flex: 1,
    height: 50,
    width: 50,
  },
  alignRow: {
    margin: 10,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainText: {
    color: '#95171B',
    fontSize: 25
  },
  altText: {
    color: '#BF2025',
    fontSize: 12
  },
  cameraContainer: {
      flex: 1,
      flexDirection: 'row'
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

  }
});
export {styles};