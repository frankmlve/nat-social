import {  Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "grey",
  },
  container: {
    flex: 1,
    backgroundColor: '#420566',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 15
  },
  postUsername: {
    color: '#95171B',
    fontSize: 20
  },
  post: {
    padding: 0, 
    margin: 0,
    marginBottom: 10,
    marginTop: 10
  },
  carousel: {
    flexGrow: 0,
    height: 450
  },
  carouselItem:{
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8
  },
  postImage: {
    // backgroundColor: colors.sunDownBlue,
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
  }
});
export {styles};