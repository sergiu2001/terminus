import { storage } from '@/firebaseConfig';
import { ref, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const CACHE_KEY = 'cachedImages';

const checkCacheImage = async (folder: string, imageName: string) => {
    try {
        const cachePath = `${folder}/${imageName}.png`;

        // Load cache data
        const cachedImages = await AsyncStorage.getItem(CACHE_KEY);
        const cacheMap = cachedImages ? JSON.parse(cachedImages) : {};

        // Return cached path if available
        if (cacheMap[cachePath]) {
            const fileExists = await FileSystem.getInfoAsync(cacheMap[cachePath]);
            if (fileExists.exists) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error checking cache image:', error);
    }
    return null;
}

const getCachedImage = async (imageRef: any, folder: string, imageName: string) => {
    try {
        const cachePath = `${folder}/${imageName}.png`;
        const fileUri = `${FileSystem.documentDirectory}${cachePath.replace(/\//g, '_')}`;

        // Load cache data
        const cachedImages = await AsyncStorage.getItem(CACHE_KEY);
        const cacheMap = cachedImages ? JSON.parse(cachedImages) : {};

        // Return cached path if available
        if (cacheMap[cachePath]) {
            const fileExists = await FileSystem.getInfoAsync(cacheMap[cachePath]);
            if (fileExists.exists) {
                return cacheMap[cachePath];
            }
        }

        // Download image from Firebase
        const downloadUrl = await getDownloadURL(imageRef);
        const downloaded = await FileSystem.downloadAsync(downloadUrl, fileUri);

        if (downloaded.status === 200) {
            cacheMap[cachePath] = fileUri;
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheMap));
            return fileUri;
        }
    } catch (error) {
        console.error('Error caching image:', error);
    }
    return null;
};

export const downloadAvatarImage = async (imageName: string) => {
    try {
        const imageRef = ref(storage, `avatars/${imageName}.png`);
        if (await checkCacheImage('avatars', imageName)) {
            return await getCachedImage(imageRef, 'avatars', imageName);
        }
        const downloadUrl = await getDownloadURL(imageRef);

        return downloadUrl;
    } catch (error) {
        console.error('Error downloading image from Firebase Storage:', error);
        throw error;
    }
};

export const downloadOtherImage = async (imageName: string) => {
    try {
        const imageRef = ref(storage, `other/${imageName}.png`);
        if (await checkCacheImage('other', imageName)) {
            return await getCachedImage(imageRef, 'other', imageName);
        }
        const downloadUrl = await getDownloadURL(imageRef);

        return downloadUrl;
    } catch (error) {
        console.error('Error downloading image from Firebase Storage:', error);
        throw error;
    }
};

export const downloadAvatars = async () => {
    try {
        const imageListRef = ref(storage, 'avatars/');
        const list = await listAll(imageListRef);

        const downloadUrlList = await Promise.all(
            list.items.map(async (imageRef) => {
                const imageName = (await getMetadata(imageRef)).name;
                if (await checkCacheImage('avatars', imageName)) {
                    const localPath = await getCachedImage(imageRef, 'avatars', imageName);
                    return [localPath || '', imageName];;
                }
                const downloadUrl = await getDownloadURL(imageRef);

                return [downloadUrl, imageName];
            })
        );
        return downloadUrlList;
    } catch (error) {
        console.error('Error downloading images from Firebase Storage:', error);
        throw error;
    }
};


