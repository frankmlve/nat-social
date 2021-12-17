import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Text, Modal, Button, Image, Platform, TextInput, Alert, ActivityIndicator } from 'react-native'
import { Accessory, Avatar, Card, FAB, Icon, LinearProgress } from 'react-native-elements'
import { create } from 'ipfs-http-client'
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { ethers } from 'ethers'
import axios from 'axios';

import { styles } from './styles'

//Declare IPFS
const ipfs = create('https://ipfs.infura.io:5001/api/v0')

export default function Profile({ route, navigation }) {

    const [userProfile, setUserProfile] = useState(null)
    const [loading, isLoading] = useState(true)
    const [buffer, setBuffer] = useState()
    const [imagePreview, setImagePreview] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [editProfile, setEditProfile] = useState(false)
    const [newUsername, setNewUserName] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [imageProfile, setImageProfile] = useState('')

    useEffect(() => {
        getUser()
        getGalleryPermisson()
    }, [])

    const getUser = (async () => {
        const _u = await route.params.natSocial.getUser(route.params.user)
        if (_u.account === ethers.constants.AddressZero) {
            // navigation.navigate('Login')
        }
        setUserProfile(_u)
        axios.get(`https://ipfs.infura.io/ipfs/${_u.image}`).then(res => {
            setImageProfile(res.data)
        })
        isLoading(false)
    })
    const getGalleryPermisson = (async () => {
        if (Platform.OS !== 'web') {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(status === 'granted');
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    });
    const updateUser = async (username) => {
        //adding file to the IPFS
        let file = null
        if (buffer) {
            file = await ipfs.add(buffer[0]);
        }

        isLoading(true)
        route.params.natSocial.userUpdate(file ? file.path : userProfile?.image ? userProfile.image : '',
            username !== '' ? username : userProfile?.username !== '' ? userProfile.username : route.params.user,
            newDescription !== '' ? newDescription : userProfile?.description !== '' ? userProfile.description : '', userProfile)
            .then((transaction) => {
                transaction.wait(1).then(() => {
                    getUser()
                    isLoading(false)
                })
            })
            .catch(err => {
                console.log(err)
                getUser()
                Alert.alert(
                    "Alert Title",
                    "My Alert Msg",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                )
            })

    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        const code = result.uri.substring(result.uri.indexOf(',') + 1)
        const type = result.uri.substring(result.uri.indexOf(":") + 1, result.uri.indexOf(";"));

        const file = [new File([result.uri], 'profile-image' + '.' + type.split('/')[1], { type })]

        if (!result.cancelled) {
            setImagePreview(result.uri);
            setBuffer(file)
        }
    };
    const takePicture = async () => {
        if (camera) {
            await camera.takePictureAsync({ base64: false }).then(photo => {
                const type = photo.uri.substring(photo.uri.indexOf(":") + 1, photo.uri.indexOf(";"));

                const file = [new File([photo.uri], 'profile-image' + '.' + type.split('/')[1], { type })]

                setBuffer(file)
                setImagePreview(photo.uri)
            })
        }
    }
    const cameraRoll = () => {
        if (Platform.OS !== 'web') {
            MediaLibrary.getAssetsAsync({ first: 100 }).then(res => {
                console.log(res)
            })
        }
    }
    return (
        <SafeAreaView>
            <View style={styles.container}>
                {loading ?
                    <ActivityIndicator color='#420566' size="large" />
                    :
                    <Card containerStyle={{ margin: 0 }}>
                        {userProfile ?
                            <View>
                                <Icon name='edit'
                                    containerStyle={{ alignSelf: 'flex-end' }}
                                    color='#BF2025'
                                    size={20}
                                    onPress={() => {
                                        setEditProfile(true)
                                    }} />
                                <View>
                                    {imageProfile !== '' ?
                                        <Avatar
                                            onPress={() => {
                                                setModalVisible(true)
                                                setImagePreview(null)
                                                setEditProfile(false)
                                                cameraRoll()
                                            }}
                                            rounded
                                            size="large"
                                            source={{ uri: imageProfile }} >
                                            <Accessory />
                                        </Avatar>
                                        :
                                        <Avatar
                                            onPress={() => {
                                                setModalVisible(true)
                                                setImagePreview(null)
                                                setEditProfile(false)
                                                cameraRoll()
                                            }}
                                            rounded
                                            size="large"
                                            source={require('../../assets/default-profile.svg')} >
                                            <Accessory size={15} />
                                        </Avatar>
                                    }
                                    {editProfile ?
                                        <View style={{ flex: 1 }}>
                                            <>
                                                <TextInput placeholder={userProfile.username}
                                                    onChangeText={(value) => setNewUserName(value)} />
                                                <TextInput placeholder={userProfile.description}
                                                    onChangeText={(value) => setNewDescription(value)} />
                                            </>
                                            <Icon name='save'
                                                containerStyle={{ alignSelf: 'flex-end' }}
                                                color='#BF2025'
                                                size={20}
                                                type='fontawesome5'
                                                onPress={() => {
                                                    setEditProfile(false)
                                                    updateUser(newUsername)
                                                }} />
                                        </View>
                                        :
                                        <View>
                                            <Text style={styles.mainText}>{userProfile.username}</Text>
                                            <Text style={styles.altText}>{userProfile.description}</Text>
                                        </View>
                                    }
                                    <Text style={styles.altText} >{userProfile.account}</Text>
                                </View>
                            </View>
                            :
                            null
                        }
                    </Card>
                }
            </View>
            <Modal animationType='slide'
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <Icon name='closecircleo'
                    containerStyle={styles.closeButton}
                    color='#FFFFFF'
                    size={20}
                    type='antdesign'
                    onPress={() => {
                        setModalVisible(false)

                    }} />
                <View style={styles.cameraContainer}>
                    <Camera
                        ref={ref => setCamera(ref)}
                        style={styles.fixedRatio}
                        type={type}
                        ratio={'1:1'} />
                    <Icon
                        type='materialicons'
                        name='flip-camera-android'
                        containerStyle={styles.flipButton}
                        size={25}
                        color='#FFFFFF'
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                    </Icon>
                    <Icon
                        name='camera'
                        type='feather'
                        containerStyle={styles.takePicture}
                        size={45}
                        color='#FFFFFF' onPress={() => takePicture()} />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                    {imagePreview && <Image source={{ uri: imagePreview }} style={{ width: 200, height: 200 }} />}
                </View>
                <Button title="Save" onPress={() => updateUser('')} />
            </Modal>
        </SafeAreaView>
    )
}
