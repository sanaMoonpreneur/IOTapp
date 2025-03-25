import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ImageBackground, ActivityIndicator, RefreshControl, Alert } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native-virtualized-view";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

const HomeScreen = (props) => {
    // const navigation = useNavigation();
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
                                props.navigation.openDrawer();
                            }}

                        >
                            <Image
                                source={require('../images/hum.png')}
                                style={styles.drawerButtonImage}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
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
});

export default HomeScreen;