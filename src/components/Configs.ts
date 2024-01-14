import { Env } from "$types/Env"
import { join } from "path"
import { injectable, container } from "tsyringe"

@injectable()
export default class Configs {
  env: Env

  constructor() {
    const {
      POSTGRES_HOST = "localhost",
      POSTGRES_PORT = "5432",
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB
    } = process.env

    this.env = {
      POSTGRES_DB,
      POSTGRES_HOST,
      POSTGRES_PASSWORD,
      POSTGRES_PORT: +POSTGRES_PORT,
      POSTGRES_USER,
      DB_MIGRATIONS_PATH: join(__dirname, "../../migrations")
    }
  }


  static token = Symbol("Configs")
}

container.register(Configs.token, Configs)
