import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface ArtWorkStore {
  folders: Record<string, unknown>;
  images: any[]; // Thêm khai báo cho images
  getAllParentFolders: (onSuccess?: (data: any) => void, onFail?: (data: any) => void) => void;
  loading: boolean;
  createParentFolders: (onSuccess: (data: any) => void, onFail: (data: any) => void, body: any) => void;
  getAllFromFolder: (onSuccess: (data: any) => void, onFail: (data: any) => void, id: number, page:number) => void;
  createImage: (onSuccess: (data: any) => void, onFail: (data: any) => void, id: number, body: any) => void;
  resetImages: () => void;
}

export const useFolderImageStore = create<ArtWorkStore>((set)=>({
  folders:{},
  loading: false,
  images: [], // Khởi tạo mảng images
  getAllParentFolders: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.artwork.getAllParentFolder();
      console.log("resfor art",response?.data)
      set({ folders: response?.data });
      onSuccess?.(response?.data);
    } catch (error) {
      onFail?.(handleAxiosError(error));
    } finally {
      set({ loading: false });
    }
  },
  createParentFolders: async (onSuccess, onFail, body) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.artwork.createParentFolder(body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    } finally {
      set({ loading: false });
    }
  },
  getAllFromFolder: async (onSuccess, onFail, id,page) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.artwork.getAllImage(id,page);
      console.log("resss", response);
      set((state) => ({ images: [...state.images, ...response?.data.data.images] }));
    
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    } finally {
      set({ loading: false });
    }
  },
  createImage: async (onSuccess, onFail, id, body) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.artwork.createImage(id, body);
      console.log("resss", response);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    } finally {
      set({ loading: false });
    }
  },
  resetImages:()=>{
    set({images:[]})
  }
}));
