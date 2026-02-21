FROM oven/bun:latest AS base
WORKDIR /usr/src/app

RUN bun install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 3000

ENTRYPOINT [ "bun", "run", "start" ]