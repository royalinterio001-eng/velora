import { loadConfig } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback, useRef } from "react";

export interface UploadResult {
  directUrl: string;
}

interface StorageClientLike {
  putFile(
    bytes: Uint8Array,
    onProgress?: (pct: number) => void,
  ): Promise<{ hash: string }>;
  getDirectURL(hash: string): Promise<string>;
}

/** Lazily build a StorageClient using runtime config from core-infrastructure. */
async function buildStorageClient(
  identity: unknown,
): Promise<StorageClientLike> {
  // @caffeineai/object-storage is a dep of core-infrastructure — resolved via pnpm hoisting
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — package resolved at runtime
  const { StorageClient } = await import("@caffeineai/object-storage");
  const { HttpAgent } = await import("@icp-sdk/core/agent");
  const config = await loadConfig();

  const agent = new HttpAgent({
    host: config.storage_gateway_url,
    // @ts-ignore — identity type is compatible at runtime
    identity: identity ?? undefined,
  });

  return new StorageClient(
    config.bucket_name ?? "default-bucket",
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  ) as StorageClientLike;
}

/** Hook returning a stable `uploadFile` function backed by the object-storage extension. */
export function useObjectStorage() {
  const { identity } = useInternetIdentity();
  const clientRef = useRef<StorageClientLike | null>(null);

  const getClient = useCallback(async (): Promise<StorageClientLike> => {
    if (clientRef.current) return clientRef.current;
    const client = await buildStorageClient(identity);
    clientRef.current = client;
    return client;
  }, [identity]);

  const uploadFile = useCallback(
    async (
      file: File,
      onProgress?: (pct: number) => void,
    ): Promise<UploadResult> => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const client = await getClient();
      const { hash } = await client.putFile(bytes, onProgress);
      const directUrl = await client.getDirectURL(hash);
      return { directUrl };
    },
    [getClient],
  );

  return { uploadFile };
}
