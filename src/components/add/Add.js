import React, { useState } from 'react'
import { Dimensions, Image, View } from 'react-native';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import CameraUtil from '../utils/CameraUtil'
import { Button } from 'react-native-elements';

export default function Add({ navigation }) {
    const [modalVisible, setModalVisible] = useState(true);
    const [buffer, setBuffer] = useState()
    const [image, setImage] = useState('')

    const closeCamera = (image) => {
        setImage(image)
        setModalVisible(false)
    }
    const _rotate90andFlip = async () => {
        const manipResult = await manipulateAsync(
          image,
          [
            { rotate: 90 },
            { flip: FlipType.Vertical },
          ],
          { compress: 1, format: SaveFormat.JPEG }
        );
        setImage(manipResult.uri);
      };
    return (
        <View>
            <View>
                {image !== '' && 
                    <Image source={{uri: image}} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2 }}/>
                }
                <Button title="Rotate and Flip" onPress={_rotate90andFlip} />
            </View>
            <CameraUtil
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setBuffer={setBuffer}
                saveAction={closeCamera}
            />
        </View>
    )
}
