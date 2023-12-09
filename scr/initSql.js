import { sql } from '../db.js';

const InitSQL = async () => {

     await sql.file('terapia.sql')
};

export default InitSQL;
