# TodoApp

Spring Boot 4.1.1 / Java 21 / PostgreSQL / MyBatis / Flyway と Next.js + TypeScript で構成した Todo CRUD アプリです。

## 構成

- Backend: Spring Boot 4.1.1, Java 21, Spring Web
- Persistence: MyBatis Spring Boot Starter 4.0.0
- Database: PostgreSQL（Docker は使用しません）
- Migration: Flyway (`src/main/resources/db/migration`)
- Frontend: Next.js 16.3.3, React 19.2, TypeScript
- Todo モデル: Java `record`
- External SQL utility: 添付の `erd.mybatis.externalsql` / `erd.mybatis.model` を追加

Todo の `TodoRepository` は External SQL ファイル方式には変更しておらず、MyBatis のアノテーションに SQL を記述しています。

## 1. PostgreSQL の準備

ローカルまたは別サーバーの PostgreSQL を用意してください。初期ユーザーと初期パスワードは次のとおりです。

```text
user: postgres
password: postgres
```

`postgres` ユーザーで PostgreSQL に接続し、アプリ用 DB を作成します。

```sql
CREATE DATABASE todo_app;
```

データベース接続情報はプロジェクトルートの `database.properties` に定義します。初期値は次のとおりです。

```properties
database.url=jdbc:postgresql://localhost:5432/todo_app
database.username=postgres
database.password=postgres
```

Spring Boot と Gradle の Flyway タスクは、この `database.properties` の値を利用します。Spring Boot の接続情報だけを一時的に上書きしたい場合は、従来どおり `DB_URL`、`DB_USERNAME`、`DB_PASSWORD` の環境変数も利用できます。

## 2. Flyway の実行

マイグレーション SQL は次の場所にあります。

```text
src/main/resources/db/migration/V1__create_todo_table.sql
```

Flyway は Gradle から実行します。接続先は `database.properties` から読み込まれるため、コマンドに URL・ユーザー・パスワードを指定する必要はありません。

マイグレーションの実行:

```bash
./gradlew flywayMigrate
```

適用状況の確認:

```bash
./gradlew flywayInfo
```

マイグレーションの検証:

```bash
./gradlew flywayValidate
```

また、`spring.flyway.enabled=true` のため、バックエンド起動時にも未適用のマイグレーションが自動実行されます。

```bash
./gradlew bootRun
```

## 3. Backend の起動

Java 21 を利用してください。

```bash
./gradlew bootRun
```

API:

```text
http://localhost:8080/api/todo
```

利用する環境変数:

- `DB_URL`（任意。`database.properties` の URL を上書き）
- `DB_USERNAME`（任意。`database.properties` のユーザー名を上書き）
- `DB_PASSWORD`（任意。`database.properties` のパスワードを上書き）
- `CORS_ALLOWED_ORIGIN`

## 4. Frontend の起動

```bash
cd frontend
npm install
npm run dev
```

ブラウザ:

```text
http://localhost:3000
```

API URL を変更する場合は `frontend/.env.local` に次を設定します。

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```


## MyBatis の SQL ファイル

`TodoRepository` の SQL は `ExternalSqlProvider` 経由で次のディレクトリから読み込みます。

```text
src/main/resources/sql/com/example/demo/repository/TodoRepository/
├── findAll.sql
├── findById.sql
├── insert.sql
├── update.sql
└── deleteById.sql
```

Mapper のメソッド名と SQL ファイル名を対応させています。SELECT、および PostgreSQL の `RETURNING` を使う INSERT/UPDATE は `@SelectProvider(ExternalSqlProvider.class)`、DELETE は `@DeleteProvider(ExternalSqlProvider.class)` を使用します。

