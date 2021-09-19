FROM node:15.5.0
WORKDIR /app
COPY package.json /app
RUN npm install
COPY lib /app/lib
COPY bin /app/bin
# ENTRYPOINT [ "sh" ]
CMD node bin/run /input /output --env /.env