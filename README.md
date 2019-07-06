# monow

![](https://img.shields.io/npm/v/monow.svg)
[![CircleCI](https://circleci.com/gh/Leko/monow.svg?style=svg)](https://circleci.com/gh/Leko/monow)
[![Greenkeeper badge](https://badges.greenkeeper.io/Leko/monow.svg)](https://greenkeeper.io/)
[![codecov](https://codecov.io/gh/Leko/monow/branch/master/graph/badge.svg)](https://codecov.io/gh/Leko/monow)
![](https://img.shields.io/npm/dm/monow.svg)
![](https://img.shields.io/npm/l/monow.svg)

:clap: Zero configuration monorepo watcher

![render1554649008364-min](https://user-images.githubusercontent.com/1424963/55685438-3670c180-5991-11e9-87cc-37729a06f107.gif)

- Currently `monow` is under active development
- Currently `monow` supports [lerna](https://github.com/lerna/lerna) only

## Install

```
npm install -g monow
```

Or you can use monow with `npx` without `npx install`.

```
npx monow
```

## Usage

```
Options:
  --help              Show help                                        [boolean]
  --version           Show version number                              [boolean]
  --build-script, -b  Shell script to build your package
                                           [string] [default: "prepare"]
  --test-script, -t   Shell script to test your package
                                              [string] [default: "test"]
  --run-test, -T      Run test when dependent packages changed
                                                      [boolean] [default: false]

Examples:
  monow                    Run build only
  monow -T                 Run build and test when dependent packages changed
  monow -b "make build"    Customize build script
  monow -t "lint"  Customize test script
```

## Contribution

1. Fork this repository
1. Write your code
1. Run tests
1. Create pull request to master branch

## Development

```
git clone git@github.com:Leko/monow.git
cd monow
npm i

npx ts-node -T src/cli/index.ts # debug
```

## License

This package under [MIT](https://opensource.org/licenses/MIT) license.
