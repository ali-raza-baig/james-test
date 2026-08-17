# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Compile TypeScript -> dist
RUN npm run build


# Production stage
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled application
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]