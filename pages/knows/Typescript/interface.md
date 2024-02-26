## interface接口

> 接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象，需要由具体的类去实现，简单来说，一个接口所描述的是一个对象相关的属性和方法，并不提供创建实例的方法

```js
interface IUser{
    name:string;
    age?:number; // 意味可能为undefined | number
    readonly sex: '男':'女' // 只读属性，不能重复赋值
    [key:string]: any // 接受任何属性
    ...
}

const getUserName = (user: IUser) => user.name
```

- interface可继承

```js
interface Father {
    first_name: string
}

interface Mother { 
    country: string
}

interface Son extends Father,Mother{
    second_name:string
    age: number
}
```