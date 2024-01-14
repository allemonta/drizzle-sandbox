import BaseSchemaService from "./base";
import * as postsSchemas from "$schemas/posts"
import * as usersSchemas from "$schemas/users"
import { eq, inArray } from "drizzle-orm";
import { container, injectable, inject, delay } from "tsyringe";
import UsersService from "./users";
import DrizzleDB from "$components/DrizzleDB";

type PostWithUser = postsSchemas.Post & {
  user: usersSchemas.User
}

@injectable()
export default class PostsService extends BaseSchemaService {
  postsDB: typeof DrizzleDB.prototype.drizzle.query.posts

  constructor(
    @inject(DrizzleDB.token)
    drizzleDB: DrizzleDB,
    @inject(delay(() => UsersService))
    private usersService: UsersService
  ) {
    super(drizzleDB)
    this.postsDB = drizzleDB.drizzle.query.posts
  }

  _injectUsers = async(posts: postsSchemas.Post[]): Promise<PostWithUser[]> => {
    if (posts.length === 0) {
      return []
    }

    const users = await this.usersService.mGet(
      posts.map(post => post.userId)
    )

    return posts.map((post) => ({
      ...post,
      user: users.find(user => user.id === post.userId)!
    }))
  }

  list = async (): Promise<PostWithUser[]> => {
    const posts = await this.drizzle.query.posts.findMany()
    return this._injectUsers(posts)
  }

  get = async (id: number): Promise<PostWithUser | null> => {
    const post = await this.drizzle.query.posts.findFirst({
      where: eq(postsSchemas.posts.id, id)
    })

    if (!post) {
      return null
    }

    const [postWithUser] = await this._injectUsers([post])
    return postWithUser
  }

  mGet = async (ids: number[]): Promise<postsSchemas.Post[]> => {
    return this.drizzle.query.posts.findMany({
      where: inArray(postsSchemas.posts.id, ids)
    })
  }

  static token = Symbol("PostsService")
}

container.register(PostsService.token, PostsService)
