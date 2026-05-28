import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("tasktick.db");

export default db;