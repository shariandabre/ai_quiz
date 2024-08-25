
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { YStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { getQuizData, saveQuizData } from '../../utils/storage';
import ChartComponent from '../../components/ChartComponent';

export default function HomeScreen() {
  const [quizData, setQuizData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadQuizData = async () => {
    const data = await getQuizData();
    setQuizData(data);
  };

  useEffect(() => {
    loadQuizData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuizData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <YStack padding="$4" space="$4">
        <Text fontSize="$6" fontWeight="bold">
          Quiz Performance
        </Text>
        <ChartComponent data={quizData} />

      </YStack>
    </ScrollView>
  );
}
