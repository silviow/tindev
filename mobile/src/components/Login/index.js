import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import logo from '../../assets/logo.png';
import api from '../../services/api'
import { 
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';

export default function Login({ navigation }) {
    const [user, setUser] = useState("");

    useEffect(() => {
        AsyncStorage.getItem("user").then(user => {
            if (user) {
                navigation.navigate("Main", { user });
            }
        })
    }, []);

    async function handleLogin() {
        const response = await api.post("/devs", {
            username: user
        });

        const { _id } = response.data;

        await AsyncStorage.setItem("user", _id)

        navigation.navigate("Main", { user: _id });
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === "ios"}
            style={styles.container}
        >
            <Image source={logo} />
            <TextInput 
                autoCapitalize="none"
                placeholder="Enter your GitHub username :)" 
                placeholderTextColor="#c9c9c9"
                style={styles.input}
                value={user}
                onChangeText={setUser}
            />
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    input: {
        height: 46,
        color: "#666",
        alignSelf: "stretch",
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderRadius: 8,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    button: {
        height: 46,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: "#df4723",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    }
});