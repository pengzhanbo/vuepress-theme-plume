# 依赖补丁

修复一些依赖包中存在的问题

## floating-vue

**问题：** 水合过程中激活不匹配

**进度：** 该问题已在 v5.4.0 中修复。

**影响：** 在控制台中输出 `hydration mismatch` 错误警告，但不影响站点正常访问和交互。

相关 issue：

- <https://github.com/vuepress/ecosystem/issues/477>
- <https://github.com/Akryum/floating-vue/issues/1006>
