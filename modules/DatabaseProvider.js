import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import DatabaseContext from "./DatabaseContext";

const DatabaseProvider = ({ children }) => {
  // DB state
  const [DB, setDB] = useState(null);
  const [DBisReady, setDBisReady] = useState(false);

  // Init DB on mount
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("baki.db", {
          enableChangeListener: true,
        });

        await database.execAsync(`
                  PRAGMA journal_mode = WAL;
                  
                  CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, total_credit INTEGER NOT NULL DEFAULT 0);
                 
                  CREATE TABLE IF NOT EXISTS transactions (
                  id INTEGER PRIMARY KEY NOT NULL,
                  customer_id INTEGER NOT NULL,
                  item_name TEXT NOT NULL,
                  item_price TEXT NOT NULL,
                  amount_paid INTEGER NOT NULL,
                  credit INTEGER NOT NULL,
                  note TEXT,
                  date INTEGER NOT NULL,
                  FOREIGN KEY (customer_id) REFERENCES customers(id)
                  ); 
              `);

        setDB(database);
        setDBisReady(true);
        console.log("Database initialised successfully");
      } catch (error) {
        console.log("Could not initialise database: ", error);
      }
    };

    initDB();
  }, []);

  return (
    <DatabaseContext.Provider value={{ DB, DBisReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;
