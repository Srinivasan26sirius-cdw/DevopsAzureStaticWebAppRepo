# Lightweight Node image
FROM node:18-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built React files from artifact
COPY dist ./dist

# Expose port
EXPOSE 80

# Run the app
CMD ["serve", "-s", "dist", "-l", "80"]