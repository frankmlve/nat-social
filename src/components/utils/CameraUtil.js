import { Camera, Constants } from 'expo-camera';
import { Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react'
import { Image, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Button, Divider, Icon, ListItem } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles } from './styles'
import { Dialog, Menu, Paragraph, Portal } from 'react-native-paper';

export default function CameraUtil({ modalVisible, setModalVisible, setBuffer, buffer, saveAction }) {

    useEffect(() => {
        getGalleryPermisson()
    })
    // const [modalVisible, setModalVisible] = useState(false)
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [record, setRecord] = useState(null);
    const [imagePreview, setImagePreview] = useState([])
    const [bufferArray] = useState([])
    const [menuVisible, showMenu] = useState(false)
    const [cameraRatio, setCameraRatio] = useState('1:1')
    const [ratioMenu, showRatioMenu] = useState(false)
    const video = useRef(null);
    const [status, setStatus] = React.useState({});

    const getGalleryPermisson = (async () => {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(status === 'granted');
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        } else {
            cameraRoll()
        }
        const audioStatus = await Camera.requestMicrophonePermissionsAsync();
        setHasAudioPermission(audioStatus.status === 'granted');
    });
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        const code = result.uri.substring(result.uri.indexOf(',') + 1)
        const type = result.uri.substring(result.uri.indexOf(":") + 1, result.uri.indexOf(";"));
        const file = new File([result.uri], 'profile-image' + '.' + type.split('/')[1], { type })
        bufferArray.push(file)
        if (!result.cancelled) {
            setImagePreview(result.uri);
            setBuffer(bufferArray)
        }
    };
    const takePicture = async () => {
        if (camera) {
            await camera.takePictureAsync({ base64: false }).then(photo => {
                const type = photo.uri.substring(photo.uri.indexOf(":") + 1, photo.uri.indexOf(";"));
                const file = new File([photo.uri], 'profile-image' + '.' + type.split('/')[1], { type })
                bufferArray.push(file)
                setBuffer(bufferArray)
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
    const takeVideo = async () => {
        if (camera) {
            const data = await camera.recordAsync({
                quality: Camera.Constants.VideoQuality['1080p'],
                maxDuration: 30,
                maxFileSize: 200,
                mute: false,
                videoBitrate: 5000000
            })
            setRecord(data.uri);
            console.log(data.uri);
        }
    }
    const stopVideo = async () => {
        camera.stopRecording();
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    type={type}
                    autoFocus={Camera.Constants.AutoFocus.on}
                    ratio={cameraRatio} />
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
                <Icon
                    name='video'
                    type='feather'
                    containerStyle={styles.takeVideo}
                    size={35}
                    color='#FFFFFF'
                    onPress={() => takeVideo()}
                    onPressOut={() => stopVideo()} />
                <View style={{ position: 'absolute', bottom: 5, right: 5, zIndex: 1 }}>
                    <Button onPress={() => showMenu(true)} icon={{
                        name: "arrow-right",
                        size: 15,
                        color: "white"
                    }}></Button>
                    <Portal>
                        <Dialog visible={menuVisible} onDismiss={() => showMenu(false)}>
                            <Dialog.Content>
                                <Menu visible={ratioMenu}
                                    onDismiss={() => showRatioMenu(false)}
                                    anchor={
                                        <TouchableOpacity
                                            style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between' }}
                                            onPress={() => showRatioMenu(true)}>
                                            <Text>Ratio</Text>
                                            <MaterialCommunityIcons
                                                name="chevron-right"
                                                size={20}

                                            />
                                        </TouchableOpacity>
                                    }>
                                    <Menu.Item
                                        title="1:1"
                                        onPress={() => {
                                            setCameraRatio('1:1')
                                            showRatioMenu(false)
                                            showMenu(false)
                                        }}>
                                    </Menu.Item>
                                    <Divider />
                                    <Menu.Item
                                        title="4:3"
                                        onPress={() => {
                                            setCameraRatio('4:3')
                                            showRatioMenu(false)
                                            showMenu(false)
                                        }}
                                    />
                                    <Divider />
                                    <Menu.Item
                                        title="16:9"
                                        onPress={() => {
                                            setCameraRatio('16:9')
                                            showRatioMenu(false)
                                            showMenu(false)
                                        }}
                                    />
                                </Menu>
                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Pick an image from camera roll" onPress={pickImage} />
                {imagePreview && <Image source={{ uri: imagePreview }} style={{ width: 200, height: 200 }} />}
                {video.current && <View>
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{
                            uri: record,
                        }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                    <View style={styles.buttons}>
                        <Button
                            title={status.isPlaying ? 'Pause' : 'Play'}
                            onPress={() =>
                                status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                            }
                        />
                    </View></View>}
            </View>
            <Button title="Save" onPress={() => saveAction(imagePreview, buffer)} />
        </View>
    )
}
