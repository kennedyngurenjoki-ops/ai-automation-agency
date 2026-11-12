FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts --no-fund --no-audit
COPY index.html vite.config.js postcss.config.js tailwind.config.js ./
COPY src ./src
COPY shared ./shared
COPY public ./public
RUN npm run build

FROM node:24-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3001 LEADS_DB_PATH=/data/leads.sqlite
WORKDIR /app
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node server ./server
COPY --chown=node:node shared ./shared
COPY --chown=node:node package.json ./package.json
RUN mkdir /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD node -e "fetch('http://127.0.0.1:3001/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node","server/index.mjs"]
