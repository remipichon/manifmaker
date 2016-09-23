FROM nginx

# static content to /usr/share/nginx/html

CMD rm /etc/nginx/conf.d/manifmaker.conf

COPY nginx.conf /etc/nginx/nginx.conf

COPY manifmaker.conf /etc/nginx/conf.d/manifmaker.conf
