"use client";
import { createFile, readFile } from "@/lib/google-drive";
import { useTokenStore } from "../stores/tokenStore";
import { useRecordStore } from "../stores/recordStore";
import { Button } from "@mui/material";
import { authClient } from "@/lib/auth-client";

const page = () => {
  const requestGoogleDriveAccess = async () => {
    await authClient.linkSocial({
      provider: "google",
      scopes: ["https://www.googleapis.com/auth/drive.appdata"],
    });
  };
  let id = "";
  const accessToken = useTokenStore((state) => state.accessToken);
  const records = useRecordStore((state) => state.records);
  const handleClick = async () => {
    const resp = await createFile(accessToken, records);
    id = resp.id;
    console.log(id);
  };
  const handleRetrieve = async () => {
    const { data } = await authClient.getAccessToken({
      providerId: "google",
    });
    const resp = await readFile(data?.accessToken || "", id);
    console.log(resp);
  };
  return (
    <>
      <Button variant="outlined" className="mt-5 w-auto" onClick={handleClick}>
        Fire function
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
