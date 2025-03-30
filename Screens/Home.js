import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ImageBackground, ActivityIndicator, RefreshControl, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native-virtualized-view";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = (props) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [devicesResponse, setDevicesResponse] = useState(null);
    const [token, setToken] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isFocused) {
            fetchData();
            console.log('focused')
        }
    }, [isFocused]);

    const fetchData = async () => {
        const newToken = await fetchToken();
        console.log('Token below');
        console.log(newToken);
        if (newToken) {
            fetchDevices(newToken);
        }
    };

    const fetchToken = async () => {
        try {
            const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
            if (storedLoginResponse) {
                const parsedResponse = JSON.parse(storedLoginResponse);
                const newToken = parsedResponse.result[0].token;
                const name = parsedResponse.result[0].student_name;
                setToken(newToken);
                setUser(name)
                return newToken;

            }
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
        }
    };

    const fetchDevices = async (apiToken) => {
        try {
            const apiUrl = 'https://thingproxy.freeboard.io/fetch/https://test.moonr.com/LMSService/api/IOT/GetDevices';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_active_filter: 1 }),
            });

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.statusCode === 200 && !result.isError) {
                setDevicesResponse(result.result);
            }
            else {
                console.error('Failed to fetch devices:', result.message);
            }
        } catch (error) {
            console.error('Error during fetching devices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../images/Home.png')}
            style={styles.backgroundImage}
        >
            <ScrollView>
                <View style={styles.headerContainer}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.drawerButton}
                            onPress={() => {
                                navigation.openDrawer();
                            }}

                        >
                            <Image
                                source={require('../images/hum.png')}
                                style={styles.drawerButtonImage}
                            />
                        </TouchableOpacity>

                        <View style={styles.welcomeTextContainer}>
                            <Text style={styles.welcomeText}>
                                Welcome Home
                            </Text>
                            <Text style={styles.userNameText}>
                                Neelesh Jain
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.cardContainer}>
                    <View>
                        <Text style={styles.cardHeadText}>
                            Start Controlling Your Devices
                        </Text>
                        <View

                            style={styles.cardButton}
                        >
                            <Text style={styles.cardButtonText}>Let's go !</Text>

                        </View>
                    </View>
                    <Image
                        source={require('../images/undraw.png')}
                        style={{ marginLeft: -80, marginTop: 35 }}
                    />

                </View>

                <Text style={styles.addedDevicesText}>Added Devices</Text>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%",
    },
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    headerContent: {
        width: '85%',
        marginTop: 50
    },
    drawerButton: {
        width: '40',
        paddingHorizontal: 10,
        paddingVertical: 13,
        borderRadius: 10,
        backgroundColor: "#d1a0a7",
        alignSelf: 'flex-start',
        marginTop: 20,
        marginLeft: 10
    },
    drawerButtonImage: {
        height: 15,
        width: 20
    },
    cardContainer: {
        flexDirection: "row",
        backgroundColor: "#FFF2F2",
        marginTop: 35,
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 35,
        paddingLeft: 30
    },
    cardHeadText: {
        color: "#345c74",
        fontSize: 20,
        fontWeight: "bold",
        width: 250,
        paddingRight: 100
    },
    cardButton: {
        backgroundColor: "#f58084",
        alignItems: "center",
        marginTop: 20,
        width: 130,
        height: 30,
        justifyContent: 'center',
        borderRadius: 20,
        paddingHorizontal: 10
    },
    cardButtonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
    },
    welcomeTextContainer: {
        width: "90%",
        marginTop: 25,
        marginLeft: 10
    },
    welcomeText: {
        fontSize: 33,
        fontWeight: "bold",
        color: "#FFF"
    },
    userNameText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#FFF"
    },
    addedDevicesHeaderContainer: {
        marginTop: 145,
    },
    addedDevicesText: {
        color: "#EC8588",
        fontWeight: "bold",
        fontSize: 20,
        paddingHorizontal: 22,
        marginTop: 20,
        marginBottom: 10
    },
});

export default HomeScreen;