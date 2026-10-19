/**
 * Cloudinary image upload utility for DumDum Delivery
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "mtyahieb";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "dumdum_store_uploads";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Upload an image file or base64 data URL to Cloudinary
 * @param file File object or base64 string
 * @param folder Optional custom subfolder
 */
export async function uploadImageToCloudinary(
  file: File | Blob | string,
  folder = "dumdum_delivery/stores"
): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Failed to upload image to Cloudinary (Status ${response.status})`
    );
  }

  const data: CloudinaryUploadResponse = await response.json();
  return data.secure_url;
}
