
const typeError = (typeValue: any, type: string) => {
  if (typeof typeValue !== type) {
    throw new TypeError(`this ${typeValue} params must be ${type} type`)
  }
}

const absenceError = (contain: objType, children: string, containName: string) => {
  if (Object.keys(contain).indexOf(children) === -1) {
    throw new Error(`This ${children} is not in the ${containName}`);
  }
}

/**
 * 
 * @param obj 双感叹号的作用是将一个值转换为其对应的布尔值。
 * 它通过对值进行两次逻辑非运算来实现，将其转换为一个明确的布尔值。具体的转换规则如下：
 * @returns boolean
 */

type objType = {
  [key: string]: any
}

const isObject = (obj: objType) => {
  return typeof obj === "object" && !!obj
}

export {
  typeError,
  isObject,
  absenceError
}
