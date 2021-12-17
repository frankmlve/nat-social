import React, { useState } from 'react'
import { Dimensions, Image, View } from 'react-native';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import CameraUtil from '../utils/CameraUtil'
import { Button, Icon } from 'react-native-elements';
import { Provider } from 'react-native-paper';
import { styles } from './styles';

export default function Add({ navigation, route }) {
    const [modalVisible, setModalVisible] = useState(true);
    const [buffer, setBuffer] = useState([])
    const [image, setImage] = useState('')

    const closeCamera = (images, buffer) => {
        navigation.navigate('Edit', {
            images,
            natSocial: route.params.natSocial,
            user: route.params.user,
            buffer
        })
    }
    const _rotateRight = async () => {
        const manipResult = await manipulateAsync(
            image,
            [
                { rotate: 90 },
            ],
            { compress: 1, format: SaveFormat.JPEG }
        );
        const file = [new File([manipResult.uri], 'image.jpeg', { type: SaveFormat.JPEG })]

        setBuffer(buffer.push(file))
        setImage(manipResult.uri);
    };
    const _rotateLeft = async () => {
        const manipResult = await manipulateAsync(
            image,
            [
                { rotate: -90 },
            ],
            { compress: 1, format: SaveFormat.JPEG }
        );
        const file = [new File([manipResult.uri], 'image.jpeg', { type: SaveFormat.JPEG })]

        setBuffer(file)
        setImage(manipResult.uri);
    };
    return (
        <Provider>
            {/* <View>
                    {image !== '' &&
                        <Image source={{ uri: image }} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2 }} />
                    }
                    <Icon
                        name="rotate-right"
                        size={15}
                        color="black" onPress={_rotateRight} />
                    <Icon
                        name="rotate-left"
                        size={15}
                        color="black" onPress={_rotateLeft} />
                </View> */}
            <View style={styles.cameraContaier}>
                <CameraUtil
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    setBuffer={setBuffer}
                    buffer={buffer}
                    saveAction={closeCamera}
                />
            </View>
        </Provider>
    )
}
