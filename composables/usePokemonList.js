import { useFetch, useRuntimeConfig } from "#app";

export default () => {
  const config = useRuntimeConfig();
  
  const response = useFetch("/api/pokemonList", {
    default: () => [],
    server: false,
    baseURL: config.public.backendOrigin,
  });

  // expressサーバーから取得したresponseをフロント側のログに表示する
  console.log("respones from express server at usePokemonList.js")
  console.log(response)

  return response;
};
