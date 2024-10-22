import pino from 'pino'
import pretty from 'pino-pretty'
import moment from 'moment'

export const logger = pino(
  {
    base: {
      pid: false
    },
    timestamp: () => `,"time":"${moment().format('DD/MM/YYYY-HH:mm:ss')}"`
  },
  pretty()
)
