import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { YStack, Text, Button, TextArea, Sheet, XStack, Separator, Avatar } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { deleteFile, updateFile } from '../utils/storage';
import Markdown from 'react-native-markdown-display';

export default function FileComponent({ file, folderId, onUpdate }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [content, setContent] = useState(file.content);
  const [showPreview, setShowPreview] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${file.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            deleteFile(folderId, file.id);
            onUpdate();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSave = async () => {
    await updateFile(folderId, file.id, content);
    setSheetOpen(false);
    onUpdate();
  };

  const getFileIcon = () => {
    const extension = file.name.split('.').pop().toLowerCase();
    switch (extension) {
      case 'md': return 'document-text';
      case 'txt': return 'document';
      case 'pdf': return 'document-attach';
      default: return 'document';
    }
  };

  return (
    <YStack
      space="$2"
      backgroundColor="$backgroundStrong"
      padding="$4"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <XStack alignItems="center" space="$3">
        <Avatar circular size="$4" backgroundColor="$blue8">
          <Avatar.Image source={{ uri: `https://ui-avatars.com/api/?name=${file.name}&background=random` }} />
          <Avatar.Fallback backgroundColor="$blue8">
            <Ionicons name={getFileIcon()} size={24} color="white" />
          </Avatar.Fallback>
        </Avatar>
        <Text fontSize="$4" fontWeight="bold" flex={1} numberOfLines={1} ellipsizeMode="tail">
          {file.name}
        </Text>
        <Button
          size="$3"
          circular
          onPress={() => setSheetOpen(true)}
          icon={<Ionicons name="pencil" size={16} />}
        />
        <Button
          size="$3"
          circular
          onPress={handleDelete}
          icon={<Ionicons name="trash" size={16} />}
        />
      </XStack>

      <Sheet
        modal
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        snapPoints={[90]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4" space>
          <Sheet.Handle />
          <YStack space="$4">
            <Text fontSize="$6" fontWeight="bold">Edit {file.name}</Text>
            <Separator />
            <XStack space="$2">
              <Button
                flex={1}
                onPress={() => setShowPreview(false)}
                theme={showPreview ? "alt2" : "active"}
                icon={<Ionicons name="create" size={16} />}
              >
                Edit
              </Button>
              <Button
                flex={1}
                onPress={() => setShowPreview(true)}
                theme={showPreview ? "active" : "alt2"}
                icon={<Ionicons name="eye" size={16} />}
              >
                Preview
              </Button>
            </XStack>
          </YStack>
          {showPreview ? (
            <ScrollView style={{ flex: 1, marginTop: 16 }}>
              <Markdown>{content}</Markdown>
            </ScrollView>
          ) : (
            <TextArea
              flex={1}
              value={content}
              onChangeText={setContent}
              placeholder="Write your note in Markdown"
              marginTop="$4"
              minHeight={200}
            />
          )}
          <Button
            onPress={handleSave}
            marginTop="$4"
            theme="active"
            icon={<Ionicons name="save" size={16} />}
          >
            Save
          </Button>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}
