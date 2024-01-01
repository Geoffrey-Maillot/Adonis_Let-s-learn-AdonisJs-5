import { schema, CustomMessages, validator } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CommonValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = validator.reporters.api

  public schema = schema.create({})

  public messages: CustomMessages = {
    '*': (field, rule) => {
      return `La validation ${rule} a échoué  sur le champ ${field}`
    },
    'minLength': '{{field}} doit avoir au moins {{options.minLength}} charactère',
    'maxLength': '{{field}} doit avoir maximum {{options.minLength}} charactère',
    'unique': "{{field}} n'est pas disponible",
    'required': 'Le champ {{field}} est obligatoire',
    'file.size': 'La taille maximum est de {{options.size}}',
    'file.extname': 'Les extention autorisées sont {{options.extnames}}',
  }
}
