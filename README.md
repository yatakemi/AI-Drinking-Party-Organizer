# 飲み会幹事 AI アシスタント

飲み会幹事に任命された時に、調整事項を入力することで面倒なお店選びを AI が実施してくれるサービス

## 利用している外部サービス

- Google Vertex AI API
- Google Place API(New)

## 動作に必要な環境変数

ローカル環境の場合は、.env ファイルを作成して以下を設定する。

- PLACE_API_KEY
  - Place API(New)が利用可能な API キー
- PROJECT_NAME
  - Google Cloud Project name

## 動作環境

- App Engine
  - 設定は[app.yaml](./app.yaml)
  - デプロイは`pnpm run deploy`を実行する
    - 環境変数として `env_variables.yaml`を作成してから deploy すること
      ```yaml
      env_variables:
        PLACE_API_KEY: xxxxxxxx
        PROJECT_NAME: xxxxxxxx
      ```

---

[AI Hackathon with Google Cloud](https://googlecloudjapanaihackathon.devpost.com/) 提出作品
