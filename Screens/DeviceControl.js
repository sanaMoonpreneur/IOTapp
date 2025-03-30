import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, Text, Switch, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DeviceControl = ({ navigation, route }) => {
    const { device } = route.params;
    const isFocused = useIsFocused();
    const [componentName, setComponentName] = useState('');
    const [components, setComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [securityToken, setSecurityToken] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [componentStatuses, setComponentStatuses] = useState({});

    useEffect(() => {
        if (isFocused) {
            fetchToken();
        }
    }, [isFocused]);

    const fetchToken = async () => {
        try {
            const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
            if (storedLoginResponse) {
                const parsedResponse = JSON.parse(storedLoginResponse);
                const newToken = parsedResponse.result[0].token;
                setToken(newToken);
                fetchComponents(newToken);
            }
        } catch (error) {
            console.error('Error retrieving token:', error);
        }
    };

    const fetchUserProfile = async (token) => {
        if (!token) return;

        try {
            const response = await fetch('https://test.moonr.com/LMSService/api/IOT/UserProfile', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.status === 200) {
                const data = await response.json();
                const userProfile = data?.result?.[0];
                setSecurityToken(userProfile?.security_token || 'N/A');
                // console.log('security token here : ', securityToken);
            } else {
                console.error('Failed to fetch profile:', response.status);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const saveComponent = async () => {
        if (!componentName || !selectedType) {
            Alert.alert('Error', 'Please provide a component name and type');
            return;
        }
        console.log("Component Name:", componentName);
        console.log("Selecrted type Name:", selectedType);

        setIsLoading(true);

        let finalComponentPin = '';


        if (selectedType === 'Sensor') {
            finalComponentPin = 'Senso';
        } else if (selectedType === 'Toggle') {
            finalComponentPin = 'Toggle';
        } else {
            Alert.alert('Error', 'Invalid component type selected');
            setIsLoading(false);
            return;
        }
        let component_id
        if (selectedType === 'Sensor') {
            component_id = 5;
        } else {
            component_id = 1;
        }
        console.log("Final Component Pin:", finalComponentPin);

        const componentData = {
            user_device_id: device.user_device_id,
            device_component_id: 0,
            device_component_name: componentName,
            component_id: component_id,
            component_pin: finalComponentPin,
            is_active: 1,
        };
        console.log("Request data:", componentData);

        try {
            const response = await fetch('https://test.moonr.com/LMSService/api/IOT/AddUpdateComponent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'security-key': securityToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(componentData),
            });

            const result = await response.json();

            if (result.isError) {
                const errorMessages = result.responseException.validationErrors
                    .map(error => error.errorMessage)
                    .join('\n');
                Alert.alert('Validation Error', errorMessages);
            }

            if (response.ok && result.statusCode === 200) {
                Alert.alert('Success', 'Component saved successfully');
                // fetchComponents(token);
                setBottomSheetVisible(false);
            } else {
                Alert.alert('Error', result.message || 'Failed to save component');
            }
        } catch (error) {
            console.error('Error saving component:', error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <ImageBackground source={require('../images/chs.png')} style={{ width: '100%', height: '100%' }}>
            <View style={{ flex: 1, }}>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    paddingHorizontal: 20,
                    marginTop: 20,
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{
                        paddingHorizontal: 10,
                        paddingVertical: 13,
                        borderRadius: 10,
                        marginTop: 30,
                        backgroundColor: '#d1a0a7'
                    }}>
                        <Image source={require('../images/a1.png')} style={{ width: 20, height: 15 }} />
                    </TouchableOpacity>
                </View>
                <Text style={{
                    color: 'white', fontSize: 35, fontWeight: "bold", width: '100%', alignSelf: 'center', textAlign: 'center', marginBottom: 20
                }}>Manage{'\n'} Components</Text>
                <View style={{ padding: 25, }}>

                    <FlatList
                        data={components}
                        renderItem={({ item }) => (
                            <View style={styles.componentItem}>
                                <TouchableOpacity>
                                    <Text style={{ fontWeight: 'bold' }}>{item.device_component_name} ({item.component_pin})</Text>
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <Switch
                                        value={componentStatuses[item.device_component_id] || false}
                                        onValueChange={() => toggleComponentStatus(item.device_component_id, componentStatuses[item.device_component_id])}
                                    />
                                    <TouchableOpacity >
                                        <MaterialIcons name="cancel" size={24} color="grey" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item) => item.device_component_id.toString()}
                    />

                    <TouchableOpacity style={styles.button} onPress={() => setBottomSheetVisible(true)}>
                        <Text style={styles.buttonText}>Add Component</Text>
                    </TouchableOpacity>

                    <Modal visible={isBottomSheetVisible} animationType="slide" transparent>
                        <View style={styles.bottomSheetContainer}>
                            <View style={styles.bottomSheet}>
                                <Text style={styles.bottomSheetTitle}>Select Component Type</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Component Name"
                                    value={componentName}
                                    onChangeText={setComponentName}
                                />
                                <TouchableOpacity
                                    style={[styles.optionButton, selectedType === 'Sensor' && styles.selectedOption]}
                                    onPress={() => setSelectedType('Sensor')}>
                                    <Text style={styles.optionText}>Sensor</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.optionButton, selectedType === 'Toggle' && styles.selectedOption]}
                                    onPress={() => setSelectedType('Toggle')}>
                                    <Text style={styles.optionText}>Toggle</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setBottomSheetVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.save} onPress={saveComponent} disabled={isLoading}>
                                    {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    header: { fontSize: 20, fontWeight: 'bold', marginTop: 50 },
    button: { backgroundColor: 'white', width: 150, padding: 12, borderRadius: 25, alignItems: 'center', marginTop: 10, alignSelf: 'center' },
    save: { backgroundColor: '#EC8588', padding: 12, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#EC8588', fontSize: 16, fontWeight: 'bold' },
    saveText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    componentItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, backgroundColor: 'white',
        borderRadius: 20, marginBottom: 10
    },
    bottomSheetContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    bottomSheet: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    bottomSheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 15 },
    optionButton: { backgroundColor: '#f0f0f0', padding: 10, marginBottom: 10, borderRadius: 15, alignItems: 'center' },
    selectedOption: { backgroundColor: '#4CAF50' },
    optionText: { fontSize: 16 },
    cancelButton: { backgroundColor: 'gray', padding: 12, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    crossButton: { backgroundColor: 'gray', padding: 12, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    cancelButtonText: { color: '#fff', fontSize: 16 },
    statusText: { fontSize: 16, marginTop: 10 },
    slider: { width: '80%', marginTop: 10 },
});

export default DeviceControl;