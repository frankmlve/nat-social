import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { Button, Card, Divider } from 'react-native-elements'

export default function Login({ data, buttonDisabled, navigation, natSocial }) {
    
    return (
        <SafeAreaView>
        <Card>
            <View>
                <Text>Please Log in</Text>
                <Button title='Login' onPress={() => data()} disabled={buttonDisabled}></Button>
            </View>
            <Divider/>
            <View>
                <Button title={'Create a new account'} type='clear' onPress={() => navigation.navigate('Register', {natSocial: natSocial})}> </Button>
            </View>
        </Card>
    </SafeAreaView>
    )
}
