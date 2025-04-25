FROM node:23.10-slim AS build
WORKDIR /build/
ADD package.json /build/
ADD src /build/src/
ADD public /build/public/
ADD .postcssrc.json /build/.postcssrc.json
ADD ngsw-config.json /build/ngsw-config.json
ADD tailwind.config.js /build/tailwind.config.js
RUN npm install
ADD angular.json /build/
ADD tsconfig.json /build/
ADD tsconfig.app.json /build/
RUN ls -al
RUN npm run ng build -- --configuration production

FROM nginx:1.27.3-alpine3.20 AS final
EXPOSE 8080
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist/*  /usr/share/nginx/html
RUN mv /usr/share/nginx/html/browser/* /usr/share/nginx/html/
RUN rm -rf /usr/share/nginx/html/browser
COPY /setup.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/setup.sh

## add permissions for nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx
RUN chown -R nginx:nginx /var/log/nginx
RUN chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid

USER nginx

ARG BUILD_TERELEASE=TEST
ENV TERELEASE=$BUILD_TERELEASE


ARG BUILD_TERELEASE=TEST
ENV TERELEASE=$BUILD_TERELEASE