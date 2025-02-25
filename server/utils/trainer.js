import {
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { ProxyAgent } from "proxy-agent";

// TODO：vueではimportしてたけどjsでは必要ないのかな。あとどこのconfig読みに行っている？
const config = useRuntimeConfig();

const agent = new ProxyAgent();

const s3Client = new S3Client({
  region: config.region,
  requestHandler: new NodeHttpHandler({ httpAgent: agent, httpsAgent: agent }),
});

/** トレーナーの一覧の取得 */
export const findTrainers = async () => {
  const objects = await s3Client.send(
    new ListObjectsCommand({ Bucket: config.bucketName }),
  );
  return objects.Contents ?? [];
};

/** トレーナーの取得 */
// S3 クライアント処理の実装
// 指定のトレーナー名.jsonデータを取得する
export const findTrainer = async (name) => {
  const object = await s3Client.send(
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: `${name}.json`,
    }),
  );
  const trainer = JSON.parse(await object.Body.transformToString());
  return trainer;
};

/** トレーナーの追加更新 */
// サーバーエンドからS3にアクセスする
// S3アクセスは問題ないのに、サーバーエンド→PokeAPI だとうまくいかないのはなぜだろう
export const upsertTrainer = async (name, trainer) => {
  console.log("Execute upsertTrainer")
  console.log("Runtime Config BucketName: " + config.bucketName)
  console.log("Request Body Name: " + name)
  console.log("Request Body: " + trainer)

  // Question: BodyのJson.stringifyの中身がよくわからない。pokemonsは[]なのになぜ中身がはいるのか
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName, // Question：nuxt.config.jsだとしたらbucketName: ""だけど、どこでaws configのほうを見に行っている？
      Key: `${name}.json`,
      Body: JSON.stringify({ name: "", pokemons: [], ...trainer }),
    }),
  );
  return result;
};

/** トレーナーの削除 */
export const deleteTrainer = async (name) => {
  console.log("Execute deleteTrainer: " + name)

  try {
    const result = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: `${name}.json`,
      }),
    );

    // 結果のメタデータを確認
    console.log("DeleteObjectCommand result:", result);
    console.log("HTTP Status Code:", result.$metadata.httpStatusCode);
    console.log("Request ID:", result.$metadata.requestId);

    return result;
  } catch (error) {
    console.error("Error deleting trainer:", error);
    throw error;
  }
}
