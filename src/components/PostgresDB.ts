import Postgres from "postgres"
import { injectable, container, inject } from "tsyringe"
import Configs from "$components/Configs"

@injectable()
export default class PostgresDB {
  sql: Postgres.Sql

  constructor(
    @inject(Configs.token)
    configs: Configs
  ) {
    this.sql = Postgres({
      host: configs.env.POSTGRES_HOST,
      port: configs.env.POSTGRES_PORT,
      database: configs.env.POSTGRES_DB,
      username: configs.env.POSTGRES_USER,
      password: configs.env.POSTGRES_PASSWORD
    })
  }


  static token = Symbol("PostgresDB")
}

container.register(PostgresDB.token, PostgresDB)
