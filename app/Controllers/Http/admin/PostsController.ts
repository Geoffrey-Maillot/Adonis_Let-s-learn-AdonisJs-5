import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  public async index() {
    return `ADMIN: get all post`
  }

  public async create({}: HttpContextContract) {}

  public async store({ params }: HttpContextContract) {
    return `ADMIN: store post with id of ${params.id}`
  }

  public async show({ params }: HttpContextContract) {
    return `ADMIN: get post with id of ${params.id}`
  }

  public async edit({}: HttpContextContract) {}

  public async update({ params }: HttpContextContract) {
    return `ADMIN: update post with id of ${params.id}`
  }

  public async destroy({ params }: HttpContextContract) {
    return `ADMIN: delete post with id of ${params.id}`
  }
}
