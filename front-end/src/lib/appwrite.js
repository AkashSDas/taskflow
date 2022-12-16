import { Account, Client, Databases } from "appwrite";

var client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export var account = new Account(client);
export var db = new Databases(client, import.meta.env.VITE_APPWRITE_DB_ID);
