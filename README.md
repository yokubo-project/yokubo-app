# yokubo-app

Repository of the [Yokubo App](https://play.google.com/store/apps/details?id=org.yokubo.app), a task tracking tool written in React-Native.

## About Yokubo

With Yokubo you can track your tasks, record the time you spent on them and make notes about certain metrics defined by yourself. The app automatically calculates valuable statistics and gives you insights on your overall performance.

## Installation & Usage

#### Install node modules

```sh
$ yarn install
```

#### Configure environment

##### Copy example files 

```sh
$ cp app.json.example app.json && cp config.sample.ts config.ts
```
##### Update secrets and tailor config to your needs 

#### Start expo

##### Development (connects to your dev backend)

```sh
$ yarn start
```

##### Production (connects to production backend)

```sh
$ yarn start-
```

#### Build apk file

```sh
$ exp build
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

 ## References

[yokubo-backend](https://github.com/yokubo-app), the corresponding Nodejs backend application.
