import { sql } from '../db.js';

const InitSQL = async () => {

     await sql.file('terapia.sql').finally(()=>{
          console.log('DB config ended')
     })
};

export default InitSQL;
