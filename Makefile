.PHONY: prod-cz

prod-cz:
	@NGINX_CONF=prod-cz.conf docker compose up
