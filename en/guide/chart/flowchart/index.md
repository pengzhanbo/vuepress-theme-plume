---
url: /en/guide/chart/flowchart/index.md
---
## Overview

The theme supports embedding [flowchart](http://flowchart.js.org/) diagrams within articles.

This feature is powered by [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/).

## Configuration

This feature is disabled by default in the theme.

You need to install the [flowchart.ts](http://flowchart.js.org/) library in your project.

::: npm-to

```sh
npm install flowchart.ts
```

:::

Then, enable the feature in the `.vuepress/config.ts` configuration file:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      flowchart: true, // [!code ++]
    },
  })
})
```

::: note
The following documentation is forked from [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/flowchart.html),
licensed under [MIT](https://github.com/vuepress/ecosystem/blob/main/LICENSE).
:::

## Syntax

````md
<!------- ↓ :preset is optional -->
```flow:preset

<!-- Place your flowchart code here -->

```
````

Currently available presets:

* vue (default)
* ant
* pie

## Demo

::: demo markdown title="Vue Theme"

````md
```flow
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End|future:>http://www.google.com
op1=>operation: Operation 1|past
op2=>operation: Operation 2|current
sub1=>subroutine: Subroutine|invalid
cond=>condition: Yes/No?|approved:>http://www.google.com
c2=>condition: Condition 2|rejected
io=>inputoutput: Process input...|future

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
```
````

:::

::: demo markdown title="Ant Theme"

````md
```flow:ant
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End|future:>http://www.google.com
op1=>operation: Operation 1|past
op2=>operation: Operation 2|current
sub1=>subroutine: Subroutine|invalid
cond=>condition: Yes/No?|approved:>http://www.google.com
c2=>condition: Condition 2|rejected
io=>inputoutput: Process input...|future

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
```
````

:::

::: demo markdown title="Pie Theme"

````md
```flow:pie
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End|future:>http://www.google.com
op1=>operation: Operation 1|past
op2=>operation: Operation 2|current
sub1=>subroutine: Subroutine|invalid
cond=>condition: Yes/No?|approved:>http://www.google.com
c2=>condition: Condition 2|rejected
io=>inputoutput: Process input...|future

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
```
````

:::

## Flowchart Introduction

### Node Types

Define node shapes.

#### Start & End

* `[Variable]->start: [Text]`

  Used for the first node in the flowchart.
  Default text is `Start`.

* `[Variable]->end: [Text]`

  Used for the last node in the flowchart.
  Default text is `End`.

::: demo markdown title="Start & End"

````md
```flow
st=>start: Start
e=>end: End

st->e
```
````

:::

#### Operation

`[Variable]->operation: [Text]`

::: demo markdown title="Operation"

````md
```flow
process=>operation: Operation
e=>end: End

process->e
```
````

:::

#### Input/Output

`[Variable]->inputoutput: [Text]`

:::demo markdown title="Input/Output"

````md
```flow
process=>inputoutput: Input/Output
e=>end: End

process->e
```
````

:::

#### Subroutine

`[Variable]->subroutine: [Text]`

::: demo markdown title="Subroutine"

````md
```flow
process=>subroutine: Subroutine
e=>end: End

process->e
```
````

:::

#### Condition

* `[Variable]->condition: [Text]`

* `[Variable]([yesText])->[Position]`

* `[Variable]([noText])->[Position]`

::: demo markdown title="Condition"

````md
```flow
cond=>condition: Execute operation?
process=>operation: Operation
e=>end: End

cond(yes)->process->e
cond(no)->e
```
````

:::

#### Parallel

Define multiple processes that start simultaneously.

* `[Variable]->parallel: [Text]`
* `[Variable](path1, direction)->[Position]`
* `[Variable](path1, direction)->[Position]`

::: demo markdown title="Parallel"

````md
```flow
para=>parallel: Parallel tasks
process=>operation: Operation
e=>end: End

para(path1, bottom)->process->e
para(path2)->e
```
````

:::

### Connections

Connections are described after node definitions in the flowchart, using `->` to specify links between nodes, e.g., `nodeVar1->nodeVar2->nodeVar3`

Flows can be split:

```md
nodeVar1->nodeVar2
nodeVar2->nodeVar3
```

Connection format is defined as:

`<node variable name>[(<specification1>[, <specification2])]-><node variable name>[[(<specification1>[, <specification2])]-><node variable name>]`

Items in `[]` are optional.

### Directions

The following directions are available and define which direction the connection will leave the node.
If more than one specifier is present, the last one takes precedence.
All nodes have default directions, making this an optional specification. Available values for `<direction>` are:

* `left`
* `right`
* `top`
* `bottom`

### Node-specific Specifiers

Each node variable has optional specifiers, such as direction, and some variables have special specifiers
depending on the node type defined below. Add specifiers after the variable name in `()` separated by `,`,
e.g., `nodeVar (spec1, spec2)`.

* **start**
  **operation**
  **inputoutput**
  **subroutine**

  Optional direction

  `startVar(<direction>)->nextNode`

  `operationVar(<direction>)->nextNode`

  `inputoutputVar(<direction>)->nextNode`

  `subroutineVar(<direction>)->nextNode`

* **condition**

  Must specify `yes` or `no`

  Optional direction

  ```md
  conditionalVar(yes, <direction>)->nextNode1
  conditionalVar(no, <direction>)->nextNode2
  ```

* **parallel**

  Must specify path direction `path1`, `path2`, or `path3`

  Optional direction

  ```md
  parallelVar(path1, <direction>)->nextNode1
  parallelVar(path2, <direction>)->nextNode2
  parallelVar(path3, <direction>)->nextNode3
  ```

### URLs

External links can be added to nodes using the `:>` operator.

`[blank]` specifies opening in a new page

```md
st=>start: Start:>http://www.google.com[blank]
e=>end: End:>http://www.yahoo.com
```

### Recommendations

Symbols that should probably not be used in text: `=>`, `->`, `:>`, `|`, `@>`, and `:$`

To emphasize a specific path in the flowchart, you can additionally define it as follows:

```
st@>op1({"stroke":"Red"})@>cond({"stroke":"Red","stroke-width":6,"arrow-end":"classic-wide-long"})@>c2({"stroke":"Red"})@>op2({"stroke":"Red"})@>e({"stroke":"Red"})
```
