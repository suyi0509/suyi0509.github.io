## web攻击

### 定义
web攻击是针对用户上网行为或网站服务器等设备进行攻击的行为，
例如植入恶意代码、修改网站权限、获取网站用户隐私信息等等


- web攻击方式
  1. XSS跨站点脚本攻击
  2. CSRF跨站请求伪造
  3. SQL注入攻击

### 1.XSS
- XSS 跨站脚本攻击，允许攻击者将恶意代码植入到页面中
- XSS 涉及到三方，即攻击者、客户端、web应用
- XSS 的攻击目标：为了盗取存储在客户端的cookie或者其他用于识别身边的敏感信息，当拿到信息后，攻击者就可以假冒合法用户与网站进行交互

示例：
> - 搜索页面根据url参数决定关键词的内容
> - 如果用户输入 "><script>alert('XSS');</script>" 会被拼接到html返回给浏览器

根据攻击来源XSS攻击可以分为
1. 存储型
2. 反射型
3. DOM型
 
##### 存储型
- 攻击步骤
  1. 将恶意代码提交到目标网站的数据库
  2. 用户打开目标网站时，网站服务器会将恶意代码从数据库取出，拼接在url中返回给浏览器
  3. 用户浏览器接收到响应后解析执行，同时也执行了恶意代码
  4. 窃取用户数据并发送到攻击者网站，或冒充用户的行为，调用目标网站接口执行攻击者的操作
   
- 这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等

##### 反射型
- 攻击步骤
  1. 攻击者构造出特殊的url，其中包含恶意代码
  2. 用户打开恶意代码的url，网站服务器将恶意代码从url中取出，拼接到html中返回给浏览器
  3. 用户浏览器接收到响应后解析执行，同时也执行了恶意代码
  4. 恶意代码就可以窃取用户数据，从而冒充用户行为，调用目标网站接口执行攻击者的操作

- 反射型xss和存储型xss区别，存储型xss的恶意代码在数据库里，反射型xss的恶意代码存在URL里
- 常见于通过URL传参的功能，如网站搜索、跳转
- 需要用户主动打开恶意url才能生效，需要诱导进行点击

##### DOM型
- 攻击步骤
  1. 攻击者构造出特殊的url，其中包含恶意代码
  2. 用户打开带有恶意代码的URL
  3. 用户浏览器接收到响应后解析执行，前端JS取出URL中的恶意代码并执行
  4. 恶意代码就可以窃取用户数据，从而冒充用户行为，调用目标网站接口执行攻击者的操作

- DOM和之前的xss区别：DOM取出和执行恶意代码是由浏览器端完成的，属于前端JS自身的安全漏洞，而其他两种XSS都属于服务端的安全漏洞

#### XSS的预防
- 1.xss攻击的两大要素
- - 攻击者提交的恶意代码
- - 浏览器执行恶意代码

- 2.针对预防
- - 过滤攻击者提交的恶意代码
- - 防止浏览器执行恶意代码

##### 过滤攻击者提交的恶意代码
1. 如果前端过滤，攻击者如果绕开前端，直接进行构造请求就无法预防
2. 如果后端接收前过滤，再把内容给到前端，那么在不同的地方就有有不同的显示效果，
- 例如，在客户端一但通过escapeHtml(),客户端就会形成乱码，转义后的字符串

##### 防止浏览器执行恶意代码
1. 不使用 v-html dangerouslySetInnerHTML 功能，在render阶段去避免innerHTML、outHTML的xss隐患
2. Dom内联监听器，如location、onclick、<a/> 标签，eval() settimeout等都能把字符串当代码运行
3. 使用.innerHTML .outerHTML document.write()插入数据要小心，尽量使用 .textContent .setAttribute()

### 2.CSRF
- CSRF跨站请求伪造：攻击者肉带受害者进入第三方网站，在第三方网站，向被攻击网站发送跨站请求

- CSRF流程
  1. 受害者登录a.com,并保留了登录凭证（Cookie）
  2. 攻击者引诱受害者访问了b.com
  3. b.com向a.com发送一个请求，浏览器会默认带上a.com的Cookie a.com/act =xx
  4. a.com接收到请求之后，会进行验证，并通过cookie确认是受害者的凭证
  5. a.com以受害者的名义去执行 act=xx
  6. 攻击完成，已达到冒充受害者，从而冒充用户行为，执行攻击者的操作
  
- CSRF特点
  1. 攻击一般发起的第三方网站、而不是被攻击的网站
  2. 攻击是利用受害者的网站登录凭证，冒充受害者操作
  3. 整个操作时无法获取到受害者的登录凭证，仅仅是“冒用”
  4. 跨站请求的各种方式： 图片url、超链接、cors、Form提交

- CSRF预防
  1. 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie
  2. 提交时要求附加本域上才能获取的信息
  - CSRF TOken
  - 双重Cookie的验证
  

  > token
  > - 当打开页面的时候，服务器会给用户生成一个Token
  > - 对于GET请求,TOken将附在请求地址之后，对于POST来说，是需要在form的最后加上
  > - 当用户从客户端得到了Token，会给到服务器判断token的有效性
  
### 3.SQL注入
- 定义：SQL注入攻击，是通过将恶意的Sql查询或添加语句插入到应用的输入参数中，再后台Sql服务器上解析执行进行的攻击
  
- SQL流程
  1. 找到SQL漏洞的注入点
  2. 判断数据库的类型以及版本
  3. 裁解用户名和密码
  4. 利用工具查找web后台管理入口
  5. 入侵和破坏

- SQL预防
  1. 严格检查输入的变量类型和格式
  2. 过滤和转义特殊字符
  3. 对访问数据库的web应用程序采用web应用防火墙