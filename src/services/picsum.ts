
import { QueryClient } from "@tanstack/react-query";

export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface EditedImage {
  id: string;
  width: number;
  height: number;
  grayscale: boolean;
  blur: number;
}

export const fetchImages = async (page: number = 1, limit: number = 12): Promise<PicsumImage[]> => {
  const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  return response.json();
};

export const getImageUrl = (id: string, width: number = 400, height: number = 300, grayscale: boolean = false, blur: number = 0): string => {
  let url = `https://picsum.photos/id/${id}/${width}/${height}`;
  
  const params = [];
  if (grayscale) params.push('grayscale');
  if (blur > 0) params.push(`blur=${blur}`);
  
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  
  return url;
};

export const prefetchImageDetail = (queryClient: QueryClient, id: string) => {
  const cachedData = localStorage.getItem(`edited-image-${id}`);
  
  if (cachedData) {
    queryClient.setQueryData(['image', id], JSON.parse(cachedData));
  }
};

export const saveEditedImage = (editedImage: EditedImage) => {
  localStorage.setItem(`edited-image-${editedImage.id}`, JSON.stringify(editedImage));
};

export const getEditedImage = (id: string): EditedImage | null => {
  const cachedData = localStorage.getItem(`edited-image-${id}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
};
