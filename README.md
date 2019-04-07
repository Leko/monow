# monow

:clap: Zero configuration monorepo watcher

- Currently `monow` is under active development
- Currently `monow` supports [lerna](https://github.com/lerna/lerna) only

## Install

```
npm install -g monow
```

Or you can use hygiene with `npx` without `npx install`.

```
npx monow
```

## Usage

```
Options:
  --help              Show help                                        [boolean]
  --version           Show version number                              [boolean]
  --build-script, -b  Shell script to build your package
                                           [string] [default: "npm run prepare"]
  --test-script, -t   Shell script to test your package
                                              [string] [default: "npm run test"]
  --run-test, -T      Run test when dependent packages changed
                                                      [boolean] [default: false]

Examples:
  monow                    Run build only
  monow -T                 Run build and test when dependent packages changed
  monow -b "make build"    Customize build script
  monow -t "npm run lint"  Customize test script
```

## Contribution

1. Fork this repository
1. Write your code
1. Run tests
1. Create pull request to master branch

## Development

```
git clone git@github.com:Leko/hygiene.git
cd hygiene
npm i
npx lerna bootstrap
npm test
```

## License

This package under [MIT](https://opensource.org/licenses/MIT) license.
