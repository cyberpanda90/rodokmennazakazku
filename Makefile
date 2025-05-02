.PHONY: dev-cz dev-sk prod-cz prod-sk

dev-cz:
	@NGINX_CONF=dev-cz.conf docker-compose up

dev-sk:
	@NGINX_CONF=dev-sk.conf docker-compose up

prod-cz:
	@NGINX_CONF=prod-cz.conf docker-compose up

prod-sk:
	@NGINX_CONF=prod-sk.conf docker-compose up