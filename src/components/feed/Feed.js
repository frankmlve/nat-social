import React, { Component, useEffect, useState, useRef } from 'react'
import { Image, View, Dimensions, TouchableOpacity, TextInput, FlatList, ScrollView, SafeAreaView, RefreshControl } from 'react-native'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import detectEthereumProvider from '@metamask/detect-provider'
import { Avatar, Button, Card, Icon, ListItem, Input, Text, LinearProgress } from 'react-native-elements'
import Carousel from 'react-native-anchor-carousel';
import * as Yup from "yup";
import { Formik } from 'formik'
import { useNavigation } from '@react-navigation/native';

import SocialNetwork from '../../abis/SocialNetwork.json'
import TestCoin from '../../abis/TestCoin.json'
import heart from '../../assets/heart-outline.svg'
import defaultUser from '../../assets/default-profile.svg'
import { styles } from './styles'

//Declare IPFS
const ipfs = create('https://ipfs.infura.io:5001/api/v0')
const validationSchema = Yup.object().shape({
  comment: Yup.string().required()
})
function Feed(props) {
  const [playVideo, setPlayVideo] = useState(false)
  const [comment, setComment] = useState()
  const carouselRef = useRef(null);
  const [valid, isValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])

  const navigation = useNavigation();
  let likeCount = 0
  let userLiked = false
  let commentInput = null
  
  useEffect(() => {
    setPosts(props.posts)
    console.log(posts)
  }, posts)


  const playVideoFunction = (ref) => {
    if (playVideo) {
      ref.play()
      setPlayVideo(false)
    } else {
      ref.pause()
      setPlayVideo(true)
    }
  }
  const commentPost = (id, comment) => {
    setLoading(true)
    props.natSocial.commentPost(id, comment, props.user, { from: props.user.author }).then(() => {
      setLoading(false)
    })
  }
  const deleteComment = (id) => {
    props.natSocial.deleteComment(id).then(
      console.log('estoy aqui')
    )
  }
  const likePost = (id) => {
    props.natSocial.setLike(id, props.user, { from: props.user.author }).then(
      console.log('estoy aqui')
    )
  }

  const unLikePost = (id) => {
    props.natSocial.unLike(id, props.user, { from: props.user.author }).then(
      console.log('estoy aqui')
    )
  }
  const deletePost = (id) => {
    setLoading(true)
    props.natSocial.deletePost(id).then(
      setLoading(false)
    )
  }
  function renderItem({ item, index }) {

    return (
      <TouchableOpacity
        key={item}
        style={styles.carouselItem}
        onPress={() => {
          carouselRef.current.scrollToIndex(index);
        }}>
        {item.fileType.includes('image') === true ?
          <Card.Image source={{ uri: `https://ipfs.infura.io/ipfs/${item.hash}` }} style={styles.postImage} />
          :
          // <video className='post-vido w-100' ref='video' controlsList="nodownload nofullscreen" onClick={() => {
          //   playVideoFunction(this.refs.video)
          // }}>
          //   <source src={`https://ipfs.infura.io/ipfs/${file.hash}`} type={file.fileType} />
          // </video>
          <Text>Hola</Text>
        }
      </TouchableOpacity>
    )
  }
  const renderComments = ({ item, index }) => {
    return item.user.author !== ethers.constants.AddressZero ?
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            {
              item.user.image !== '' ?
                <Avatar
                  size="small"
                  rounded
                  source={{ uri: `https://ipfs.infura.io/ipfs/${item.user.image}` }} />
                :
                <Avatar
                  size="small"
                  rounded
                  // style={styles.avatar}
                  source={require('../../assets/default-profile.svg')} />
            }
            <Text>{item.user.username}</Text>
          </View>
          {item.user.author === props.user.author ?
            <Icon name='remove'
              size={15}
              containerStyle={{ alignSelf: 'flex-start' }}
              type='font-awesome' onClick={event => {
                deleteComment(item.id)
              }} />
            : null
          }
        </View>
        <Text>{item.comment}</Text>
        <Card.Divider />
      </View>
      : null

  }

  return (
    <SafeAreaView style={styles.container}>
      {props.posts?.map((post, key) => {
        likeCount = 0
        userLiked = false
        return post.post.author.author !== ethers.constants.AddressZero ?
          <ScrollView key={post.post}>
            <Card containerStyle={styles.post}>
              <View style={[styles.alignRow, { justifyContent: 'space-between' }]} onTouchEnd={() => navigation.navigate("Profile", { user: post.post.author.author, natSocial: props.natSocial })}>
                <View style={styles.alignRow}>
                  {post.post.author.image !== '' ?
                    <Avatar
                      rounded
                      size='medium'
                      source={{ uri: `https://ipfs.infura.io/ipfs/${post.post.author.image}` }} />
                    :
                    <Avatar
                      rounded
                      size='medium'
                      source={require('../../assets/default-profile.svg')} />

                  }
                  <Text style={[{ alignSelf: 'center', marginStart: 10 }, styles.postUsername]} >{post.post.author.username}</Text>
                </View>
                {post.post.author.author === props.user.author ?
                  <Icon name='remove'
                    size={15}
                    containerStyle={{ alignSelf: 'flex-start' }}
                    type='font-awesome' onClick={event => {
                      deletePost(post.post.id)
                    }} />
                  : null
                }
              </View>
              <Card.Divider />
              <Carousel
                data={post.files}
                style={styles.carousel}
                itemWidth={Dimensions.get('window').width}
                containerWidth={Dimensions.get('window').width}
                renderItem={renderItem}
              />
              <Text style={{ marginBottom: 10 }}>
                {post.post.description}
              </Text>
              <Card.Divider />
              {post.likes.map(like => {
                if (like.user.author !== ethers.constants.AddressZero) {
                  likeCount++
                }
              })}
              {likeCount > 0 ?
                <Text className='text-light' style={{ paddingHorizontal: 10 }}>
                  <Icon name='heart' type='font-awesome' color='grey' size={15} />
                  {likeCount}</Text>
                : null
              }
              {loading ?
                <LinearProgress color='primary' value={1} />
                : null
              }
              <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>

                {post.likes.filter(like => like.user.author.toLowerCase() === props.user.author.toLowerCase()).map(li => {
                  userLiked = true
                  return li?.postId._hex === post.post.id._hex ?

                    <Icon name='heart' type='font-awesome' color='red' style={[styles.likeButton]} onClick={(event) => {
                      unLikePost(post.post.id)
                    }} />
                    :
                    null
                })}
                {!userLiked ?
                  <Icon name='heart' type='font-awesome' color='grey' style={[styles.likeButton]} onClick={(event) => {
                    likePost(post.post.id)
                  }} />
                  : null
                }

                <Input
                  containerStyle={styles.box}
                  placeholder="Comment"
                  ref={input => commentInput = input}
                  onChangeText={value => {
                    setComment(value)
                    isValid(true)
                  }}
                />
                <Button
                  type="clear"
                  icon={{
                    name: 'comment', size: 15, type: 'font-awesome', color: 'grey'
                  }}
                  onPress={(event) => {
                    commentInput.clear()
                    commentPost(post.post.id, comment, props.user)
                  }}
                  disabled={!valid}
                />
              </View>
              <FlatList
                style={{ flex: 1, paddingHorizontal: 10 }}
                data={post.comments}
                renderItem={renderComments} />
            </Card>
          </ScrollView>
          : null
      })}
    </SafeAreaView>
  )
}
export default Feed