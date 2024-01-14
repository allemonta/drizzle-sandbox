import BaseSchemaService from "./base";
import * as usersSchemas from "$schemas/users"
import * as postsSchemas from "$schemas/posts"
import { eq, inArray } from "drizzle-orm";
import { container, delay, inject, injectable } from "tsyringe";
import PostsService from "$services/posts";
import DrizzleDB from "$components/DrizzleDB";
import { RelationalQueryBuilder } from "drizzle-orm/pg-core/query-builders/query";

type UserWithPosts = usersSchemas.User & {
  posts: postsSchemas.Post[]
}

@injectable()
export default class UsersService extends BaseSchemaService {
  usersDB: typeof DrizzleDB.prototype.drizzle.query.users

  constructor(
    @inject(DrizzleDB.token)
    drizzleDB: DrizzleDB,
    @inject(delay(() => PostsService))
    private postsService: PostsService
  ) {
    super(drizzleDB)
    this.usersDB = drizzleDB.drizzle.query.users
  }

  _injectPosts = async(users: usersSchemas.User[]): Promise<UserWithPosts[]> => {
    if (users.length === 0) {
      return []
    }

    const postIds = await this.postsService.postsDB.findMany({
      columns: {
        id: true
      },
      where: inArray(postsSchemas.posts.userId, users.map(user => user.id))
    })

    const posts = await this.postsService.mGet(
      postIds.map(post => post.id)
    )

    return users.map((user) => ({
      ...user,
      posts: posts.filter(post => post.userId === user.id)
    }))
  }

  list = async (): Promise<UserWithPosts[]> => {
    const users = await this.drizzle.query.users.findMany()
    return this._injectPosts(users)
  }

  get = async (id: number): Promise<UserWithPosts | null> => {
    const user = await this.drizzle.query.users.findFirst({
      where: eq(usersSchemas.users.id, id)
    })

    if (!user) {
      return null
    }

    const [userWithPosts] = await this._injectPosts([user])
    return userWithPosts
  }

  mGet = async (ids: number[]): Promise<usersSchemas.User[]> => {
    return this.drizzle.query.users.findMany({
      where: inArray(usersSchemas.users.id, ids)
    })
  }

  static token = Symbol("UsersService")
}

container.register(UsersService.token, UsersService)
