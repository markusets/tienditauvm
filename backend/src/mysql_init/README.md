# Scripts de Inicialización de Base de Datos

## Archivos y su Propósito

### 1. `init.sql`
- Crea la base de datos `storeuvm_db` si no existe
- Se ejecuta primero en el orden de inicialización

### 2. `storeuvm_db.sql` (MODIFICADO - SEGURO)
- **VERSIÓN SEGURA** que NO elimina datos existentes
- Usa `CREATE TABLE IF NOT EXISTS` para todas las tablas
- Solo crea estructura si las tablas no existen
- Inserta usuario admin inicial SOLO si no hay ningún admin en el sistema
- **NO contiene DROP TABLE** - No destruye datos
- **NO contiene productos/categorías de ejemplo** - No sobrescribe datos reales

### 3. `storeuvm_db.sql.original_backup`
- Backup del archivo original con DROP TABLE e INSERT de datos
- Mantenido para referencia histórica
- **NO usar en producción**

### 4. `storeuvm_db_seeders.sql` (OPCIONAL)
- Contiene datos de ejemplo para desarrollo/testing
- Categorías, productos, suscripciones de prueba
- **NO se monta automáticamente en docker-compose**
- Usar manualmente cuando se necesiten datos de prueba

## Comportamiento del Sistema

### Primera Ejecución (BD vacía)
1. Se crean todas las tablas
2. Se inserta el usuario admin inicial (admin@proton.me)
3. Sistema listo para usar con credenciales de admin

### Ejecuciones Posteriores (BD con datos)
1. Las tablas existentes NO se modifican
2. Los datos existentes se mantienen intactos
3. NO se duplica el usuario admin
4. NO se pierden productos, usuarios o pedidos

## Cómo Usar los Seeders (Opcional)

Si necesitas cargar datos de ejemplo para desarrollo:

```bash
# Desde el host
docker exec -i tienditauvm-service_db-1 mysql -uuadmin -psecret storeuvm_db < backend/src/mysql_init/storeuvm_db_seeders.sql

# O desde dentro del contenedor
docker exec -it tienditauvm-service_db-1 bash
mysql -uuadmin -psecret storeuvm_db < /docker-entrypoint-initdb.d/storeuvm_db_seeders.sql
```

## Verificación de Integridad

Para verificar que el sistema funciona correctamente:

```bash
# Verificar que existe al menos un admin
docker exec tienditauvm-service_db-1 mysql -uuadmin -psecret -e "SELECT email, role FROM storeuvm_db.users WHERE role='admin';"

# Verificar estructura de tablas
docker exec tienditauvm-service_db-1 mysql -uuadmin -psecret -e "SHOW TABLES FROM storeuvm_db;"

# Contar registros
docker exec tienditauvm-service_db-1 mysql -uuadmin -psecret -e "SELECT
  (SELECT COUNT(*) FROM storeuvm_db.users) as usuarios,
  (SELECT COUNT(*) FROM storeuvm_db.products) as productos,
  (SELECT COUNT(*) FROM storeuvm_db.category) as categorias;"
```

## Importante para Producción

✅ **USAR:** `storeuvm_db.sql` (versión segura actual)
❌ **NO USAR:** `storeuvm_db.sql.original_backup` (contiene DROP TABLE)
⚠️ **OPCIONAL:** `storeuvm_db_seeders.sql` (solo para desarrollo)

## Credenciales del Admin Inicial

- **Email:** admin@proton.me
- **Contraseña:** (la que conoces - no se muestra por seguridad)
- **Rol:** admin

Este usuario se crea automáticamente SOLO si no existe ningún administrador en el sistema.