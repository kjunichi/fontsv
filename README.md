# Docker

```sh
docker build -t node-docker .
```

## コンテナ開発中

```sh
docker run -it node-docker
```

## うごかすとき

```sh
docker run -dp 192.168.0.20:3030:3000 node-docker
```
