import { container } from "tsyringe"
import UsersService from "$services/users"
import PostsService from "$services/posts"


void(async () => {
  const usersService = container.resolve<UsersService>(UsersService.token)
  const postsService = container.resolve<PostsService>(PostsService.token)

  const users = await usersService.list()
  console.log(JSON.stringify(users, null, 2))

  const posts = await postsService.list()
  console.log(JSON.stringify(posts, null, 2))
})()
  .catch(console.error)
