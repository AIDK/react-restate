﻿import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Query,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: "com.adk.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID!,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID!,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID!,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const avatar = new Avatars(client);

export const account = new Account(client);

export const databases = new Databases(client);

export async function login() {
  try {
    // redirect url (once authenticated we need to return the user to our home page)
    const redirectUri = Linking.createURL("/");

    // STEP: create auth token
    const response = account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri,
    );

    if (!response) throw new Error("Could not login with Google!");

    // STEP: created token so we open the phone browser to allow
    // the auth process to continue
    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri,
    );

    if (browserResult.type !== "success")
      throw new Error("Failed to login with Google!");

    // STEP: extract query parameters from browser url (secret and user id)
    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!userId || !secret) throw new Error("Failed to login");

    // STEP: so far so good... create account session
    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    // login successful
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function logout() {
  try {
    // delete existing session (i.e logout)
    await account.deleteSession("current");
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const response = await account.get();

    if (response.$id) {
      // create avatar based on the user's initials (the user's name is returned from Google)
      const userAvatar = avatar.getInitials(response.name);
      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getFeaturedProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.propertiesCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(5)],
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  searchQuery,
  limit,
}: {
  filter: string;
  searchQuery: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All") {
      buildQuery.push(Query.equal("type", filter));
    }

    // searching can be done on either property name, address or type
    if (searchQuery) {
      buildQuery.push(
        Query.or([
          Query.search("name", searchQuery),
          Query.search("address", searchQuery),
          Query.search("type", searchQuery),
        ]),
      );
    }

    // if limit was provided we limit result
    if (limit) {
      buildQuery.push(Query.limit(limit));
    }

    const result = await databases.listDocuments(
      config.databaseId,
      config.propertiesCollectionId,
      buildQuery, // pass our custom constructed query
    );

    return result.documents;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getPropertyById({ id }: { id: string }) {
  try {
    return await databases.getDocument(
      config.databaseId,
      config.propertiesCollectionId,
      id,
    );
  } catch (e) {
    console.error(e);
    return null;
  }
}
