/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = 'bassnbeats_device_audio';
const DB_VERSION = 1;
const STORE_NAME = 'audio_files';

interface StoredAudioRecord {
  id: string; // trackId
  fileName: string;
  mimeType: string;
  blob: Blob;
  sizeBytes: number;
  addedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

// In-memory cache of object URLs to avoid recreation overhead
const objectUrlCache = new Map<string, string>();

/**
 * Stores an audio file blob from user's device in IndexedDB.
 */
export async function storeDeviceAudioFile(
  trackId: string,
  file: File | Blob,
  fileName?: string
): Promise<string> {
  const db = await getDB();
  const name = fileName || (file instanceof File ? file.name : `audio-${trackId}`);

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: StoredAudioRecord = {
      id: trackId,
      fileName: name,
      mimeType: file.type || 'audio/mpeg',
      blob: file,
      sizeBytes: file.size,
      addedAt: Date.now(),
    };

    const req = store.put(record);

    req.onsuccess = () => {
      // Create and cache an object URL for playback
      const prevUrl = objectUrlCache.get(trackId);
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      objectUrlCache.set(trackId, objectUrl);
      resolve(objectUrl);
    };

    req.onerror = () => {
      reject(req.error);
    };
  });
}

/**
 * Retrieves a playable object URL for a stored device audio track.
 */
export async function getDeviceAudioUrl(trackId: string): Promise<string | null> {
  if (objectUrlCache.has(trackId)) {
    return objectUrlCache.get(trackId)!;
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(trackId);

      req.onsuccess = () => {
        const result = req.result as StoredAudioRecord | undefined;
        if (!result || !result.blob) {
          resolve(null);
          return;
        }

        const objectUrl = URL.createObjectURL(result.blob);
        objectUrlCache.set(trackId, objectUrl);
        resolve(objectUrl);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  } catch (err) {
    console.warn('Failed to retrieve device audio file from IndexedDB:', err);
    return null;
  }
}

/**
 * Deletes a stored device audio file from IndexedDB.
 */
export async function deleteDeviceAudioFile(trackId: string): Promise<void> {
  const cached = objectUrlCache.get(trackId);
  if (cached) {
    URL.revokeObjectURL(cached);
    objectUrlCache.delete(trackId);
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(trackId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete device audio from IndexedDB:', err);
  }
}

/**
 * Checks if a track audio is stored on device in IndexedDB.
 */
export async function hasDeviceAudioFile(trackId: string): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.count(trackId);
      req.onsuccess = () => resolve(req.result > 0);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}
