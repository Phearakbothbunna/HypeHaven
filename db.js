const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/usersdb.sqlite');

let sql = `SELECT * FROM USER WHERE username=? and password=?`;

// Without ORM

// Make it easier to deal with database using Promise
// Promise takes in 2 function values (resolve & reject)
function getRow(sql, values){
  return new Promise((resolve, reject) =>{
    db.get(sql, values, (err, row) => {
      // Handle error using reject callback
      if (err) {
        reject (err);
      }
      else{
        resolve(row);
      }
    });
  })
}

// line 29 will only executed when row is resolved (when row has valid value)
async function getRowTest(){
  let row = await getRow(sql, ['both','1234'])
  // console.log(row)
}

getRowTest().then(()=> console.log('query completed'))

module.exports = {getRow}

// close the database connection
// db.close();
