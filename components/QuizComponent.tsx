import React, { useState } from 'react';
import { YStack, Text, Button, Sheet, RadioGroup, XStack, Label, ScrollView } from 'tamagui';
import { saveQuizData, getQuizData } from '../utils/storage';

export default function QuizComponent({ quiz, onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNext = async () => {
    const isCorrect = userAnswer === currentQuestion.answer;
    const newResults = [...results, {
      question: currentQuestion.question,
      userAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect
    }];
    setResults(newResults);
    setScore(prevScore => isCorrect ? prevScore + 1 : prevScore);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
    } else {
      setQuizCompleted(true);
      setIsLoading(true);
      try {
        const quizResults = {
          quizTitle: quiz.title,
          results: newResults,
          score: isCorrect ? score + 1 : score,
          totalQuestions: quiz.questions.length,
          date: new Date().toISOString()
        };
        const existingData = await getQuizData();
        await saveQuizData([...existingData, quizResults]);
      } catch (error) {
        console.error('Error saving quiz results:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setQuizCompleted(false);
    setResults([]);
    setScore(0);
  };

  return (
    <Sheet modal open={true} onOpenChange={onClose} snapPoints={[90]}>
      <Sheet.Frame padding="$4">
        <YStack space="$4" flex={1}>
          {isLoading ? (
            <YStack alignItems="center" justifyContent="center" flex={1}>
              <Text>Saving quiz results...</Text>
            </YStack>
          ) : quizCompleted ? (
            <ScrollView>
              <YStack space="$4" flex={1}>
                <Text fontSize="$5" fontWeight="bold">Quiz Completed!</Text>
                <Text fontSize="$4">Your Score: {score} / {quiz.questions.length}</Text>
                {results.map((result, index) => (
                  <YStack key={index} space="$2">
                    <Text>Question: {result.question}</Text>
                    <Text>Your Answer: {result.userAnswer}</Text>
                    <Text>Correct Answer: {result.correctAnswer}</Text>
                    <Text color={result.isCorrect ? "$green10" : "$red10"}>
                      {result.isCorrect ? "Correct" : "Incorrect"}
                    </Text>
                  </YStack>
                ))}
                <YStack flex={1} gap="$2" justifyContent="flex-end">
                  <Button onPress={handleRestart}>Restart Quiz</Button>
                  <Button onPress={onClose}>Close</Button>
                </YStack>
              </YStack>
            </ScrollView>
          ) : (
            <YStack gap="$5" flex={1}>
              <Text fontSize="$5" fontWeight="bold">{quiz.title}</Text>
              <YStack gap="$2" flex={1}>
                <Text fontSize="$5">{currentQuestion.question}</Text>
                <RadioGroup gap="$2" value={userAnswer} onValueChange={setUserAnswer}>
                  {currentQuestion.options.map((option, index) => (
                    <XStack key={index} alignItems="center" space="$2">
                      <RadioGroup.Item value={option} id={`option-${index}`}>
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </XStack>
                  ))}
                </RadioGroup>
                <YStack flex={1} justifyContent="flex-end">
                  <Button
                    onPress={handleNext}
                    disabled={!userAnswer}
                  >
                    {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish'}
                  </Button>
                </YStack>
              </YStack>
            </YStack>
          )}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
