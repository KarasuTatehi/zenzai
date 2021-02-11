# zenzai

[oscillco](https://blog.k2sk.com/posts/oscillco-tutorial/)の派生DiscordBotです。
不安定になってしまったoscillcoをローカル環境にデプロイすることで、（ある程度）動作を安定化させます。

## インストールから起動まで (v1.0.0)

1.  zenzaiをクローン

    ```
    git clone https://github.com/KarasuTatehi/zenzai.git
    ```

2.  `be.env` の `DISCORD_BOT_TOKEN` に[Discord Developer Portal — My Applications](https://discord.com/developers/applications/)で作成したBotのトークンを代入

3. Dockerイメージをビルド・実行

    ```
    docker-compose up -d
    ```

## 変更点

- v1.0.0 - 構成の調整とDockerイメージ化
