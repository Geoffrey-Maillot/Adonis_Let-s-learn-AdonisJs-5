import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  require('./posts')
  require('./serie')
})
  .prefix('v2')
  .as('v2')
