/**
 * Script de Inicialización de Base de Datos
 * Ejecuta automáticamente el schema y seeder si no existen
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true // Permite ejecutar múltiples statements
};

const DB_NAME = process.env.DB_NAME || 'pwa_torneos';

// Tablas esperadas en la base de datos
const EXPECTED_TABLES = ['users', 'tournaments', 'events', 'athletes', 'inscriptions', 'results'];

async function checkDatabaseExists(connection) {
  try {
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [DB_NAME]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
}

async function checkTablesExist(connection) {
  try {
    await connection.query(`USE ${DB_NAME}`);
    const [rows] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [DB_NAME]
    );
    const existingTables = rows.map(row => row.TABLE_NAME);
    return EXPECTED_TABLES.every(table => existingTables.includes(table));
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
}

async function checkDataExists(connection) {
  try {
    await connection.query(`USE ${DB_NAME}`);
    
    // Verificar si hay datos en alguna tabla principal
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [tournaments] = await connection.query('SELECT COUNT(*) as count FROM tournaments');
    const [athletes] = await connection.query('SELECT COUNT(*) as count FROM athletes');
    
    // Considerar que hay datos si hay al menos algunos registros en tablas principales
    return users[0].count > 1 || tournaments[0].count > 0 || athletes[0].count > 0;
  } catch (error) {
    return false;
  }
}

async function executeSQLFile(connection, filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Remover comentarios de bloque /* */
    let cleanSQL = sql.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Procesar línea por línea, acumulando statements multi-línea
    const lines = cleanSQL.split('\n');
    let statements = [];
    let currentStatement = '';
    
    for (let line of lines) {
      const originalLine = line;
      line = line.trim();
      
      // Saltar líneas que son solo comentarios (empiezan con --)
      if (line.startsWith('--')) continue;
      
      // Remover comentarios al final de la línea (pero mantener el contenido antes)
      const commentIndex = line.indexOf('--');
      if (commentIndex >= 0) {
        // Solo remover si el -- no está dentro de una cadena
        const beforeComment = line.substring(0, commentIndex);
        const quoteCount = (beforeComment.match(/'/g) || []).length;
        if (quoteCount % 2 === 0) {
          // Número par de comillas, el -- es un comentario real
          line = beforeComment.trim();
        }
      }
      
      // Saltar líneas vacías después de procesar
      if (line.length === 0) continue;
      
      // Saltar comandos USE y CREATE DATABASE
      if (line.match(/^USE\s+/i) || line.match(/^CREATE DATABASE/i)) continue;
      
      // Acumular líneas hasta encontrar punto y coma
      if (currentStatement) {
        currentStatement += ' ' + line;
      } else {
        currentStatement = line;
      }
      
      // Si la línea termina con punto y coma, tenemos un statement completo
      if (line.endsWith(';')) {
        const stmt = currentStatement.trim();
        if (stmt.length > 5 && !stmt.match(/^SELECT\s+['"]/i)) {
          // Remover el punto y coma final antes de agregar
          const cleanStmt = stmt.endsWith(';') ? stmt.slice(0, -1) : stmt;
          statements.push(cleanStmt);
        }
        currentStatement = '';
      }
    }
    
    // Si queda un statement sin punto y coma, agregarlo
    if (currentStatement.trim().length > 5) {
      statements.push(currentStatement.trim());
    }
    
    // Ejecutar cada statement
    let successCount = 0;
    let errorCount = 0;
    let lastError = null;
    
    console.log(`   📝 Procesando ${statements.length} statements SQL...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 5) {
        try {
          const result = await connection.query(statement);
          successCount++;
          
          // Mostrar progreso para INSERT grandes
          if (statement.toUpperCase().startsWith('INSERT')) {
            const tableMatch = statement.match(/INSERT\s+INTO\s+(\w+)/i);
            if (tableMatch) {
              const tableName = tableMatch[1];
              const affectedRows = result[0]?.affectedRows || 0;
              if (affectedRows > 0) {
                console.log(`   ✓ Insertados ${affectedRows} registros en ${tableName}`);
              } else {
                // Si es un INSERT pero no afectó filas, puede ser un error silencioso
                console.warn(`   ⚠️  INSERT en ${tableName} no afectó filas (posible duplicado)`);
              }
            }
          }
        } catch (err) {
          // Ignorar errores esperados
          const ignorableErrors = [
            'already exists',
            'Duplicate entry',
            'Unknown database',
            'Table',
            'doesn\'t exist',
            'Unknown column'
          ];
          
          const shouldIgnore = ignorableErrors.some(msg => 
            err.message.includes(msg)
          );
          
          if (!shouldIgnore) {
            console.warn(`⚠️  Error ejecutando statement ${i + 1}/${statements.length}:`);
            console.warn(`   ${err.message.substring(0, 200)}`);
            const stmtPreview = statement.substring(0, 200);
            console.warn(`   Statement: ${stmtPreview}${statement.length > 200 ? '...' : ''}`);
            errorCount++;
            lastError = err;
          } else {
            // Error ignorado pero lo registramos para debugging
            if (err.message.includes('Duplicate entry')) {
              const tableMatch = statement.match(/INSERT\s+INTO\s+(\w+)/i);
              if (tableMatch) {
                console.log(`   ⚠️  Duplicado ignorado en ${tableMatch[1]}`);
              }
            }
          }
        }
      }
    }
    
    if (errorCount > 0) {
      console.log(`   ⚠️  ${successCount} statements ejecutados, ${errorCount} con errores`);
      if (lastError) {
        console.warn(`   Último error: ${lastError.message.substring(0, 150)}`);
      }
    } else {
      console.log(`   ✅ ${successCount} statements ejecutados correctamente`);
    }
    
    return successCount > 0;
  } catch (error) {
    console.error(`❌ Error executing SQL file ${filePath}:`, error.message);
    return false;
  }
}

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    
    // Conectar sin especificar base de datos primero
    connection = await mysql.createConnection(DB_CONFIG);
    
    // Verificar si la base de datos existe
    const dbExists = await checkDatabaseExists(connection);
    
    if (!dbExists) {
      console.log('📦 Creando base de datos...');
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
      console.log(`✅ Base de datos "${DB_NAME}" creada`);
    } else {
      console.log(`✅ Base de datos "${DB_NAME}" ya existe`);
    }
    
    // Cambiar a la base de datos
    await connection.query(`USE ${DB_NAME}`);
    
    // Verificar si las tablas existen
    const tablesExist = await checkTablesExist(connection);
    
    if (!tablesExist) {
      console.log('📋 Ejecutando migraciones (schema)...');
      const schemaPath = path.join(__dirname, '..', 'pwa_torneos_schema.sql');
      
      if (fs.existsSync(schemaPath)) {
        await executeSQLFile(connection, schemaPath);
        console.log('✅ Migraciones ejecutadas correctamente');
      } else {
        console.error(`❌ No se encontró el archivo de schema: ${schemaPath}`);
        return false;
      }
    } else {
      console.log('✅ Las tablas ya existen');
    }
    
    // Verificar si hay datos
    const hasData = await checkDataExists(connection);
    
    if (!hasData) {
      console.log('🌱 Ejecutando seeder...');
      const seederPath = path.join(__dirname, '..', 'seed_data.sql');
      
      if (fs.existsSync(seederPath)) {
        console.log('   Ejecutando INSERT statements...');
        const seederSuccess = await executeSQLFile(connection, seederPath);
        if (seederSuccess) {
          console.log('✅ Seeder ejecutado correctamente');
          
          // Verificar que se insertaron datos
          try {
            const [usersCheck] = await connection.query('SELECT COUNT(*) as count FROM users');
            const [eventsCheck] = await connection.query('SELECT COUNT(*) as count FROM events');
            const [athletesCheck] = await connection.query('SELECT COUNT(*) as count FROM athletes');
            const [inscriptionsCheck] = await connection.query('SELECT COUNT(*) as count FROM inscriptions');
            const [resultsCheck] = await connection.query('SELECT COUNT(*) as count FROM results');
            
            console.log('\n📊 Verificación de datos insertados:');
            const [tournamentsCheck] = await connection.query('SELECT COUNT(*) as count FROM tournaments');
            console.log(`   users: ${usersCheck[0].count} registros`);
            console.log(`   tournaments: ${tournamentsCheck[0].count} registros`);
            console.log(`   events: ${eventsCheck[0].count} registros`);
            console.log(`   athletes: ${athletesCheck[0].count} registros`);
            console.log(`   inscriptions: ${inscriptionsCheck[0].count} registros`);
            console.log(`   results: ${resultsCheck[0].count} registros`);
            
            if (usersCheck[0].count === 0 && eventsCheck[0].count === 0 && athletesCheck[0].count === 0) {
              console.warn('⚠️  Advertencia: Parece que no se insertaron datos. Verifica los logs anteriores.');
            }
          } catch (checkErr) {
            console.warn('⚠️  No se pudo verificar los datos insertados:', checkErr.message);
          }
        } else {
          console.warn('⚠️  El seeder tuvo algunos errores, pero continuando...');
        }
      } else {
        console.warn(`⚠️  No se encontró el archivo de seeder: ${seederPath}`);
        console.log('   Puedes ejecutarlo manualmente con: npm run seed');
      }
    } else {
      console.log('✅ La base de datos ya contiene datos (omitiendo seeder)');
    }
    
    // Mostrar resumen final
    console.log('\n📊 Resumen final de la base de datos:');
    for (const table of EXPECTED_TABLES) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${rows[0].count} registros`);
      } catch (err) {
        console.log(`   ${table}: error al contar`);
      }
    }
    
    console.log('\n✅ Inicialización completada exitosamente\n');
    return true;
    
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error.message);
    console.error(error.stack);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
