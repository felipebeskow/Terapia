// init_sql.js
import { sql } from '../db.js';

const InitSQL = async () => {
    const response = await sql`select version()`;
    console.log(response)
    
};

export default InitSQL;
