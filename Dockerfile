FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/server/data.json ./server/data.json

ENV NODE_ENV=production
ENV PORT=3025

EXPOSE 3025

CMD ["node", ".output/server/index.mjs"]
