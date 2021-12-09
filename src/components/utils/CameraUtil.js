import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react'
import { Image, Modal, Platform, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

import {styles} from './styles'

export default function CameraUtil({modalVisible, setModalVisible, setBuffer, saveAction}) {
    
    useEffect(() => {
        getGalleryPermisson()
        
    })
    // const [modalVisible, setModalVisible] = useState(false)
    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [imagePreview, setImagePreview] = useState([])

    const getGalleryPermisson = (async () => {
        if (Platform.OS !== 'web') {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(status === 'granted');
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }else {
                cameraRoll()
            }
        }
    });
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);
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

                setBuffer([file])
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
                        // style={styles.fixedRatio}
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
                <Button title="Save" onPress={() => saveAction(imagePreview)} />
            </Modal>
    )
}
