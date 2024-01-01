import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/core/build/standalone'
import DateService from '../../Services/DateService'
import CounterService from '../../Services/CounterService'
import Post from '../../Models/Post'
import State from '../../Models/State'
import States from '../../../contracts/Enum/states'
import StorePostValidator from '../../Validators/StorePostValidator'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Topic from '../../Models/Topic'

@inject()
export default class PostsController {
  private counter = CounterService
  constructor(private dateService: DateService) {}

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const post = await Post.findOrFail(id)
    return response.json(post)
  }

  public async store({ request, response }: HttpContextContract) {
    let thumbnail
    // fake user
    const USER_ID = 5
    // On valide les datas... =>
    // Au passage je desctructure et retire topicsId du payload.
    const { topicsId, ...payload } = await request.validate(StorePostValidator)
    // ...=> si c'est ok on arrive ici
    console.log(payload)

    // Je convertis l'avatar au format Attachment pour l'enregistrer dans la table au format Json
    // Voir https://github.com/adonisjs/attachment-lite?tab=readme-ov-file
    //Voir aussi https://github.com/ndianabasi/adonis-responsive-attachment pour enregistrer des images responsive
    if (payload.thumbnail) {
      thumbnail = Attachment.fromFile(payload.thumbnail)
    }

    // Je vérifie que les topics existe bien en base
    const topics = await Topic.findMany(topicsId)

    // J'utilise les ids des topics récupérer depuis la base
    const topicsIdFromBase = topics.map((topic) => topic.id)

    // Je crée le post
    const post = await Post.create({ ...payload, thumbnail, userId: USER_ID })

    // Je récupère la relation many to many topics et j'associe la le post aux topics
    // "attach" est une méthode exclusive aux relation MtoM
    post.related('topics').attach(topicsIdFromBase)

    const serialisedPost = post.serialize({
      fields: { omit: ['created_at', 'updated_at'] },
      relations: { thumbnail: { fields: ['url'] } },
    })

    response.json(serialisedPost)
  }

  public async update({ params }: HttpContextContract) {
    // Injection du service via l'injection de dépendance
    const date = this.dateService.toDateTime()
    // Singleton
    this.counter.increment()
    return `update post with id of ${params.id} at ${date}`
  }

  /**
   * Je veux récupérer tous les posts en fonction de leurs état.
   * Un post ne eu être lié qu'à un état
   *
   * Je veux aussi l'auteur du post avec son profile en ne sélectionnant que les champs necessaires
   */
  public async allPostsByState({ request, response }: HttpContextContract) {
    const stateId = request.param('id')

    const posts = await Post.query()
      .where('stateId', stateId)
      .preload('author', (authorQuery) => {
        authorQuery
          .preload('profile', (queryProfile) => queryProfile.select('biography'))
          .select('email', 'username')
      })

    response.json(posts)
  }

  /**
   * Par default on peu vouloir récupérer tous les post qui ont un certain état (comme public ou published par exemple)
   * Dans cette exemple je filtre si la relation existe et si elle répond à un certain critère
   * C'est seulement pour l'exmple car la relation state est obligatoire elle existe onc forcément
   */
  public async allPosts({ response }: HttpContextContract) {
    const posts = await Post.query()
      .whereHas('state', (stateQuery) => stateQuery.where('id', States.PUBLIC))
      .preload('author', (authorQuery) => {
        authorQuery
          .preload('profile', (queryProfile) => queryProfile.select('biography'))
          .select('email', 'username')
      })

    response.json(posts)
  }

  /**
   * Je peu aussi récupérer tous les post à partir de la table State en faisant une jointure
   */
  public async allPostsByStateV2({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const state = await State.query().where('id', id).preload('posts')

    return response.json(state)
  }

  /**
   * FILTRES CONDITIONNEL
   *
   * On veut filtrer par :
   * title  / description / body => string (pattern)
   * state, => relation MtoO
   * topics, => relation MtoM
   * auteur => relation MtoO
   */
  public async searchPosts({ request, response }: HttpContextContract) {
    const { pattern, stateId, authorId, topicsId, orderBy = 'asc_title' } = request.qs()
    const [key, direction] = orderBy.split('_')
    const topicsIdArray = topicsId.split(',')

    const posts = await Post.query()
      .if(pattern, (query) =>
        query
          .whereILike('title', `%${pattern}%`)
          .orWhereILike('description', `%${pattern}%`)
          .orWhereILike('body', `%${pattern}%`)
      )
      .if(stateId, (query) => query.where('stateId', stateId))
      .if(authorId, (query) => query.where('userId', authorId))
      .if(topicsId, (query) =>
        query.whereHas('topics', (topicsQuery) => {
          topicsQuery.whereIn('topics.id', topicsIdArray)
        })
      )
      .preload('topics')
      .preload('author')
      .preload('state')
      .orderBy(direction, key)
      .limit(10)

    return response.json(posts)
  }

  /**
   * FILTRE COMPLEXE
   *
   * Lorsque les filtres deviennent complexe (beacoup de filtre, objet, array) on peu passer par un json / objet global dans l'url
   * Au lieu d'avoir une sucession de qs : ?pattern=toto&topicsId=1,2&etc...
   * On peu englober le tout dans un objet : ?qs={pattern: 'toto, topicsId: [10,11]}
   * Il faudra alors parser l'objet sois avec un JSON.parse sois un decodeURI selon comment il a été encodé
   */

  public async searchPostsComplex({ request, response }: HttpContextContract) {
    const { qs } = request.qs()
    console.log(request)
    const { pattern, stateId, authorId, topicsId, orderBy = 'asc_title' } = JSON.parse(qs)
    const [key, direction] = orderBy?.split('_')

    const posts = await Post.query()
      .if(pattern, (query) =>
        query
          .whereILike('title', `%${pattern}%`)
          .orWhereILike('description', `%${pattern}%`)
          .orWhereILike('body', `%${pattern}%`)
      )
      .if(stateId, (query) => query.where('stateId', stateId))
      .if(authorId, (query) => query.where('userId', authorId))
      .if(topicsId, (query) =>
        query.whereHas('topics', (topicsQuery) => {
          topicsQuery.whereIn('topics.id', topicsId)
        })
      )
      .preload('topics')
      .preload('author')
      .preload('state')
      .orderBy(direction, key)
      .limit(10)

    return response.json(posts)
  }
  /**
   * PAGINATION
   */

  public async paginate({ request, response }: HttpContextContract) {
    const { page = 1, limit = 10 } = request.qs()

    // L'offset est calcué autimatiquement
    const posts = await Post.query().orderBy('title').paginate(page, limit)

    // Les liens vers les ressources sont générés par adonis mais sans la base url
    posts.baseUrl('/paginate')

    // Par default la convntion de nommage est en snake_case mais au format json elle est destiné au front
    // La bonne pratique est donc de passer en camelCase
    // Voir la doc pour l'appliquer globalement : https://docs.adonisjs.com/guides/database/pagination
    posts.namingStrategy = {
      paginationMetaKeys() {
        return {
          total: 'total',
          perPage: 'perPage',
          currentPage: 'currentPage',
          lastPage: 'lastPage',
          firstPage: 'firstPage',
          firstPageUrl: 'firstPageUrl',
          lastPageUrl: 'lastPageUrl',
          nextPageUrl: 'nextPageUrl',
          previousPageUrl: 'previousPageUrl',
        }
      },
    }

    return response.json(posts)
  }
}
