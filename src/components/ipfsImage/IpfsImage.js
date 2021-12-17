import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Avatar, Card } from 'react-native-elements'
import axios from 'axios';

export default function IpfsImage(props) {

    const [image, setImage] = useState([])

    useEffect(() => {
        getImage()
    })
    const getImage = () => {
        if (props.images.hash){
            axios.get(`https://ipfs.infura.io/ipfs/${props.images.hash}`).then(res => {
                setImage(res.data)
            })
        }else {
            axios.get(`https://ipfs.infura.io/ipfs/${props.images}`).then(res => {
                setImage(res.data)
            })
        }

    }
    return (
        <View>
            {
                props.type === 'image' ?
                    <Card.Image source={{ uri: image }} style={props.style} />
                    :
                    <Avatar
                        size={props.size}
                        rounded
                        source={{ uri: image}} />

            }
        </View>
    )
}
