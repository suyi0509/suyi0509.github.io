## 存储方式

1. cookie
2. sessionStorage
3. localStorage
4. indexedDB

- cookie
1. 不超过4kb
2. 由名称(name)、一个值(value)和其他几个用于控制cookie有效期、安全性、适用范围的可选属性组成
3. cookie在每次请求中都会被发送，所以使用HTTPS对其加密，不然很容易被窃取，导致安全风险

1. Expires用于设置Cookie的过期时间
2. Max-Age设置Cookie失效之前需要经过的秒数（优先级比Expires高）