"use client";
import {
  deleteFile,
  getFileIfExists,
  readFile,
  saveToCloud,
} from "@/lib/googleDrive";
import { useTokenStore } from "../stores/tokenStore";
import { useRecordStore } from "../stores/recordStore";
import { Button } from "@mui/material";
import { authClient } from "@/lib/authClient";
import { notFound } from "next/navigation";
import { isLoggedIn } from "@/lib/utils";

const page = () => {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  const { data: session } = authClient.useSession();

  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const accessToken = useTokenStore((state) => state.accessToken);
  let id = "";
  const handleGetFile = async () => {
    if (isLoggedIn(session)) {
      const latestRecords = useRecordStore.getState().records;
      await saveToCloud(latestRecords);
    }
  };
  const handleDeleteFile = async () => {
    const fileExist = await getFileIfExists(accessToken);

    if (fileExist) {
      const id = fileExist.id;
      deleteFile(accessToken, id);
      console.log(`The file with id of ${id} is deleted`);
    } else console.log("File is not exist");
  };
  const handleRetrieve = async () => {
    if (!!accessToken) {
      const { data } = await authClient.getAccessToken({
        providerId: "google",
      });
      setAccessToken(data?.accessToken || "");
    }
    const fileExist = await getFileIfExists(accessToken);
    if (fileExist) {
      id = fileExist.id;
      const resp = await readFile(accessToken || "", id);
      console.log(resp);
    }
  };
  return (
    <>
      <Button
        variant="outlined"
        className="mt-5 w-auto"
        onClick={handleGetFile}
      >
        Get file if exists
      </Button>
      <Button
        variant="outlined"
        className="mt-5 w-auto"
        onClick={handleDeleteFile}
      >
        Delete file if exist
      </Button>
      <Button
        variant="outlined"
        className="mt-5 w-auto"
        onClick={handleRetrieve}
      >
        retrieve the file{" "}
      </Button>
    </>
  );
};

export default page;
