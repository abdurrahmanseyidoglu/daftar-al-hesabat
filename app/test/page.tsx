"use client";
import {
  createFile,
  deleteFile,
  getFileIfExists,
  readFile,
} from "@/lib/google-drive";
import { useTokenStore } from "../stores/tokenStore";
import { useRecordStore } from "../stores/recordStore";
import { Button } from "@mui/material";
import { authClient } from "@/lib/auth-client";

const page = () => {
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const accessToken = useTokenStore((state) => state.accessToken);
  let id = "";
  const records = useRecordStore((state) => state.records);
  const handleGetFile = async () => {
    const fileExist = await getFileIfExists(accessToken);
    if (fileExist) {
      id = fileExist.id;
    } else {
      const resp = await createFile(accessToken, records);
      id = resp.id;
      console.log(id);
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
