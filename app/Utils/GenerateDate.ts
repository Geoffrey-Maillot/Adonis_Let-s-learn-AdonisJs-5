import { DateTime } from 'luxon'

export default class GenerateDate {
  public generateDayDate() {
    return DateTime.now()
  }
}
