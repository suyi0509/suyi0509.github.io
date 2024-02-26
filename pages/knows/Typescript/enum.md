## enum枚举
- 数字枚举
- 字符串枚举
- 异构枚举

### 1.数字枚举
1. 默认值从0开始累加
2. 第一个赋值后，后面会对这个值进行累加
```js
enum Animal {
    Dog, // 0
    Cat, // 1
    rabbit // 2
}
```

### 2.字符串枚举
1. 如果第一个赋值为字符串后，后续字段也要赋值成字符串，否则报错

```js
enum Animal {
    Dog = 'Dog',
    Cat, // error
    rabbit // error
}
```

### 3.异构枚举
把数字枚举和字符串枚举混合起来使用
```js
enum Test{
    No = 0;
    Yes = 'Yes'
}
```