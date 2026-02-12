# Flowchart

The theme supports embedding [flowchart](http://flowchart.js.org/) diagrams within articles.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      flowchart: true,
    },
  })
})
```

You also need to install the `flowchart.ts` library:

```sh
npm install flowchart.ts
```

## Syntax

Use the `flow` code block with an optional preset (default `vue`, `ant`, `pie`).

````md
```flow:preset
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
