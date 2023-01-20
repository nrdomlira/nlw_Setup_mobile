import { View, Text, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { api } from '../libs/axios';
import dayjs from "dayjs";

import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps = Array<{
    id: string;
    date: Date;
    amount: number;
    completed: number;
}>

export function Home() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps | null>(null);
    const { navigate } = useNavigation();


    async function fetchData() {
        try {
            setLoading(true)
          /*   api.interceptors.request.use(request => {
                console.log('Starting Request', JSON.stringify(request, null, 2))
                return request
            }) */
            const response = await api.get('/summary');
            console.log(response.data);
            setSummary(response.data);

        } catch (error) {
            Alert.alert('Ops', "Não foi possivel carregar o sumário de hábitos.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (!loading) {
        return (
            <Loading />
        );
    }


    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: DAY_SIZE }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {
                    summary &&
                    <View className="flex-row flex-wrap">
                        {
                            datesFromYearStart.map(date => {
                                const dayWithHabits = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })

                                return (
                                    <HabitDay
                                        key={date.toISOString()}
                                        amountCompleted={dayWithHabits?.completed}
                                        amountOfHabits={dayWithHabits?.amount}
                                        date={date}
                                        onPress={() => navigate('habit', { date: date.toISOString() })}
                                    />
                                )
                            })
                        }
                        {
                            amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                                <View
                                    key={i}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                />
                            ))
                        }
                    </View>
                }
            </ScrollView>

        </View>
    )
}