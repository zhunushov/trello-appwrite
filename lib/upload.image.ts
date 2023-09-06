import { storage, ID } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    "64ed4f9d7910ff4bf180",
    ID.unique(),
    file
  );

  return fileUploaded;
};
export default uploadImage;
