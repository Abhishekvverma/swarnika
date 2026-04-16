import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import app  from "./config";

const storage = getStorage(app);

export const uploadImage = async (
  file: Blob,
  fileName: string
): Promise<string> => {
  const storageRef = ref(storage, `products/${fileName}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export { storage };
