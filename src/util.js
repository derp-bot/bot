export function isAsyncCommand(handler) {
  return handler.constructor.name === 'AsyncFunction';
}
