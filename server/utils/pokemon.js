import { ofetch } from "ofetch";
import { EnvHttpProxyAgent } from "undici";
import axios from "axios";

// NOTE: Warning: EnvHttpProxyAgent is experimental, expect them to change at any time
// See https://undici.nodejs.org/#/docs/api/EnvHttpProxyAgent.md
const envHttpProxyAgent = new EnvHttpProxyAgent();

/** ポケモンの取得 */
export const findPokemon = async (name) => {
  const pokemon = await ofetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    dispatcher: envHttpProxyAgent,
  });
  return pokemon;
};

/** ポケモン一覧の取得 */
export const getPokemonList = async () => {
  console.log("getPokemonList at utils/pokemon.js")
  const offset = 0;
  const limit = 10;
  const pokemons = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`, {
    // dispatcher: envHttpProxyAgent,
    proxy: {
      protocol: "http",
      host: "g3.konicaminolta.jp",
      port: 8080,
    }
  });

  console.log("getPokemonList at express server")
  console.log("getPokemonList" + pokemons)
  return pokemons ?? [];
}