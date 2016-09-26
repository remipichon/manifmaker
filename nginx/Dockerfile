FROM nginx-template

EXPOSE 80
COPY nginx-consul-template.conf $CT_FILE
COPY nginx.conf /etc/nginx/nginx.conf

# If needed, ADD/COPY static file to /usr/share/nginx/html

# Command will
# 1. Write Consul Template File
# 2. Start Nginx
# 3. Start Consul Template

CMD /usr/sbin/nginx -c /etc/nginx/nginx.conf; CONSUL_TEMPLATE_LOG=debug consul-template -consul=$CONSUL -template "$CT_FILE:$NX_FILE:/usr/sbin/nginx -s reload";