import DrizzleDB, { DrizzleWithSchemas } from "$components/DrizzleDB";
import { container, inject, autoInjectable } from "tsyringe"
import Postgres from "postgres"

@autoInjectable()
export default class BaseSchemaService {
  drizzle: DrizzleWithSchemas
  sql: Postgres.Sql

  constructor(
    @inject(DrizzleDB.token)
    drizzleDB: DrizzleDB
  ) {
    this.sql = drizzleDB.sql
    this.drizzle = drizzleDB.drizzle
  }

  static token = Symbol("BaseSchemaService")
}

container.register(BaseSchemaService.token, BaseSchemaService)
