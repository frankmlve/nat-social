import React, { useState } from 'react'
import { ActivityIndicator, Dimensions, Image, SafeAreaView, TextInput, View } from 'react-native'
import { Button } from 'react-native-elements'
import { create } from 'ipfs-http-client'
import { ethers } from 'ethers'
import { useNavigation } from '@react-navigation/native';


//Declare IPFS
const ipfs = create('https://ipfs.infura.io:5001/api/v0')

export default function Edit({ route }) {
    const [caption, setCaption] = useState("")
    const [imageHash, setImageHash] = useState('')
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation();

    const createPost = async () => {
        //adding file to the IPFS
        setLoading(true)
        let result = []
        let postHashes = []
        for (let file of [...route.params.buffer]) {
            const _file = await ipfs.add(file)
            postHashes.push([ethers.BigNumber.from('0'), _file.path, file.type])
        }
        route.params.natSocial.createPost(postHashes, caption, route.params.user,
            { from: route.params.user.account })
            .then((transaction) => {
                transaction.wait(1).then(() => {
                    setLoading(false)
                    navigation.navigate('Main')
                })
            })

    }

    return (
        <SafeAreaView>
            {loading ?
                <ActivityIndicator color='#420566' size="large" />
                :
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: route.params.images }} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2 }} />
                    <TextInput placeholder="Write a Caption ..."
                        onChangeText={(caption) => setCaption(caption)}
                    />
                    <Button title="Save" onPress={() => createPost()} />
                </View>
            }
        </SafeAreaView>
    )
}
