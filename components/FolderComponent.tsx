import React, { useState } from 'react';
import { Alert } from 'react-native';
import { YStack, Text, Button, Input, Accordion, XStack, Dialog } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { deleteFolder, createFile, getFolders, getQuizData } from '../utils/storage';
import { generateQuiz } from '../utils/gemini';
import FileComponent from './FileComponent';
import QuizComponent from './QuizComponent';

export default function FolderComponent({ folder, onUpdate }) {
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleDelete = async () => {
    Alert.alert(
      'Delete Folder',
      `Are you sure you want to delete "${folder.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            deleteFolder(folder.id);
            onUpdate();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleCreateFile = async () => {
    setIsCreateFileDialogOpen(true);
  };

  const handleCreateFileSubmit = async () => {
    if (newFileName.trim()) {
      await createFile(folder.id, newFileName.trim(), '');
      setIsCreateFileDialogOpen(false);
      setNewFileName('');
      onUpdate();
    } else {
      Alert.alert('Error', 'File name cannot be empty');
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const folders = await getFolders();
      const currentFolder = folders.find(f => f.id === folder.id);
      const content = currentFolder.files.map(file => file.content).join('\n\n');

      const quiz = await generateQuiz(content);

      if (quiz) {
        setGeneratedQuiz(quiz);
      } else {
        Alert.alert('Error', 'Failed to generate quiz. Please try again.');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      Alert.alert('Error', 'An error occurred while generating the quiz.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <>
      <Accordion type="multiple" defaultValue={[]} width="100%">
        <Accordion.Item value={folder.id}>
          <Accordion.Trigger flexDirection="row" justifyContent="space-between">
            {({ open }) => (
              <XStack flex={1} alignItems="center" justifyContent="space-between">
                <Text fontSize="$5" fontWeight="bold">{folder.name}</Text>
                <XStack space="$2">
                  <Button size="$2" onPress={handleCreateFile} icon={<Ionicons name="add" size={16} />} />
                  <Button size="$2" onPress={handleGenerateQuiz} icon={<Ionicons name="create" size={16} />} />
                  <Button size="$2" onPress={handleDelete} icon={<Ionicons name="trash" size={16} />} />
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} />
                </XStack>
              </XStack>
            )}
          </Accordion.Trigger>
          <Accordion.Content>
            <YStack space="$2" paddingLeft="$4">
              {folder.files.map((file) => (
                <FileComponent key={file.id} folderId={folder.id} file={file} onUpdate={onUpdate} />
              ))}
            </YStack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      <Dialog
        modal
        open={isCreateFileDialogOpen}
        onOpenChange={setIsCreateFileDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            space
          >
            <Dialog.Title>Create New File</Dialog.Title>
            <Dialog.Description>
              Enter a name for the new file
            </Dialog.Description>
            <Input
              placeholder="File name"
              value={newFileName}
              onChangeText={setNewFileName}
            />
            <XStack space="$3" justifyContent="flex-end">
              <Dialog.Close asChild>
                <Button theme="alt1">Cancel</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button theme="active" onPress={handleCreateFileSubmit}>Create</Button>
              </Dialog.Close>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Dialog modal open={isGeneratingQuiz} onOpenChange={setIsGeneratingQuiz}>
        <Dialog.Portal>
          <Dialog.Content>
            <Text>Generating Quiz...</Text>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      {generatedQuiz && (
        <QuizComponent
          quiz={generatedQuiz}
          onClose={() => setGeneratedQuiz(null)}
        />
      )}
    </>
  );
}
