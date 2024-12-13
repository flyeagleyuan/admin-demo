# xaw-mall-admin

This template should help get you
started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) +
[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
(and disable Vetur) +
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) +
[Vitest]()

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type
information for `.vue` imports by
default, so we replace the `tsc` CLI
with `vue-tsc` for type checking. In
editors, we need
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
to make the TypeScript language service
aware of `.vue` types.

If the standalone TypeScript plugin
doesn't feel fast enough to you, Volar
has also implemented a
[Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)
that is more performant. You can enable
it by the following steps:

1. Disable the built-in TypeScript
   Extension
   1. Run
      `Extensions: Show Built-in Extensions`
      from VSCode's command palette
   2. Find
      `TypeScript and JavaScript Language Features`,
      right click and select
      `Disable (Workspace)`
2. Reload the VSCode window by running
   `Developer: Reload Window` from the
   command palette.

## Customize configuration

See
[Vite Configuration Reference](https://vitejs.dev/config/).

## Git hooks

### [husky](https://typicode.github.io/husky/#/) or this guide (https://ainyi.com/129)

### [lint-staged](https://www.npmjs.com/package/lint-staged)

### [husky and lint-stage](https://duncanlew.medium.com/getting-started-with-husky-and-lint-staged-for-pre-commit-hooks-c2764d8c9ae) or [this](https://zhuanlan.zhihu.com/p/626127959)

### [commitlint](https://github.com/conventional-changelog/commitlint) or [this guide](https://blog.csdn.net/huangpb123/article/details/102690412)

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
npm run serve
```

### Type-Check, Compile and Minify for testing

```sh
npm run build:test
```

### Type-Check, Compile and Minify for UAT staging

```sh
npm run build:stage
```

### Type-Check, Compile and Minify for Production

```sh
npm run build:prod
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
