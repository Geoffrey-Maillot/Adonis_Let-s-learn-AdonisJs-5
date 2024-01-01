import Route from '@ioc:Adonis/Core/Route'

Route.where('id', Route.matchers.number())

Route.group(() => {
  Route.get('/', () => {
    return `get all post`
  }).as('.getAll')

  Route.get('/:id', ({ params }) => {
    return `get post with id of ${params.id}`
  }).as('.getById')

  Route.post('/:id', ({ params }) => {
    return `get post with id of ${params.id}`
  }).as('.create')
  Route.put('/:id', ({ params }) => {
    return `update post with id of ${params.id}`
  }).as('mutate')
  Route.delete('/:id', ({ params }) => {
    return `delete post with id of ${params.id}`
  }).as('delete')

  Route.get('/label/:topic?', ({ params }) => {
    return params.topic ? `get post => label with id of ${params.topic}` : 'Get all topic'
  })
    .where('topic', Route.matchers.slug())
    .as('getTopic')
})

  .prefix('/posts')
  .as('posts')
