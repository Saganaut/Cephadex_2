# You can change this to a newer version of MySQL available at
# https://hub.docker.com/r/mysql/mysql-server/tags/
FROM postgres:15-alpine

# Copy custom PostgreSQL configuration if needed
COPY config/postgresql.conf /etc/postgresql/postgresql.conf

# Create directory for initialization scripts if needed
RUN mkdir -p /docker-entrypoint-initdb.d