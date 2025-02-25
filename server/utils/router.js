import { Router } from "express";
import { findTrainers, findTrainer, upsertTrainer, deleteTrainer } from "~/server/utils/trainer";
import { findPokemon, getPokemonList } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    // 期待するレスポンスボディに変更する
    const trainerList = trainers.map(({ Key }) => Key.replace(/\.json$/, ""));
    console.log("mapping response at express server")
    console.log(trainerList)
    res.send(trainerList);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {
  console.log("POST /trainer に到達しました")
  try {
    // リクエストボディにトレーナー名が含まれていなければ400を返す
    if (req.body.name === undefined)
      return res.sendStatus(400);
    
    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
// パスパラメータで受けたトレーナー名を使ってfindTrainerを実行
router.get("/trainer/:trainerName", async (req, res, next) => {
  console.log("router /trainer/:trainerName")
  try {
    const { trainerName } = req.params;
    console.log(trainerName)
    const trainer = await findTrainer(trainerName);
    res.send(trainer);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
router.post("/trainer/:trainerName/delete", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // await 忘れると結果を待たずにresultの中身見ようとしてエラーになるので注意
    const result = await deleteTrainer(trainerName);
    res.status(result["$metadata"].httpStatusCode).send(result);
  }catch (err) {
    next(err);
  }
});

/** ポケモンの一覧取得 */
// expressからPokeAPIの確認で一覧取得APIを自前で実装
// やはりうまくいかなかった
// 原因不明
router.get("/pokemonList", async (_req, res, next) => {
  try {
    const pokemons = await getPokemonList();
    console.log("getPokemonListまでは成功")
    // 期待するレスポンスボディに変更する
    const pokemonList = pokemons.map(({ Key }) => Key.replace(/\.json$/, ""));
    console.log("mapping response at express server")
    console.log("ポケモンリスト" + pokemonList)
    res.send(pokemonList);
  } catch (err) {
    next(err);
  }
});


/** ポケモンの追加 */
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // リクエストボディにポケモン名が含まれていなければ400を返す
    if (req.body.name === undefined)
      return res.sendStatus(400);

    const pokemon = await findPokemon(req.body.name);
    const result = await upsertTrainer(trainerName, { pokemons: [pokemon] });
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの追加 */
// ポケモン情報はフロントで取得しておいてreq.body経由で受け取る
// トレーナー情報はパスパラメータから取得
router.post("/trainer/:trainerName/pokemon/frontget", async (req, res, next) => {
  try {
    console.log("POST /trainer/:trainerName/pokemon/frontget に到達しました")
    const { trainerName } = req.params;
    const trainer = await findTrainer(trainerName);


    // リクエストボディにポケモン情報が含まれていなければ400を返す
    if (!("pokemon" in req.body))
      return res.sendStatus(400);

    let pokemon = req.body.pokemon;

    // トレーナーのポケモン情報につかまえたポケモンを追加
    // idは連番になるように生成
    trainer.pokemons.push({
      id: (trainer.pokemons[trainer.pokemons.length - 1]?.id ?? 0) + 1,
      nickname: "",
      order: pokemon.order,
      name: pokemon.name,
      sprites: pokemon.img,
    });

    // トレーナー情報を更新
    const result = await upsertTrainer(trainerName, trainer);
    console.log("upsertTrainer result: " + result)
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの削除 */
router.post("/trainer/:trainerName/pokemon/delete", async (req, res, next) => {
  try {
    console.log("POST /trainer/:trainerName/pokemon/frontget に到達しました")
    const { trainerName } = req.params;
    const trainer = await findTrainer(trainerName);

    // リクエストボディにポケモン情報が含まれていなければ400を返す
    if (!("pokemon" in req.body))
      return res.sendStatus(400);

    // リクエストボディからポケモン情報を取得
    let pokemon = req.body.pokemon;

    // トレーナーのポケモン情報から選択したポケモンを削除
    trainer.pokemons = trainer.pokemons.filter(p => p.name !== pokemon.name);

    // トレーナー情報を更新
    const result = await upsertTrainer(trainerName, trainer);
    console.log("upsertTrainer result: " + result)
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

export default router;
