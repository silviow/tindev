import React from 'react';
import logo from '../../assets/logo.png';
import { 
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';

export default function Login() {
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
        />
        <TouchableOpacity style={styles.button}>
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