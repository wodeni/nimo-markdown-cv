start:
	docker-compose up

build:
	docker-compose build web

exec:
	docker-compose exec web /bin/bash