import type { ContainerClient } from '@azure/storage-blob';
import { BlobServiceClient } from '@azure/storage-blob';

const createBlobInContainer = async (
  containerClient: ContainerClient,
  file: FileList[0],
  fileName: string
) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(fileName);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
};
export const uploadFileToBlob = async (
  file: FileList[0],
  investorId: string
) => {
  const fileName = `${investorId}_${file.name}`;
  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${process.env.REACT_APP_STORAGENAME}.blob.core.windows.net/?${process.env.REACT_APP_STORAGESASTOKEN}`
  );

  // get Container - full public read access
  const containerClient = blobService.getContainerClient(
    process.env.REACT_APP_CONTAINERNAME!
  );
  // upload file
  await createBlobInContainer(containerClient, file, fileName);

  return fileName;
};
