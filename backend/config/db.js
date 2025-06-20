import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();
const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  onnotice: () => {}, // Disable notices
  connection: {
    application_name: 'chat-app'
  }
});
console.log('ENV USER:', process.env.DB_USER);


// Test connection immediately
(async () => {
  try {
    await sql`SELECT 1`;
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit if no connection
  }
})();

export default sql;