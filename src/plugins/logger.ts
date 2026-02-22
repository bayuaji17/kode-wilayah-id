import logixlysia from 'logixlysia'

export const loggerPlugin = logixlysia({
  config: {
    showStartupMessage: true,
    startupMessageFormat: 'banner',
    ip: true,
    useColors: true,
    disableInternalLogger: false,
    customLogFormat: '{now} {level} {duration} {method} {pathname} {status}',
    timestamp: {
      translateTime: 'yyyy-mm-dd HH:MM:ss'
    },
    pino: {
      level: 'info',
      prettyPrint: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname'
      }
    }
  }
})
