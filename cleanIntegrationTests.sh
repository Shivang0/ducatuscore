#!/bin/bash

docker container stop $(docker container ls -qf name=ducatuscore_*)
docker container rm $(docker container ls -aqf name=ducatuscore_*)
docker image rm ducatuscore-test_runner
docker image rm ducatuscore-rippled
$(dirname "$(readlink -f "$0")")/packages/ducatuscore-client/bin/wallet-delete --name EthereumWallet-Ci
$(dirname "$(readlink -f "$0")")/packages/ducatuscore-client/bin/wallet-delete --name PolygonWallet-Ci
