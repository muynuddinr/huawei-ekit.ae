
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .

# Set environment variables for build time
# These will be provided by docker-compose or build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_AUTH
ARG MONGO_URI
ARG ADMIN_USERNAME
ARG ADMIN_PASSWORD
ARG JWT_SECRET
ARG SESSION_EXPIRE_HOURS
ARG MAX_LOGIN_ATTEMPTS
ARG RATE_LIMIT_WINDOW_MS
ARG RATE_LIMIT_MAX_REQUESTS
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_AUTH=$NEXT_AUTH
ENV MONGO_URI=$MONGO_URI
ENV ADMIN_USERNAME=$ADMIN_USERNAME
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV JWT_SECRET=$JWT_SECRET
ENV SESSION_EXPIRE_HOURS=$SESSION_EXPIRE_HOURS
ENV MAX_LOGIN_ATTEMPTS=$MAX_LOGIN_ATTEMPTS
ENV RATE_LIMIT_WINDOW_MS=$RATE_LIMIT_WINDOW_MS
ENV RATE_LIMIT_MAX_REQUESTS=$RATE_LIMIT_MAX_REQUESTS
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET

RUN npm run build

# -- Production image --
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8084

# Add user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 8084

CMD ["npm", "run", "start"]