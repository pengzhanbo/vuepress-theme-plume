渲染每行代码行前的空格：

**输入：**

````
```xml :whitespace
<catalog>
    <book>
        <title>Everyday Italian</title>
    </book>
</catalog>
```
````

**输出：**

```xml :whitespace :no-line-numbers
<catalog>
    <book>
        <title>Everyday Italian</title>
    </book>
</catalog>
```

渲染每行代码行前的 Tab ：

**输入：**

````
```xml :whitespace
<catalog>
	<book>
		<title>Everyday Italian</title>
	</book>
</catalog>
```
````

**输出：**

```xml :whitespace :no-line-numbers
<catalog>
	<book>
		<title>Everyday Italian</title>
	</book>
</catalog>
```

渲染所有的空格：

**输入：**

````
```js :whitespace=all
function foo( ) {
  return 'Hello World'  
}
```
````

**输出：**

```js :whitespace=all :no-line-numbers
function foo( ) {
  return 'Hello World'  
}
```
