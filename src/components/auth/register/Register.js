import React, { useState } from 'react'
import { Button, Image, SafeAreaView, View } from 'react-native'
import { Card, Divider, Icon, Input,  Text } from 'react-native-elements'
import { create } from 'ipfs-http-client'

import CameraUtil from '../../utils/CameraUtil'

//Declare IPFS
const ipfs = create('https://ipfs.infura.io:5001/api/v0')

export default function Register({ natSocial }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [buffer, setBuffer] = useState()
    const [image, setImage] = useState('')
    const [loading, isLoading] = useState(false)

    const closeCamera = (image) => {
        setImage(image)
        setModalVisible(false)
    }
    const createUser = async (username) => {
        let file = null
        if (buffer.length > 0) {
          file = await ipfs.add(buffer);
        }
        isLoading(true)
        natSocial.createUser(username, file ? file.path : '', this.state.account)
          .then((transaction) => {
            isLoading(false)
          })
      }
    return (
        <SafeAreaView>
            <Card>
                <View>
                    <Text h1>Welcome</Text>
                </View>
                <Divider />
                <View>
                    <Text h4> Create a new account</Text>
                    <Input placeholder='Username' />
                    <Input placeholder='Description' />
                    <Icon name='camera' onPress={() => {
                        setModalVisible(true)
                    }} />
                    {image && <Image
                        source={{ uri: image }}
                        style={{ width: 200, height: 200 }} />
                    }
                </View>
                <Divider />
                <Button title='Register' />
            </Card>
            <CameraUtil
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setBuffer={setBuffer}
                saveAction={closeCamera}
            />
        </SafeAreaView>
    )
}
