declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_USER: string,
      POSTGRES_PASSWORD: string,
      POSTGRES_DB: string
    }
  }
}

export type Env = {
  POSTGRES_HOST: string
  POSTGRES_PORT: number,
  POSTGRES_USER: string,
  POSTGRES_PASSWORD: string,
  POSTGRES_DB: string,
  DB_MIGRATIONS_PATH: string
}
