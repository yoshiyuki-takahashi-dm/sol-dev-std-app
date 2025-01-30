import {
  ListObjectsCommand,
  PutObjectCommand,
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
// TODO: トレーナーを取得する S3 クライアント処理の実装

/** トレーナーの追加更新 */
// サーバーエンドからS3にアクセスする
// S3アクセスは問題ないのに、サーバーエンド→PokeAPI だとうまくいかないのはなぜだろう
export const upsertTrainer = async (name, trainer) => {
  console.log("Execute upsertTrainer")
  console.log("Runtime Config BucketName: " + config.bucketName)
  console.log("Request Body Name: " + name)
  console.log("Request Body: " + trainer)

  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName, // nuxt.config.jsだとしたらbucketName: ""だけど、どこでaws configのほうを見に行っている？
      Key: `${name}.json`,
      Body: JSON.stringify({ name: "", pokemons: [], ...trainer }),
    }),
  );
  return result;
};

/** トレーナーの削除 */
// TODO: トレーナーを削除する S3 クライアント処理の実装
