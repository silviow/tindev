import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import io from 'socket.io-client';
import logo from '../../assets/logo.png';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import itsamatch from '../../assets/itsamatch.png';
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
    const [ matchDev, setMatchDev ] = useState(null);

    useEffect(() => {
        let didCancel = false;

        (async function loadUsers() {
            const response = await api.get("/devs", {
                headers: {
                    user: id,
                }
            });

            if (!didCancel) setUsers(response.data);
        })();

        return () => didCancel = true;
    }, [id]);

    useEffect(() => {
        let didCancel = false;

        const socket = io("http://localhost:3333", {
            query: {
                user: id
            }
        });

        socket.on("match", dev => {
            if (!didCancel) setMatchDev(dev);
        })

        return () => didCancel = true;
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

            { matchDev && (
                <View style={styles.matchContainer}>
                    <Image style={styles.itsMatchImg} source={itsamatch} />
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio ? matchDev.bio : "No description provided."}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.matchClose}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            ) }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 1,
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        justifyContent: "space-between",
    },
    cardsContainer: {
        flex: 1,
        maxHeight: 500,
        alignSelf: "stretch",
        justifyContent: "center",
    },
    card: {
        margin: 30,
        borderWidth: 1,
        borderRadius: 20,
        overflow: "hidden",
        borderColor: "#ddd",
        ...StyleSheet.absoluteFillObject,
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
        color: "#333",
        fontWeight: "bold",
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
        zIndex: 1,
        marginBottom: 30,
        flexDirection: "row",
    },
    button: {
        width: 60,
        height: 60,
        elevation: 1.5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 1,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        alignItems: "center",
        marginHorizontal: 15,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    empty: {
        fontSize: 16,
        color: "#999",
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        paddingHorizontal: 20,
    },
    matchContainer: {
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center",
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.8)",
    },
    itsMatchImg: {
        height: 60,
        resizeMode: "contain",
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderWidth: 5,
        borderRadius: 80,
        marginVertical: 30,
        borderColor: "#fff",
    },
    matchName: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
    },
    matchBio: {
        fontSize: 16,
        marginTop: 10,
        lineHeight: 20,
        textAlign: "center",
        paddingHorizontal: 30,
        color: "rgba(255,255,255,0.85)",
    },
    matchClose: {
        fontSize: 18,
        marginTop: 25,
        fontWeight: "bold",
        textAlign: "center",
        color: "rgba(255,255,255,0.85)",
    }
});