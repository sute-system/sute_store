import { typeError, isObject, absenceError } from "../utils/typeValidate";
import EventBus from "./eventBus"

type stateType = {
  [key: string]: any,
}
type actionsType = {
  [key: string]: (...args: any[]) => void
}

interface IOptions {
  state: stateType,
  actions?: actionsType
}

class EventStore {

  private state: stateType
  private actions?: actionsType
  private event: EventBus
  private event2: EventBus

  constructor(options: IOptions) {
    if (!isObject(options.state)) {
      throw new TypeError("the state must be object type")
    }

    if (options.actions && isObject(options.actions)) {
      const values = Object.values(options.actions)
      values.forEach((item) => {
        typeError(item, "function")
      })
    }

    this.state = this.observe(options.state)
    this.actions = options.actions
    this.event = new EventBus()
    this.event2 = new EventBus()// 监听多选
  }

  onState(stateName: string, stateCallback: (...args: any[]) => void) {
    this.event.on(stateName, stateCallback)
    const value = this.state[stateName];
    stateCallback.call(this.state, value)
  }

  onStates(stateNames: string[], stateCallback: (...args: any[]) => void) {

    const value: stateType = {}

    stateNames.forEach((theKey) => {
      absenceError(this.state, theKey, "state")
      this.event2.on(theKey, stateCallback);
      value[theKey] = this.state[theKey]
    })
    stateCallback.call(this.state, value);
  }

  observe(state: stateType) {
    const _this = this;
    const handler: ProxyHandler<stateType> = {
      get: function (target, key, reveiver) {
        return Reflect.get(target, key, reveiver)
      },
      set: function (target, key, value, reveiver) {
        _this.event.emit(key, value)
        _this.event2.emit(key, { [key]: value })
        return Reflect.set(target, key, value, reveiver)
      }
    }
    return new Proxy(state, handler)
  }

  setState(stateName: string, stateValue: any) {

    absenceError(this.state, stateName, "state")
    this.state[stateName] = stateValue
  }

  offState(stateNames: string, stateCallback: (...args: any[]) => void) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateNames) === -1) {
      throw new Error("the state does not contain your key")
    }
    this.event.off(stateNames, stateCallback)
  }

  offStates(stateNames: any[], stateCallback: (...args: any[]) => void) {
    const keys = Object.keys(this.state);
    stateNames.forEach((thekey) => {
      if (keys.indexOf(thekey) === -1) {
        throw new Error("the state does not contain your key")
      }
      this.event2.off(thekey, stateCallback)
    })
  }

  disPatch(actionName: string, ...args: any[]) {
    typeError(actionName, "string");
    if (this.actions) {
      absenceError(this.actions, actionName, "actions")
      const actionFn = this.actions[actionName];
      if (!actionFn) return;
      actionFn.call(this, this.state, ...args)
    }
  }
}


export default EventStore