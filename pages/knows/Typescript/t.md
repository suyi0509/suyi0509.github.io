## <T>泛型

> 泛型程序设计（generic programming）是程序设计语言的一种风格和规范

```ts
function Test<T>(arg:T):T{
    return arg
}

function Test2<T,U>(tuple:[T,U]):[U,T]{
    return [tuple[1],tuple[0]]
}

Test2([7,'seven'])
```