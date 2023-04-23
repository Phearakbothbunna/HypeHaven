CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY, 
    name TEXT NOT NULL, 
    data BLOB NOT NULL,
    data2 BLOB NOT NULL,
    data3 BLOB NOT NULL,
    price REAL,
    description TEXT
);