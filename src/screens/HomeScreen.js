import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    Alert
} from "react-native";

import MusicalItem from "../components/MusicaItem";
import Player from "../components/Player";

import {
    buscarMusicas,
    salvarMusicas
} from "../storage/musicStorage";

const musicasIniciais = [
    {
        id: "1",
        nome: "Música 01",
        arquivo: require("../../assets/audio/musica1.mp3")
    },
    {
        id: "2",
        nome: "Música 02",
        arquivo: require("../../assets/audio/musica2.mp3")
    },
    {
        id: "3",
        nome: "Música 03",
        arquivo: require("../../assets/audio/musica3.mp3")
    },
    {
        id: "4",
        nome: "Música 04",
        arquivo: require("../../assets/audio/musica4.mp3")
    },
    {
        id: "5",
        nome: "Música 05",
        arquivo: require("../../assets/audio/musica5.mp3")
    }
];

export default function HomeScreen() {

    const [musicas, setMusicas] = useState([]);
    const [musicaSelecionada, setMusicaSelecionada] = useState(null);

    useEffect(() => {

        carregarMusicas();

        return () => {
            setMusicaSelecionada(null);
        };

    }, []);

    async function carregarMusicas() {

        const salvas = await buscarMusicas();

        if (salvas.length > 0) {

            const lista = salvas.map((musica) => {

                const original = musicasIniciais.find(
                    (item) => item.id === musica.id
                );

                return {
                    ...musica,
                    arquivo: original?.arquivo
                };
            });

            setMusicas(lista);

        } else {

            setMusicas(musicasIniciais);

            const dadosParaSalvar =
                musicasIniciais.map((musica) => ({
                    id: musica.id,
                    nome: musica.nome
                }));

            await salvarMusicas(dadosParaSalvar);
        }
    }

    async function excluirMusica(id) {

        Alert.alert(
            "Excluir música",
            "Deseja excluir esta música?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {

                        const novaLista =
                            musicas.filter(
                                (musica) =>
                                    musica.id !== id
                            );

                        setMusicas(novaLista);

                        const dados =
                            novaLista.map((musica) => ({
                                id: musica.id,
                                nome: musica.nome
                            }));

                        await salvarMusicas(dados);

                        if (
                            musicaSelecionada &&
                            musicaSelecionada.id === id
                        ) {
                            setMusicaSelecionada(null);
                        }
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>

            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
            />

            <Text style={styles.titulo}>
                Minha Playlist
            </Text>

            <Text style={styles.subtitulo}>
                Minhas músicas favoritas 🎵
            </Text>

            <Player
                musica={musicaSelecionada}
            />

            <FlatList
                data={musicas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (

                    <MusicalItem
                        musica={item}
                        selecionada={
                            musicaSelecionada?.id === item.id
                        }
                        onSelecionar={
                            setMusicaSelecionada
                        }
                        onExcluir={
                            excluirMusica
                        }
                    />

                )}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F7F0FF",
        paddingTop: 40
    },

    logo: {
        width: 80,
        height: 80,
        alignSelf: "center",
        resizeMode: "contain"
    },

    titulo: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color: "#7B2CBF"
    },

    subtitulo: {
        textAlign: "center",
        marginBottom: 10,
        color: "#555555"
    }
});