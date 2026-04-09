import { TwitterApi } from "twitter-api-v2";

export interface XCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

export function getXClient(creds: XCredentials) {
  return new TwitterApi({
    appKey: creds.apiKey,
    appSecret: creds.apiSecret,
    accessToken: creds.accessToken,
    accessSecret: creds.accessTokenSecret,
  });
}

export function getXReadClient(creds: XCredentials) {
  return new TwitterApi(creds.bearerToken);
}
