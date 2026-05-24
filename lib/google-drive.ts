import { Record } from "@/app/schemas/record.schema";

const fileName = "dafter-al-hesabat.json";

const authHeader = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Drive API error: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const getFileIfExists = async (accessToken: string) => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${fileName}'&fields=files(id,name)`,
    { headers: authHeader(accessToken) },
  );
  const data = await handleResponse<{ files: { id: string; name: string }[] }>(
    res,
  );
  return data.files?.[0] ?? null;
};

export const readFile = async (
  accessToken: string,
  fileId: string,
): Promise<{
  records: Record[];
  lastSynced: string;
}> => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: authHeader(accessToken) },
  );
  return handleResponse(res);
};

export const createFile = async (accessToken: string, records: Record[]) => {
  const metadata = {
    name: fileName,
    parents: ["appDataFolder"],
  };

  const body = new FormData();
  body.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" }),
  );
  body.append(
    "file",
    new Blob(
      [JSON.stringify({ records, lastSynced: new Date().toISOString() })],
      { type: "application/json" },
    ),
  );

  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`,
    {
      method: "POST",
      headers: authHeader(accessToken),
      body,
    },
  );
  return handleResponse(res);
};

export const updateFile = async (
  accessToken: string,
  fileId: string,
  records: Record[],
) => {
  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        ...authHeader(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records, lastSynced: new Date().toISOString() }),
    },
  );
  return handleResponse(res);
};

export const deleteFile = async (accessToken: string, fileId: string) => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: "DELETE",
      headers: authHeader(accessToken),
    },
  );
  return handleResponse(res);
};

// Call this on login it returns the cloud records if they exist
export const loadFromCloud = async (
  accessToken: string,
): Promise<{ records: Record[]; lastSynced: string } | null> => {
  const file = await getFileIfExists(accessToken);
  if (!file) return null;
  return readFile(accessToken, file.id);
};

// handle data changes locally
export const saveToCloud = async (
  accessToken: string,
  records: Record[],
): Promise<void> => {
  const file = await getFileIfExists(accessToken);
  if (file) {
    await updateFile(accessToken, file.id, records);
  } else {
    await createFile(accessToken, records);
  }
};
