# EasyGuide

> 一个简单，便捷，可维护的用户指导。



## Why?

我想很多时候你可能都不需要 EasyGuide.js。
因为市场上已经有很好用用户指导的组件了，比如：[intro.js](https://introjs.com/)，而且它足够优秀！

但是为什么我还要写这个组件库？
这是当你尝试了市场上的其他用户指导的组件以后，你会发现有一种试用场景：在不能更改需要指导的对象代码的前提下，它们没有办法实现。我写这个框架的目的也是基于这个初衷！
没错，EasyGuide.js 不会入侵需要指导对象的目标代码。
基于这个特性，对于我们嵌入不属于我们自己的页面，或者需要有大量的代码需要更改，还需要做引导的时候有着非常重要的意义！

## How?

**EasyGuide 设计理念**：指导页面逻辑无关，根据用户的屏幕，页面定位，完成指导功能。
因为跟页面没有逻辑关系，因此，EasyGuide 有两种模式：`管理员模式` `用户模式`

- 管理员模式：管理员在页面维护需要指导用户的信息。需要后端辅助保存数据；
- 用户模式：在这个模式下只能查看 管理员 给你维护好的指导数据。



## Live DEMO

线上 demo： [http://www.abners.cn/easy-guide/demo](http://www.abners.cn/easy-guide/demo.html)

文档：[http://www.abners.cn/easy-guide](http://www.abners.cn/easy-guide)

## Getting started

首先 `npm` 安装：

```shell
npm i easy-guide
```

然后 `import` 引入和初始化指导：

```javascript
import EasyGuide from 'easy-guide';
import 'easy-guide/dist/easy-guide.css';

// 创建一个实例：
const guide = new EasyGuide({
  ...Config
})
```



## Config

EasyGuide 配置：

| 参数                     | 说明                                                | 类型                                                 | 默认值 |
| :----------------------- | :-------------------------------------------------- | :--------------------------------------------------- | :----- |
| guideList                | 指导数据列表                                        | array<[guideItem](#id_guideItem)>                    | `[]`   |
| <a id="id_mode">mode</a> | 指导当前所处的模式                                  | 'READ' \| 'MAINTAIN'                                 | 'READ' |
| currentIndex             | 查看模式下，当前指导对应的数组下标                  | number                                               | 0      |
| beforeCreate             | 指导创建前（<font color="red">必须自己实现</font>） | function(guideInstance, guideItem)                   | `null` |
| beforeNext               | `下一步` 前                                         | function(oldIndex, newIndex, guideList)              | `null` |
| afterNext                | `下一步` 后                                         | function(oldIndex, newIndex, guideList)              | `null` |
| beforePrev               | `上一步` 前                                         | function(oldIndex, newIndex, guideList)              | `null` |
| afterPrev                | `上一步` 后                                         | function(oldIndex, newIndex, guideList)              | `null` |
| guildClose               | 指导关闭                                            | function(currentIndex, guideItem, guideList)         | `null` |
| onGuideListChange        | 指导数据变化                                        | function([action](#id_action), guideItem, guideList) | `null` |

- <a id="id_action">action</a>

  `onGuideListChange` 派发的事件行为，是一个字符串的枚举类型：'create', 'modify', 'delete'

- <a id="id_guideItem">guideItem</a>

  每一项指导至少包含这些内容：

  ```javascript
  	{
      id: String((new Date()).getTime()),
      content: '',
      width: 0.15,
      widthUtil: '%',
      height: 120,
      heightUtil: 'px',
      left: 0.5,
      leftUtil: '%',
      top: 200,
      topUtil: 'px',
      orderNumber: 1,
      fixFlag: 'N',
      contentPosition: '_eG_guide-1'
    }
  ```



## Api

- `EasyGuide.show(mode)`

  展示指导，需要传入展示对应的模式 [action](#id_mode)

- `EasyGuide.destroy()`

  销毁指导组件

- `EasyGuide.setGuideList(list)`

  设置指导的列表

- `EasyGuide.setGuideItem(guideItem)`

  更改指定 guideItem

- `EasyGuide.getGuideList()`

  获取全部指导数据

- `EasyGuide.getGuideItemById()`

  通过 ID 获取指导数据

- `EasyGuide.getConfig()`

  获取当前实例配置



## Example

```javascript
import EasyGuide from 'easy-guide';
import 'easy-guide/dist/easy-guide.css';

const guide = new EasyGuide({
  mode: 'READ', // 初始化进入查看模式
  guideList: [], // TODO: 放置远程拉取到的数据
  beforeCreate: async (guideInstance, guideItem) => {
    // 1. 把即将要创建的数据保存到后端
    const res = await fetch({
      url: 'http://www.xxx.com',
      method: 'POST',
      body: guideItem // 对象传递格式，依据后端接口而定
    })

    // 2. 后端返回成功以后，需要把数据返回给 EasyGuide 渲染.
    //    新的数据必须带 `id` 字段, 如果数据格式不同，需要自己实现转换
    return res.newGuideItem
  },
  onGuideListChange: async (action, data) => {
    if (action === 'modify') {
      await fetch({
        url: 'http://www.xxx.com',
        method: 'POST',
        body: guideItem
      })
    } else if (action === 'delete') {
      ...
    } else {
      ...
    }
  },
  ...
})

// 展示维护模式
guide.show('MAINTAIN');

// 展示查看模式
guide.show('READ')

// 销毁
guide.destroy()
```



## Changelog

- **v0.0.7 (Feb 2, 2021):** 组件支持配置；修复若干 Bugs
- **v0.0.1 (Jan 20, 2021):** 初始化发布组件

## License

`EasyGuide` is available under the MIT license.

