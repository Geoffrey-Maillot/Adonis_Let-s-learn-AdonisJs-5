import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Topic from '../../Models/Topic'

export default class TopicsController {
  public async index({ response }: HttpContextContract) {
    //const topics = await Topic.all()
    //const topicFirst = await Topic.first()
    //const topicFind = await Topic.find(3)
    //const topicfindBy = await Topic.findBy('name', 'AdonisJs')
    //const topicsFind = await Topic.findMany([1, 5])
    //const topic = await Topic.findOrFail(10)
    //const topic = await Topic.findByOrFail('name', 'react')

    /**
     * Query Builder
     */

    //const topics = await Topic.query()
    // const topicsById = await Topic.query().where('id', 1).orWhere('id', 5)
    //const topicsById = await Topic.query().whereIn('id', [1, 5])
    //const topicsILike = await Topic.query().whereILike('name', '%script%')

    //const TopicsAndOperatorV1 = await Topic.query()
    //  .whereILike('name', '%script%')
    //  .whereIn('id', [1, 3, 5, 7])

    //const TopicsAndOperatorV2 = await Topic.query()
    //  .whereILike('name', '%script%')
    //  .where((query) => query.where('id', 5).orWhere('id', 7))

    const topicsByDate = await Topic.query().where('created_at', '>=', '01-12-2023')

    return response.json([{ topicsByDate }])
  }

  public async create({}: HttpContextContract) {}

  public async store({ request }: HttpContextContract) {
    const data = request.only(['name', 'slug', 'description'])

    // Créer la data. Lance une erreur si la data existe
    const topic = await Topic.create(data)

    // Enregistre plusieurs entrée à la suite. Lance une erreur si une data existe
    const topics = await Topic.createMany([data])

    // Recherche et retourne la data si elle existe. Sinon la crée
    // Ne lance donc pas d'erreur
    // Le premier paramètre sont le ou les champs à chercher
    const topic2 = await Topic.firstOrCreate({ name: 'AdonisJs' }, data)

    // Recherche et met à jour et retourne la data si elle existe. Sinon la crée
    // Ne lance donc pas d'erreur
    // Le premier paramètre sont le ou les champs à chercher
    const topic3 = await Topic.updateOrCreate({ name: 'AdonisJs' }, data)

    // Recherche et met à jour et retourne la data si elle existe. Sinon la crée
    // Ne lance donc pas d'erreur
    // Cette fois si la recherche se fait en fournissant le nom de la colonne
    const topic4 = await Topic.updateOrCreateMany('name', [data])

    return topic2
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
