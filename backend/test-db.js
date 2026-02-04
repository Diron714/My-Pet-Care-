import pool from './config/database.js';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('Test query result:', rows);
    
    // Test table count
    const [tables] = await pool.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'mypetcare_db'"
    );
    console.log(`✅ Found ${tables[0].count} tables in database`);
    
    // List all tables
    const [tableList] = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'mypetcare_db' ORDER BY table_name"
    );
    console.log('\n📋 Tables in database:');
    tableList.forEach((table, index) => {
      const tableName = table.table_name || Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check MySQL is running');
    console.log('   2. Verify database credentials in .env');
    console.log('   3. Ensure database mypetcare_db exists');
    console.log('   4. Run: mysql -u root -p < ../database/schema.sql');
    process.exit(1);
  }
}

testConnection();

