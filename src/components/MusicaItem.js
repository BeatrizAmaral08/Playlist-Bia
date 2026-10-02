import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

export default function MusicalItem({
    musica,
    selecionada,
    onSelecionar,
    onExcluir
}) {
    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={styles.musica}
                onPress={() => onSelecionar(musica)}
            >
                <Text style={styles.nome}>
                    🎵 {musica.nome}
                </Text>

                <Text style={styles.acao}>
                    {selecionada ? "Selecionada" : "▶️ Tocar"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.excluir}
                onPress={() => onExcluir(musica.id)}
            >
                <Text style={styles.lixeira}>🗑️</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        marginHorizontal: 15,
        marginVertical: 5,
        padding: 15,
        borderRadius: 12,
        elevation: 3
    },

    musica: {
        flex: 1
    },

    nome: {
        fontSize: 17,
        fontWeight: "bold"
    },

    acao: {
        marginTop: 5,
        color: "#7B2CBF"
    },

    excluir: {
        padding: 10
    },

    lixeira: {
        fontSize: 20
    }
});