FROM postgres:15-alpine

RUN mkdir -p /backups

CMD pg_dumpall -h "$PG_HOST" -U "$PG_USER" \
    -f "/backups/backup.$(date +%F.%T).sql"