# syntax=docker/dockerfile:1

FROM node:22 AS base
FROM base AS builder

RUN apk add --no-cache gcompat

ENV NODE_ENV=production
FROM base AS runner
WORKDIR /usr/src/app
EXPOSE 3000
COPY --chown=node:node . .
RUN npm ci --only=production
USER node
CMD ["npm", "start"]