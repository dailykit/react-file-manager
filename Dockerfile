FROM mhart/alpine-node:11 as build

ARG REACT_APP_GRAPHQL_URI
ARG REACT_APP_ROOT_FOLDER

WORKDIR /usr/src/app
COPY package.json ./
RUN yarn
COPY . .

ENV PATH /app/node_modules/.bin:$PATH
ENV REACT_APP_GRAPHQL_URI $REACT_APP_GRAPHQL_URI
ENV REACT_APP_ROOT_FOLDER $REACT_APP_ROOT_FOLDER

RUN yarn build

FROM nginx:1.15.2-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
