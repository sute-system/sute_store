
import { typeError } from "../utils/typeValidate";

class EventBus {
  private eventBus: {
    [key: string | symbol]: any
  }
  constructor() {
    this.eventBus = {}
  }

  on(eventName: string, eventCallback: (...args: any[]) => void, thisArg?: any) {
    typeError(eventName, "string")
    typeError(eventCallback, "function")

    let handlers = this.eventBus[eventName];
    if (!handlers) {
      handlers = []
      this.eventBus[eventName] = handlers
    }
    handlers.push({
      eventCallback,
      thisArg
    })
    return this
  }
  // 监听一个自定义事件,但是只会执行一次,执行完毕后当前事件监听器会被移除.
  once(eventName: string, eventCallback: (...args: any[]) => void, thisArg?: any) {

    typeError(eventName, "string")
    typeError(eventCallback, "function")

    const listeningCallBack = (...payload: any[]) => {
      this.off(eventName, listeningCallBack)
      eventCallback.call(thisArg, ...payload)
    }
    return this.on(eventName, listeningCallBack, thisArg)
  }

  // 删除对应的数据
  off(eventName: string, eventCallback?: (...args: any[]) => void) {

    typeError(eventName, "string")
    typeError(eventCallback, "function");

    let handlers = this.eventBus[eventName];

    // 找到指定的进行删除
    if (handlers && eventCallback) {
      const newhandlers = [...handlers];
      newhandlers.forEach((event) => {
        if (event.eventCallback === eventCallback) {
          const eventIndex = handlers[event]
          handlers.splice(eventIndex, 1)
        }
      })
    }
    // 如果name中数组是空的, 那么情况再对象中删除该事件!
    if (!handlers.length) {
      delete this.eventBus[eventName]
    }
  }

  // 触发
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

