/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

import './routes/posts'
import './routes/v2'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/img/:id/*', ({ params }) => {
  return {
    id: params.id,
    pathraw: params['*'],
    path: params['*'].join('.'),
  }
})

Route.post('/topics', 'topicsController.store').as('topic.store')
Route.get('/topics', 'topicsController.index').as('topic.index')

Route.get('/posts/state/:id', 'postsController.allPostsByState')
Route.get('/allposts', 'postsController.allPosts')
Route.get('/state/:id', 'postsController.allPostsByStateV2')
Route.get('/searchposts', 'postsController.searchPosts')
Route.get('/searchpostscomplex', 'postsController.searchPostsComplex')
Route.get('/paginate', 'postsController.paginate')
Route.post('/posts', 'postsController.store')
