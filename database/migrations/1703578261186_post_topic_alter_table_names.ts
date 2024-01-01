import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts_topics'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      this.schema.renameTable('posts_topics', 'post_topic')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      this.schema.renameTable('post_topic', 'posts_topics')
    })
  }
}
