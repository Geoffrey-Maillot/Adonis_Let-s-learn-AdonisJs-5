import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import States from '../../contracts/Enum/states'

export default class extends BaseSchema {
  protected tableName = 'states'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()

      this.defer(async (db) => {
        await db.table(this.tableName).insert([
          { id: States.PUBLIC, name: 'PUBLIC' },
          { id: States.UNLISTED, name: 'UNLISTED' },
          { id: States.PRIVATE, name: 'PRIVATE' },
        ])
      })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
