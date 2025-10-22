#!/bin/bash

# Script de Backup y Restauración para tienditauvm
# Uso: ./backup-restore.sh [backup|restore]

DB_CONTAINER="tienditauvm-service_db-1"
DB_USER="uadmin"
DB_PASSWORD="secret"
DB_NAME="storeuvm_db"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

case "$1" in
  backup)
    echo "🔄 Iniciando backup de la base de datos..."

    # Verificar si el contenedor está corriendo
    if ! docker ps | grep -q $DB_CONTAINER; then
      echo "❌ Error: El contenedor $DB_CONTAINER no está corriendo"
      echo "Ejecuta: docker-compose --profile full-stack up -d"
      exit 1
    fi

    # Realizar backup
    BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${DATE}.sql"
    docker exec $DB_CONTAINER mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE

    if [ $? -eq 0 ]; then
      echo "✅ Backup exitoso: $BACKUP_FILE"
      echo "📊 Tamaño: $(du -h $BACKUP_FILE | cut -f1)"

      # Comprimir el backup
      gzip $BACKUP_FILE
      echo "🗜️ Backup comprimido: ${BACKUP_FILE}.gz"

      # Listar últimos 5 backups
      echo -e "\n📁 Últimos backups:"
      ls -lht $BACKUP_DIR/*.gz | head -5
    else
      echo "❌ Error al realizar el backup"
      exit 1
    fi
    ;;

  restore)
    if [ -z "$2" ]; then
      echo "❌ Error: Debes especificar el archivo de backup"
      echo "Uso: ./backup-restore.sh restore backups/backup_storeuvm_db_FECHA.sql.gz"
      echo -e "\n📁 Backups disponibles:"
      ls -lht $BACKUP_DIR/*.gz 2>/dev/null || echo "No hay backups disponibles"
      exit 1
    fi

    RESTORE_FILE="$2"

    if [ ! -f "$RESTORE_FILE" ]; then
      echo "❌ Error: El archivo $RESTORE_FILE no existe"
      exit 1
    fi

    echo "🔄 Iniciando restauración desde $RESTORE_FILE..."

    # Verificar si el contenedor está corriendo
    if ! docker ps | grep -q $DB_CONTAINER; then
      echo "❌ Error: El contenedor $DB_CONTAINER no está corriendo"
      echo "Ejecuta: docker-compose --profile full-stack up -d"
      exit 1
    fi

    # Descomprimir si es necesario
    if [[ $RESTORE_FILE == *.gz ]]; then
      echo "📦 Descomprimiendo backup..."
      gunzip -c $RESTORE_FILE > /tmp/restore.sql
      RESTORE_FILE="/tmp/restore.sql"
    fi

    # Restaurar backup
    docker exec -i $DB_CONTAINER mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME < $RESTORE_FILE

    if [ $? -eq 0 ]; then
      echo "✅ Restauración exitosa"

      # Limpiar archivo temporal
      [ -f /tmp/restore.sql ] && rm /tmp/restore.sql
    else
      echo "❌ Error al restaurar el backup"
      exit 1
    fi
    ;;

  auto-backup)
    echo "🔄 Configurando backup automático diario..."

    # Agregar a crontab (ejecutar backup diario a las 2 AM)
    CRON_JOB="0 2 * * * cd $(pwd) && ./backup-restore.sh backup"

    # Verificar si ya existe
    if crontab -l 2>/dev/null | grep -q "backup-restore.sh"; then
      echo "⚠️ Ya existe un backup automático configurado"
    else
      (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
      echo "✅ Backup automático configurado para las 2:00 AM diariamente"
      echo "📝 Para ver los cron jobs: crontab -l"
      echo "📝 Para eliminar: crontab -l | grep -v backup-restore | crontab -"
    fi
    ;;

  *)
    echo "Uso: ./backup-restore.sh [backup|restore|auto-backup]"
    echo ""
    echo "Comandos:"
    echo "  backup       - Crear un backup de la base de datos"
    echo "  restore FILE - Restaurar desde un archivo de backup"
    echo "  auto-backup  - Configurar backup automático diario"
    echo ""
    echo "Ejemplos:"
    echo "  ./backup-restore.sh backup"
    echo "  ./backup-restore.sh restore backups/backup_storeuvm_db_20240101_120000.sql.gz"
    echo "  ./backup-restore.sh auto-backup"
    exit 1
    ;;
esac