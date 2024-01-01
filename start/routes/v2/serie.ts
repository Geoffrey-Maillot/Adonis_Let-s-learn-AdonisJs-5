import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', () => {
    return 'Get all series'
  }).as('.showAll')

  Route.get('/:id', ({ params }) => {
    return `get serie of ${params.id}`
  }).as('show')
  Route.post('/:id', ({ params }) => {
    return `post serie of ${params.id}`
  }).as('create')
  Route.put('/:id', ({ params }) => {
    return `update serie of ${params.id}`
  }).as('update')
  Route.delete('/:id', ({ params }) => {
    return `delete serie of ${params.id}`
  }).as('delete')
})
  .prefix('/serie')
  .as('serie')
