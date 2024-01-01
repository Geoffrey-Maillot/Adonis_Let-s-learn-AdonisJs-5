import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle({}: HttpContextContract, next: () => Promise<void>, guards: string[]) {
    console.log(guards)
    await next()
  }
}
