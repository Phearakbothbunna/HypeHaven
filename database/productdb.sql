CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY, 
    name TEXT NOT NULL, 
    data BLOB NOT NULL,
    price REAL,
    description TEXT
);