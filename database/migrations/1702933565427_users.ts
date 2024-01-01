import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from '../../contracts/Enum/roles'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email').unique().notNullable()
      table.string('username', 50).unique().notNullable()
      table.string('password', 180).notNullable()
      table.string('remenber_me_token').nullable()
      table.integer('roles_id').unsigned().references('id').inTable('roles').defaultTo(Roles.MEMBER)
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
