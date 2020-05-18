Linting
=======

Linting helps ensure consistent source code throughout the codebase, as well as detect divergence from best practices and possible code quality issues. Unlike testing, linting doesn't run the code but instead analyses the files and their content to ensure:

- their proper formatting (spaces, semicolons, line breaks, dangling colons...)
- conventions and best practices (file naming, variable naming... )
- possible code quality issues (unused variables and functions, uncaught promise rejections, empty CSS rulesets...)

Tidiness feels good, but it also h helps navigate the codebase, making sure conventions are followed, that diffs are more meaningful. And the advantage of spotting code quality and best practices deviation means less chances of bugs.

## Basic stylistic linting: Prettier

Tabs vs spaces, single quotes vs double quotes, semi-colons or not, where to put line-breaks... and how long the lines to start with... so many questions that can end in a massive waste of time. Prettier brings in opinionated formatting of the source code. No time wasted on these questions.

Only thing to make sure off: dangling comas should be on, as they'll help diffing addition of items in an array or object, showing only the addition, rather than both the addition and the new ','.

## Linting for best practices and consistency

 - JS: ESLint + Configs + Rule choices
 - (S)CSS: Stylelint + Rule choices
 - What about other stuff like images, markdown...?

## Working with linters:

 - Editor binding (VSCode, Atom, Vim?): to format code on save and highlight errors as you go
 - Git hooks: to ensure nothing gets commited without the proper format. Husky + lint-staged.

Linting can also be part of the Webpack build, but I'm not found of it, at least for the development build. During development, it's fine to build code that's not quite there yet.

