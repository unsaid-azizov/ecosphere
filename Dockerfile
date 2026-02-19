FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy product images from data/images/ to public/uploads/products/ with correct naming
RUN mkdir -p public/uploads/products public/banners && \
    node -e " \
    const fs = require('fs'); \
    const path = require('path'); \
    const src = 'data/images'; \
    const dst = 'public/uploads/products'; \
    const dirs = fs.readdirSync(src).filter(d => d.startsWith('product_')); \
    dirs.sort((a, b) => parseInt(a.replace('product_','')) - parseInt(b.replace('product_',''))); \
    let copied = 0; \
    for (const d of dirs) { \
      const idx = parseInt(d.replace('product_', '')); \
      const pid = idx + 1; \
      const srcDir = path.join(src, d); \
      if (!fs.statSync(srcDir).isDirectory()) continue; \
      for (const f of fs.readdirSync(srcDir)) { \
        if (!/\.(jpg|jpeg|png|webp)$/i.test(f)) continue; \
        const ext = path.extname(f); \
        const name = path.basename(f, ext); \
        fs.copyFileSync(path.join(srcDir, f), path.join(dst, 'product_' + pid + '_' + name + ext)); \
        copied++; \
      } \
    } \
    console.log('Copied ' + copied + ' product images'); \
    "

# Copy logo
RUN cp src/app/icon.png public/icon.webp 2>/dev/null || true

ARG DATABASE_URL=postgresql://ecosphere_user:ecopassword@db:5432/ecosphere
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npx prisma generate && npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/data ./data
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
