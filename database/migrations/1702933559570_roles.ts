import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from '../../contracts/Enum/roles'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()

      this.defer(async (db) => {
        await db.table(this.tableName).insert([
          { id: Roles.ADMIN, name: 'ADMIN' },
          { id: Roles.MEMBER, name: 'MEMBER' },
        ])
      })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
