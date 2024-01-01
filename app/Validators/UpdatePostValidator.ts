import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommonValidator from './CommonValidator'

export default class UpdatePostValidator extends CommonValidator {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public schema = schema.create({
    stateId: schema.number.optional([rules.exists({ table: 'states', column: 'id' })]),
    topicsId: schema.array().members(schema.string([rules.regex(/\d+/)])),
    title: schema.string.optional([
      rules.trim(),
      rules.minLength(3),
      rules.maxLength(100),
      rules.unique({ table: 'posts', column: 'title' }),
    ]),
    slug: schema.string.optional([
      rules.trim(),
      rules.minLength(3),
      rules.maxLength(150),
      rules.unique({ table: 'posts', column: 'slug' }),
    ]),
    description: schema.string.nullableAndOptional([
      rules.trim(),
      rules.minLength(3),
      rules.maxLength(250),
    ]),
    body: schema.string.nullableAndOptional([rules.trim(), rules.minLength(3)]),
    thumbnail: schema.file.nullableAndOptional({ size: '2mb', extnames: ['jpg', 'png'] }),
  })
}
