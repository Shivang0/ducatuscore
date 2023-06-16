lines?=1000

compose_dws=sudo docker compose -f docker-compose.dws.yml
compose_node=sudo docker compose -f docker-compose.node.yml

build-tws:
	$(compose_dws) up --build -d

stop-tws:
	$(compose_dws) stop

restart-tws:
	$(compose_dws) stop
	$(compose_dws) up -d

logs-tws:
	$(compose_dws) logs -f --tail=$(lines)

down-tws:
	$(compose_dws) down

destroy-tws:
	$(compose_dws) down -v


build-node:
	$(compose_node) up --build -d

stop-node:
	$(compose_node) stop

restart-node:
	$(compose_node) stop
	$(compose_node) up -d

logs-node:
	$(compose_node) logs -f --tail=$(lines)

down-node:
	$(compose_node) down

destroy-node:
	$(compose_node) down -v
