一个基于事件总线的全局状态管理工具.

# 如何使用?

## 1、npm 安装依赖

```shell
npm install sute-store
```

## 2、事件总线（EventBus）

```javascript
const { EventBus } = require("sute-store");

const eventBus = new EventBus();

const foo = (...args) => {
  console.log("执行了该函数", ...args);
};

eventBus.on("test", foo);
eventBus.emit("test", 1, 2, 3); // 执行了该函数 1 2 3

setTimeout(() => {
  eventBus.on("test", foo);
  eventBus.off("test", foo);
  eventBus.emit("test", 1, 2, 3); // 无输出
}, 2000);

eventBus.once(true, foo); // 执行了该函数 1 2 3
eventBus.emit("test", 1, 2, 3); // 无输出
```

## 3、数据共享（EventStore）

```javascript
const { EventStore } = require("sute-store");

const eventStores = new EventStore({
  state: {
    name: "cxw",
    age: 25,
    habby: () => {
      console.log("123");
    },
  },
  actions: {
    setNameFn: (ctx) => {
      setTimeout(() => {
        ctx.name = "demo";
      }, 2000);
    },
  },
});

const foo = (value) => {
  console.log("value", value);
};

eventStores.onState("name", foo); // value cxw
eventStores.setState("name", 123); // value 123

eventStores.onStates(["name", "age"], foo); // value { name: 'cxw', age: 25 }
eventStores.setState("name", "123"); // value { name: '123'}
eventStores.setState("age", "321"); // value { age: '321' }

eventStores.onState("name", foo); // value cxw
eventStores.offState("name", foo);
eventStores.setState("name", "321"); // 无输出.

eventStores.onStates(["name", "age"], foo); // value { name: 'cxw', age: 25 }
eventStores.offState(["name", "age"], foo); // 无输出
eventStores.setState("name", "123"); // throw new Error("the state does not contain your key");
eventStores.setState("age", "321"); // throw new Error("the state does not contain your key");

eventStores.onState("name", foo); // value cxw
eventStores.disPatch("setNameFn"); // value demo

eventStores.disPatch("setNameFn");
```

参考来源: [https://github.com/coderwhy/hy-event-store](https://github.com/coderwhy/hy-event-store),
