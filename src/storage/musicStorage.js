import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_MUSICAS = "@minha_playlist";

export async function buscarMusicas() {
    try {
        const dados = await AsyncStorage.getItem(CHAVE_MUSICAS);

        if (dados) {
            return JSON.parse(dados);
        }

        return [];
    } catch (error) {
        console.log("Erro ao buscar músicas:", error);
        return [];
    }
}

export async function salvarMusicas(musicas) {
    try {
        await AsyncStorage.setItem(
            CHAVE_MUSICAS,
            JSON.stringify(musicas)
        );
    } catch (error) {
        console.log("Erro ao salvar músicas:", error);
    }
}