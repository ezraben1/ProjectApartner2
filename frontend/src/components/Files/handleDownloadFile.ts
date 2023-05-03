import api from "../../utils/api";


export const handleDownloadFile = async (
  downloadEndpoint: string,
  fileId: string,
  fileType: string,
  fileExtension?: string
) => {
  try {
    const blob = await api.getBlob(downloadEndpoint);
    if (blob.size === 0) {
      throw new Error('Empty file');
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${fileType}_${fileId}${fileExtension ? '.' + fileExtension : ''}`
    );
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

