import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { format } from 'date-fns';
import { clearQuizData } from '~/utils/storage';

const { width } = Dimensions.get('window');

export default function ChartComponent({ data }) {
  // Data for Line Chart (score over time)
  const lineChartData = data.map(quiz => ({
    value: quiz.score,
    label: format(new Date(quiz.date), 'MM/dd'),
  }));

  // Data for Bar Chart (number of quizzes per day)
  const quizCountByDate = data.reduce((acc, quiz) => {
    const date = format(new Date(quiz.date), 'MM/dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(quizCountByDate).map(([date, count]) => ({
    value: count,
    label: date,
  }));

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Quiz Scores Over Time</Text>
      <LineChart
        data={lineChartData}
        width={width - 40}
        height={220}
        spacing={40}
        initialSpacing={10}
        color="#00ff00"
        thickness={2}
        startFillColor="rgba(0, 255, 0, 0.3)"
        endFillColor="rgba(0, 255, 0, 0.01)"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={6}
        maxValue={10}
        yAxisColor="lightgray"
        yAxisThickness={1}
        rulesType="solid"
        rulesColor="lightgray"
        yAxisTextStyle={{ color: 'gray' }}
        xAxisColor="lightgray"
        xAxisThickness={1}
        xAxisTextStyle={{ color: 'gray' }}
      />

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 10 }}>Number of Quizzes Taken Per Day</Text>
      <BarChart
        data={barChartData}
        width={width - 40}
        height={220}
        spacing={40}
        initialSpacing={10}
        barWidth={20}
        noOfSections={5}
        barBorderRadius={4}
        frontColor="#0077be"
        yAxisColor="lightgray"
        yAxisThickness={1}
        yAxisTextStyle={{ color: 'gray' }}
        xAxisColor="lightgray"
        xAxisThickness={1}
        xAxisTextStyle={{ color: 'gray' }}
        rulesColor="lightgray"
        rulesType="solid"
      />
    </View>
  );
}
