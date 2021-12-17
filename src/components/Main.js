import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import SocialNetwork from '../abis/SocialNetwork.json'
import TestCoin from '../abis/TestCoin.json'

import FeedScreen from './feed/Feed'
import ProfileScreen from './profile/Profile';
import { ActivityIndicator, Button, Text, View } from 'react-native'
import { LinearProgress } from 'react-native-elements'
import AuthNavigator from '../navigation/AuthNavigator'
import { NavigationContainer } from '@react-navigation/native'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}
class Main extends Component {

    async componentDidMount() {
        await this.getNetworkData()
        await this.getUserAccount()
        window.ethereum.on('accountsChanged', function (accounts) {
            console.log(accounts)
        });
        ethereum.on('disconnect', function (accounts) {
            console.log(accounts)
        });
    }
    getUserAccount() {
        this.setState({ buttonDisabled: true })
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(async result => {
                this.setState({ account: result[0], login: true })
                this.setState({ loading: false })
                await this.loadBlockchainData()
            })
            .catch(error => {
                console.log(error.message)
                this.setState({ loading: false })
                this.setState({ buttonDisabled: false })

            });
    }
    async loadBlockchainData() {


        if (window.ethereum.selectedAddress !== '') {
            const balance = await this.state.coin.balanceOf(this.state.account)
            const logs = await this.state.provider.getLogs({ address: TestCoin.networks[this.state.networkID].address })
            const _user = await this.state.natSocial.getUser(this.state.account)
            const posts = await this.state.natSocial.getPosts()
            this.setState({ user: _user, posts })
            // // Sort images. Show highest tipped images first
            // this.setState({
            //     posts: this.state.posts.sort((a, b) => b.tipAmount - a.tipAmount)
            // })

        }
    }
    async getNetworkData() {
        // Network ID
        const networkID = await window.ethereum.request({ method: 'net_version' })
        const networkData = SocialNetwork.networks[networkID]

        if (networkData) {
            const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(networkData.address, SocialNetwork.abi, signer)
            const coin = new ethers.Contract(TestCoin.networks[networkID].address, TestCoin.abi, signer)
            this.setState({ natSocial: contract, coin, provider, networkID })
        } else {
            window.alert('socialNetwork contract not deployed to detected network.')
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            account: '',
            natSocial: null,
            posts: [],
            comments: [],
            imagePreview: [],
            buffer: [],
            loading: true,
            provider: null,
            login: false,
            user: null,
            nonRegistered: false,
            buttonDisabled: false
        }
        this.getUserAccount = this.getUserAccount.bind(this)
    }
    render() {
        if (this.state.loading) {
            return (
                <ActivityIndicator color='#420566' size="large" />
            )
        }
        if (!this.state.login || this.state.user?.account === ethers.constants.AddressZero) {
            return (
                <AuthNavigator
                    natSocial={this.state.natSocial}
                    data={this.getUserAccount}
                    buttonDisabled={this.state.buttonDisabled}
                    navigation={this.props.navigation} />
            )
        }
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false} key={this.state.account}>
                <Tab.Screen name="Feed"
                    children={() => <FeedScreen
                        user={this.state.user}
                        natSocial={this.state.natSocial}
                        posts={this.state.posts} />}
                    options={{
                        tabBarIcon: (({ color, size }) =>
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                        headerShown: false
                    }}></Tab.Screen>
                    <Tab.Screen name="Profile"
                        listeners={({ navigation }) => ({
                            tabPress: event => {
                                event.preventDefault();
                                navigation.navigate("Profile", { user: this.state.account, natSocial: this.state.natSocial })
                            }
                        })}
                        component={ProfileScreen}
                        options={{
                            tabBarIcon: (({ color, size }) =>
                                <MaterialCommunityIcons name="account" color={color} size={26} />
                            ),
                            headerShown: false
                        }}></Tab.Screen>
                        <Tab.Screen name="MainAdd" component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add", { user: this.state.user, natSocial: this.state.natSocial})
                        }
                    })}
                    options={{
                        tabBarIcon: (({ color, size }) =>
                            <MaterialCommunityIcons name="plus-circle-outline" color={color} size={26} />
                        ),
                        headerShown: false
                    }}></Tab.Screen>
                {/* <Tab.Screen name="Profile" component={ProfileScreen} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: (({ color, size }) =>
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
                        headerShown: false
                    }}></Tab.Screen> */}
                {/*
 
                <Tab.Screen name="BSC Bank"
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("BSC Bank")
                        }
                    })}
                    component={Metamask}
                    options={{
                        tabBarIcon: (({ color, size }) =>
                            <MaterialCommunityIcons name="bank" color={color} size={26} />
                        ),
                        headerShown: false
                    }}></Tab.Screen> */}
            </Tab.Navigator>
        )
    }
}
export default Main;