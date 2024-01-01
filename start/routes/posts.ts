import Route from '@ioc:Adonis/Core/Route'

Route.where('id', Route.matchers.number())

Route.group(() => {
  Route.get('/', 'postsController.index').as('.getAll')
  Route.get('/:id', 'postsController.show').as('.getById')
  Route.post('/:id', 'postsController.store').as('.store')
  Route.put('/:id', 'postsController.update').as('update')
  Route.delete('/:id', 'postsController.destroy').as('destroy')

  Route.get('/label/:topic?', ({ params }) => {
    return params.topic ? `get post => label with id of ${params.topic}` : 'Get all topic'
  })
    .where('topic', Route.matchers.slug())
    .as('getTopic')
})

  .prefix('/posts')
  .as('posts')
  .middleware('auth:admin')

//ADMIN
Route.group(() => {
  Route.get('/', 'postsController.index').as('.getAll')
  Route.get('/:id', 'postsController.show').as('.getById')
  Route.post('/', 'postsController.store').as('.store')
  Route.put('/:id', 'postsController.update').as('update')
  Route.delete('/:id', 'postsController.destroy').as('destroy')

  Route.get('/label/:topic?', ({ params }) => {
    return params.topic ? `get post => label with id of ${params.topic}` : 'Get all topic'
  })
    .where('topic', Route.matchers.slug())
    .as('getTopic')
})
  .prefix('/posts')
  .prefix('admin')
  .as('admin.posts')
  .namespace('App/Controllers/Http/admin')
  .middleware('auth:admin')
