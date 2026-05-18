import { Record } from "@/app/schemas/record.schema";
const fileName = "dafter-al-hesabat.json";
export const getFileIfExists = async (accessToken: string) => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name=${fileName}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const data = await res.json();
  return data.files?.[0] ?? null;
};

export const readFile = async (accessToken: string, fileId: string) => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return await res.json();
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
    new Blob([JSON.stringify(records)], { type: "application/json" }),
  );

  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body,
    },
  );
  return await res.json();
};
