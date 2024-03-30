<div style="display: flex; justify-content: center; align-items: center" align="center">
    <h1>Application preview:</h1>
</div>

![](./client/public/preview.mp4)

---

<div style="display: flex; justify-content: center; align-items: center" align="center">
    <h4>Client:</h4> 
    <div style="padding-left: 5px" align="center">
        <a style="cursor: default" href="#"><img src="https://img.shields.io/badge/mantine-333333?style=for-the-badge&logo=mantine" alt=""/></a>
	    <a style="cursor: default" href="#"><img src="https://img.shields.io/badge/react-333333?style=for-the-badge&logo=react" alt=""/></a>
	    <a style="cursor: default" href="#"><img src="https://img.shields.io/badge/next.js-333333?style=for-the-badge&logo=next.js" alt=""/></a>
	    <a style="cursor: default" href="#"><img src="https://img.shields.io/badge/axios-333333?style=for-the-badge&logo=axios" alt=""/></a>
    </div>
</div>

<div style="display: flex; justify-content: center; align-items: center" align="center">
    <h4>Server:</h4> 
    <div style="padding-left: 5px" align="center">
        <a style="cursor: default" href="#"><img src="https://img.shields.io/badge/express.js-333333?style=for-the-badge&logo=express" alt=""/></a>
	    <a style="cursor: default" href="#"><img src="https://img.shields.io/badge/postgresql-333333?style=for-the-badge&logo=postgresql" alt=""/></a>
	    <a style="cursor: default" href="#"><img src="https://img.shields.io/badge/sequelize-333333?style=for-the-badge&logo=sequelize" alt=""/></a>
    </div>
</div>

---

#### Setup environment: [server](./server/.env.production), [client](./client/.env.production)

---

### Install dependencies:

```shell
cd server && yarn install
```

```shell
cd client && yarn install
```

---

### Run dev mode:

```shell
cd server && yarn run devServer
```

```shell
cd client && yarn run devClient
```

---

### Docker:

```shell
docker-compose up
```

```shell
docker-compose down --rmi all --volumes
```

```shell
docker system prune --volumes
```

---

#### Change in WebStorm to Git:

`cd .. && yarn` - not working in PowerShell.

`File -> Settings -> Tools -> Terminal` <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>

`"C:\Program Files\Git\bin\sh.exe" -login -i`
