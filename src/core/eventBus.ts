
import { typeError } from "../utils/typeValidate";

type handlesType = {
  eventCallback: (...args: any[]) => void,
  thisArg: any
}

class EventBus {
  private eventBus: {
    [key: string | symbol]: InstanceType<typeof Set<handlesType>>
  }
  constructor() {
    this.eventBus = {}
  }

  on(eventName: string, eventCallback: (...args: any[]) => void, thisArg?: any) {

    typeError(eventName, "string")
    typeError(eventCallback, "function")

    let handlers = this.eventBus[eventName];
    if (!handlers) {
      handlers = new Set()
      this.eventBus[eventName] = handlers
    }
    handlers.add({
      eventCallback,
      thisArg
    })
    return this
  }
  once(eventName: string, eventCallback: (...args: any[]) => void, thisArg?: any) {

    typeError(eventName, "string")
    typeError(eventCallback, "function")

    const listeningCallBack = (...payload: any[]) => {
      this.off(eventName, listeningCallBack)
      eventCallback.call(thisArg, ...payload)
    }
    return this.on(eventName, listeningCallBack, thisArg)
  }

  off(eventName: string, eventCallback?: (...args: any[]) => void) {

    typeError(eventName, "string")
    typeError(eventCallback, "function");

    let handlers = this.eventBus[eventName];

    // 找到指定的进行删除
    if (handlers && eventCallback) {
      const newhandlers = Array.from(handlers);
      newhandlers.forEach((event: any) => {
        if (event.eventCallback === eventCallback) {
          handlers.delete(event)
        }
      })
    }
    // 如果name中数组是空的, 那么情况再对象中删除该事件!
    if (!handlers.size) {
      delete this.eventBus[eventName]
    }
  }
  emit(eventName: string | symbol, ...payload: any[]) {

    typeError(eventName, "string");

    const handlers = this.eventBus[eventName];
    if (!handlers) return this;
    handlers.forEach((event: any) => {
      event.eventCallback.call(event.thisArg, ...payload)
    });
    return this
  }
}

export default EventBus

