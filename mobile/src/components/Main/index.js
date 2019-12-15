import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import logo from '../../assets/logo.png';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import { 
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

export default function Main({ navigation }) {
    const id = navigation.getParam("user");
    const [ users, setUsers ] = useState([]);

    useEffect(() => {

        (async function loadUsers() {
            const response = await api.get("/devs", {
                headers: {
                    user: id,
                }
            });

            setUsers(response.data);
        })();

    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        })
        
        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id },
        })
        
        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate("Login");
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                { users.length === 0 ? (
                        <Text style={styles.empty}>At the moment there are no more registered devs :/</Text>
                    ) : (
                    users.map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio ? user.bio : "No description provided."}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
            
            { users.length !== 0 ? (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleDislike} style={styles.button}>
                        <Image style={styles.icon} source={dislike} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLike} style={styles.button}>
                        <Image style={styles.icon} source={like} />
                    </TouchableOpacity>
                </View>
            ) : ( <View /> ) }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        justifyContent: "space-between",
    },
    cardsContainer: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center",
        maxHeight: 500,
    },
    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        margin: 30,
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    avatar: {
        flex: 1,
        height: 300,
    },
    footer: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    bio: {
        fontSize: 14,
        color: "#999",
        marginTop: 7,
        lineHeight: 18,
    },
    logo: {
        marginTop: 30,
    },
    buttonsContainer: {
        flexDirection: "row",
        marginBottom: 30,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15,
        elevation: 1.5,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 1,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },
    empty: {
        alignSelf: "center",
        color: "#999",
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        fontWeight: "bold",
    }
});