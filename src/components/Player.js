import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { Audio } from "expo-av";

export default function Player({ musica }) {

    const [sound, setSound] = useState(null);
    const [tocando, setTocando] = useState(false);
    const [posicao, setPosicao] = useState(0);
    const [duracao, setDuracao] = useState(0);

    useEffect(() => {

        async function carregarMusica() {

            if (!musica) {
                return;
            }

            if (sound) {
                await sound.unloadAsync();
            }

            const novoSom = new Audio.Sound();

            await novoSom.loadAsync(musica.arquivo);

            novoSom.setOnPlaybackStatusUpdate((status) => {

                if (!status.isLoaded) {
                    return;
                }

                setPosicao(status.positionMillis || 0);
                setDuracao(status.durationMillis || 0);
                setTocando(status.isPlaying);

                if (status.didJustFinish) {
                    setTocando(false);
                    setPosicao(0);
                }
            });

            setSound(novoSom);
        }

        carregarMusica();

        return () => {

            if (sound) {
                sound.stopAsync();
                sound.unloadAsync();
            }
        };

    }, [musica]);

    async function tocarPausar() {

        if (!sound) {
            return;
        }

        const status = await sound.getStatusAsync();

        if (status.isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
    }

    async function parar() {

        if (!sound) {
            return;
        }

        await sound.stopAsync();
        await sound.setPositionAsync(0);

        setTocando(false);
        setPosicao(0);
    }

    function formatarTempo(valor) {

        const segundos = Math.floor(valor / 1000);

        const minutos = Math.floor(segundos / 60);

        const segundosRestantes = segundos % 60;

        return `${String(minutos).padStart(2, "0")}:${String(
            segundosRestantes
        ).padStart(2, "0")}`;
    }

    if (!musica) {
        return (
            <View style={styles.vazio}>
                <Text>
                    Selecione uma música para reproduzir
                </Text>
            </View>
        );
    }

    const progresso =
        duracao > 0 ? (posicao / duracao) * 100 : 0;

    return (
        <View style={styles.container}>

            <Text style={styles.nome}>
                🎵 {musica.nome}
            </Text>

            <View style={styles.barraFundo}>

                <View
                    style={[
                        styles.barra,
                        { width: `${progresso}%` }
                    ]}
                />

            </View>

            <View style={styles.tempos}>

                <Text>
                    {formatarTempo(posicao)}
                </Text>

                <Text>
                    {formatarTempo(duracao)}
                </Text>

            </View>

            <View style={styles.botoes}>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={tocarPausar}
                >
                    <Text style={styles.textoBotao}>
                        {tocando ? "⏸️ Pausar" : "▶️ Tocar"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoParar}
                    onPress={parar}
                >
                    <Text style={styles.textoBotao}>
                        ⏹️ Parar
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        margin: 15,
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        elevation: 4
    },

    vazio: {
        margin: 15,
        padding: 20,
        alignItems: "center"
    },

    nome: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15
    },

    barraFundo: {
        height: 8,
        backgroundColor: "#DDDDDD",
        borderRadius: 10,
        overflow: "hidden"
    },

    barra: {
        height: 8,
        backgroundColor: "#7B2CBF"
    },

    tempos: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5
    },

    botoes: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginTop: 15
    },

    botao: {
        backgroundColor: "#7B2CBF",
        padding: 12,
        borderRadius: 10
    },

    botaoParar: {
        backgroundColor: "#555555",
        padding: 12,
        borderRadius: 10
    },

    textoBotao: {
        color: "#FFFFFF",
        fontWeight: "bold"
    }
});