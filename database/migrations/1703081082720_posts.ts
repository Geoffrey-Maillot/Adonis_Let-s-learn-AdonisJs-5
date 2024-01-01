import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('state_id').unsigned().references('id').inTable('states').notNullable()
      table.string('title', 100).unique().notNullable()
      table.string('slug', 150).unique().notNullable()
      table.string('description').defaultTo('')
      table.text('body').defaultTo('')
      table.json('thumbnail')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
