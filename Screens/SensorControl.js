import React, { useEffect, useState } from 'react';
import { View, TextInput, Switch, ActivityIndicator, TouchableOpacity, Image, ImageBackground, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SensorControl = ({ route }) => {

    const navigation = useNavigation();
    const { component, device } = route.params;

    return (
        <ImageBackground source={require('../images/chs.png')} style={{ width: '100%', height: '100%' }}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 20, marginTop: 20, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.crossButton}>
                        <Image source={require('../images/a1.png')} style={{ width: 20, height: 15 }} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.header}>Sensor</Text>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    header: { fontSize: 35, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
    crossButton: { paddingHorizontal: 10, paddingVertical: 13, borderRadius: 10, marginTop: 30, backgroundColor: '#d1a0a7' },
});

export default SensorControl;