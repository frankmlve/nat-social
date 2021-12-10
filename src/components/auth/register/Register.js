import React, { useEffect, useState } from 'react'
import { Button, Image, SafeAreaView, View } from 'react-native'
import { Card, Divider, Icon, Input, LinearProgress, Text } from 'react-native-elements'
import { create } from 'ipfs-http-client'

import CameraUtil from '../../utils/CameraUtil'

//Declare IPFS
const ipfs = create('https://ipfs.infura.io:5001/api/v0')

export default function Register({natSocial, navigation}) {

    const [modalVisible, setModalVisible] = useState(false);
    const [buffer, setBuffer] = useState()
    const [image, setImage] = useState('')
    const [loading, isLoading] = useState(false)
    const [account, setAccount] = useState('')
    const [isDisabled, setDisabled] = useState(false)
    const [username, setUsername] = useState('')
    const [description, setDescription] = useState('')

    const closeCamera = (image) => {
        setImage(image)
        setModalVisible(false)
    }
    const createUser = async () => {
        isLoading(true)
        let file = null
        if (buffer.length > 0) {
            file = await ipfs.add(buffer[0]);
        }
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
                natSocial.createUser(username, file ? file.path : '', description, result[0])
                    .then((transaction) => {
                        isLoading(false)
                        navigation.navigate('Main')
                    })
            })
            .catch(error => {
                console.log(error.message)
                return
            });
    }
    return (
        <SafeAreaView>
            <LinearProgress color='#420566' variant='indeterminate' />
            <Card>
                <View>
                    <Text h1>Welcome</Text>
                </View>
                <Divider />
                <View>
                    <Text h4> Create a new account</Text>
                    <Input placeholder='Username' onChangeText={username => setUsername(username)} />
                    <Input placeholder='Description' onChangeText={description => setDescription(description)} />
                    <Icon name='camera' onPress={() => {
                        setModalVisible(true)
                    }} />
                    {image && <Image
                        source={{ uri: image }}
                        style={{ width: 200, height: 200 }} />
                    }
                </View>
                <Divider />
                <Button title='Register' disabled={isDisabled} onPress={() => createUser()} />
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
