FROM nginx:alpine

# Copia estáticos
COPY . /usr/share/nginx/html

# Copia a config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
