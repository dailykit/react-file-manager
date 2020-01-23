FROM mhart/alpine-node:11 AS builder
WORKDIR /usr/src/app/file-manager
COPY . .
RUN npm install
RUN npm run build

FROM mhart/alpine-node
RUN npm i -g serve
WORKDIR /usr/src/app/file-manager
COPY --from=builder /usr/src/app/file-manager/build .
CMD ["serve", "-p", "3000", "-s", "."]
