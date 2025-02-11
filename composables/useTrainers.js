import { useFetch, useRuntimeConfig } from "#app";

// todo: 無理やりresponse.dataを変更するのではなく、デモデータを返すようにサーバーを更新するべき
const demoTrainers = 
  ["コジロウ", "サトシ", "ムサシ", "レッド"];

export default (demoData) => {
  const config = useRuntimeConfig();
  
  const response = useFetch("/api/trainers", {
    default: () => [],
    server: false,
    baseURL: config.public.backendOrigin,
  });

  // expressサーバーから取得したresponseをフロント側のログに表示する
  console.log("respones from express server")
  console.log(response)

  // デモモードの場合はデモデータを返す
  console.log(demoData)
  if (demoData) {
    console.log("respones demo data")
    response.data = demoTrainers;
    console.log(response)
  }

  return response;
};
