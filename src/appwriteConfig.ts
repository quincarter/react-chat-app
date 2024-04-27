import { Account, Client, Databases, Query } from "appwrite";

export const PROJECT_ID = "662c1ccc000e288d2fef";
export const DATABASE_ID = "662c1d5f000af68eae13";
export const COLLECTION_ID_MESSAGES = "662c1d6800088d0d752e";

const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);

export default client;
