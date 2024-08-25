import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const clearQuizData = () => {
  storage.delete('quizData');
};

// Quiz data
export const getQuizData = () => {
  const quizData = storage.getString('quizData');
  return quizData ? JSON.parse(quizData) : [];
};

export const saveQuizData = (quizData) => {
  storage.set('quizData', JSON.stringify(quizData));
};

// Folders and files
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getFolders = () => {
  try {
    const folders = storage.getString('folders');
    return folders ? JSON.parse(folders) : [];
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
};

export const saveFolders = (folders) => {
  try {
    storage.set('folders', JSON.stringify(folders));
  } catch (error) {
    console.error('Error saving folders:', error);
    throw error;
  }
};

export const createFolder = (name) => {
  try {
    const folders = getFolders();
    const newFolder = { id: generateId(), name, files: [] };
    folders.push(newFolder);
    saveFolders(folders);
    return newFolder;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

export const deleteFolder = (folderId) => {
  const folders = getFolders();
  const updatedFolders = folders.filter((folder) => folder.id !== folderId);
  saveFolders(updatedFolders);
};

export const createFile = (folderId, name, content) => {
  const folders = getFolders();
  const folder = folders.find((f) => f.id === folderId);
  if (folder) {
    folder.files.push({ id: generateId(), name, content });
    saveFolders(folders);
  }
};


export const updateFile = (folderId, fileId, content) => {
  console.log(folderId, fileId);
  const folders = getFolders();
  const folderIndex = folders.findIndex((f) => f.id === folderId);
  console.log("Folder Index:", folderIndex);
  if (folderIndex !== -1) {
    const fileIndex = folders[folderIndex].files.findIndex((f) => f.id === fileId);
    console.log("File Index:", fileIndex);
    if (fileIndex !== -1) {
      folders[folderIndex].files[fileIndex].content = content;
      saveFolders(folders);
    } else {
      console.log("File not found");
    }
  } else {
    console.log("Folder not found");
  }
};
export const deleteFile = (folderId, fileId) => {
  console.log(folderId, fileId);
  const folders = getFolders();
  const folderIndex = folders.findIndex((f) => f.id === folderId);
  console.log("Folder Index:", folderIndex);
  if (folderIndex !== -1) {
    folders[folderIndex].files = folders[folderIndex].files.filter((f) => f.id !== fileId);
    saveFolders(folders);
  } else {
    console.log("Folder not found");
  }
};
