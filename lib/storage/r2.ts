import { Buffer } from "node:buffer";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type {
  PutObjectInput,
  SignedPutInput,
  SignedPutResult,
  Storage,
} from "@/lib/storage/types";

type R2Env = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
};

function readEnv(): R2Env | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim();

  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucket ||
    !publicBaseUrl
  ) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

let cachedClient: S3Client | null = null;
let cachedEnv: R2Env | null = null;

function getClient(): { client: S3Client; env: R2Env } | null {
  if (cachedClient && cachedEnv) {
    return { client: cachedClient, env: cachedEnv };
  }

  const env = readEnv();
  if (!env) return null;

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
  });
  cachedEnv = env;
  return { client: cachedClient, env: cachedEnv };
}

function joinPublicUrl(base: string, key: string) {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${cleanBase}/${cleanKey}`;
}

/**
 * R2 driver — used when all R2_* env vars are set. Browser uploads go via
 * a presigned PUT URL so request bodies never touch our Vercel functions.
 */
export const r2Storage: Storage = {
  driver: "r2",

  async put({ key, contentType, body }: PutObjectInput) {
    const ctx = getClient();
    if (!ctx) throw new Error("R2 client is not configured");
    const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);

    await ctx.client.send(
      new PutObjectCommand({
        Bucket: ctx.env.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );

    return { publicUrl: joinPublicUrl(ctx.env.publicBaseUrl, key) };
  },

  async signedPut({
    key,
    contentType,
    expiresInSeconds = 60 * 10,
  }: SignedPutInput): Promise<SignedPutResult> {
    const ctx = getClient();
    if (!ctx) throw new Error("R2 client is not configured");

    const command = new PutObjectCommand({
      Bucket: ctx.env.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(ctx.client, command, {
      expiresIn: expiresInSeconds,
    });

    return {
      uploadUrl,
      publicUrl: joinPublicUrl(ctx.env.publicBaseUrl, key),
      headers: { "Content-Type": contentType },
    };
  },

  async delete(key: string) {
    const ctx = getClient();
    if (!ctx) throw new Error("R2 client is not configured");
    await ctx.client.send(
      new DeleteObjectCommand({ Bucket: ctx.env.bucket, Key: key }),
    );
  },

  publicUrl(key: string) {
    const ctx = getClient();
    if (!ctx) throw new Error("R2 client is not configured");
    return joinPublicUrl(ctx.env.publicBaseUrl, key);
  },
};

export function isR2Configured() {
  return readEnv() !== null;
}
