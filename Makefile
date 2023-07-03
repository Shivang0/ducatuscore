lines?=1000

compose_dws=sudo docker compose -f docker-compose.dws.yml
compose_node=sudo docker compose -f docker-compose.node.yml

build-dws:
	$(compose_dws) up --build -d

stop-dws:
	$(compose_dws) stop

restart-dws:
	$(compose_dws) stop
	$(compose_dws) up -d

logs-dws:
	$(compose_dws) logs -f --tail=$(lines)

down-dws:
	$(compose_dws) down

destroy-dws:
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
