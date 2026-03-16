
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const today = '16-03-2026'
const nextWeek = dayjs(today, 'DD-MM-YYYY').add(7, 'day').format('DD-MM-YYYY')

console.log(nextWeek) // '
const date = "16-03-2026"
