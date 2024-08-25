import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, Alert } from 'react-native';
import { YStack, Text, Button, Input } from 'tamagui';
import { getFolders, createFolder } from '../../utils/storage';
import FolderComponent from '../../components/FolderComponent';

export default function NotesScreen() {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadFolders = async () => {
    try {
      const folderData = await getFolders();
      setFolders(folderData);
    } catch (error) {
      console.error('Error loading folders:', error);
      Alert.alert('Error', 'Failed to load folders. Please try again.');
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFolders();
    setRefreshing(false);
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder(newFolderName.trim());
        setNewFolderName('');
        await loadFolders();
        Alert.alert('Success', 'Folder created successfully');
      } catch (error) {
        console.error('Error creating folder:', error);
        Alert.alert('Error', 'Failed to create folder. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a folder name');
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <YStack padding="$4" space="$4">
        <Text fontSize="$6" fontWeight="bold">
          Notes
        </Text>
        <YStack flexDirection="row" space="$2">
          <Input
            flex={1}
            value={newFolderName}
            onChangeText={setNewFolderName}
            placeholder="New folder name"
          />
          <Button theme={"blue"} onPress={handleCreateFolder}>Create Folder</Button>
        </YStack>
        {folders.map((folder) => (
          <FolderComponent key={folder.id} folder={folder} onUpdate={loadFolders} />
        ))}
      </YStack>
    </ScrollView>
  );
}
