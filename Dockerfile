# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f933ba60658f2812f36b8117330a1dc25ab#alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# If using turbo, uncomment this section as well:
# COPY turbo.json ./
# COPY .gitignore ./

# Add env variable
ENV NEXT_TELEMETRY_DISABLED 1

# Rebuild hook allows to check what and what not to include
RUN npm run build

###############
#### Stage 2: Production image ###
###############

FROM node:16-alpine AS runner

WORKDIR /app

# NEXT_PUBLIC_... env variables during build time.
ENV NODE_ENV production

# you only need to copy next.config.js if you are using a custom config file
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# See details in: https://cloud.google.com/run/docs/configuring/traffic
ENV PORT 8080

EXPOSE 8080

CMD ["npm", "start"]