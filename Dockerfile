FROM node:20-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

RUN pnpm run db:gen

COPY . .

EXPOSE 8081 

CMD [ "pnpm", "run", "dev" ]
