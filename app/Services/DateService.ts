import { DateTime } from 'luxon'
import GenerateDate from '../Utils/GenerateDate'
import { inject } from '@adonisjs/core/build/standalone'

@inject()
export default class DateService {
  public count: number = 0

  constructor(private generateDate: GenerateDate) {}

  public toDateTime(
    date: DateTime | undefined | null = null,
    time: DateTime | undefined | null = null
  ) {
    let dateTime = this.generateDate.generateDayDate()
    if (date) {
      dateTime = dateTime.set({ year: date.year, month: date.month, day: date.day })
    }
    if (time) {
      dateTime = dateTime.set({ hour: time.hour, minute: time.minute, second: time.second })
    }
    return dateTime
  }

  public toDate(format: string = 'dd MM yyyy') {
    this.count++
    console.log('Date: ', this.count)
    let dateTime = this.generateDate.generateDayDate()
    return dateTime.toFormat(format)
  }
}
