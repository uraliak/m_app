// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const storedEvents = await AsyncStorage.getItem('events');
                if (storedEvents) {
                    setEvents(JSON.parse(storedEvents));
                }
            } catch (error) {
                console.error('Ошибка при загрузке событий:', error);
            }
        };
        loadEvents();
    }, []);

    const handleDayPress = (day: any) => {
        setSelectedDate(day.dateString);
    };

    const eventsForSelectedDay = events.filter(
        (event: any) => event.datetime.startsWith(selectedDate)
    );

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: 'blue' }
                }}
            />

            <FlatList
                data={eventsForSelectedDay}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.event}>
                        <Text>{item.type}</Text>
                        <Text>{item.datetime}</Text>
                        <Text>{item.comment}</Text>
                    </View>
                )}
            />

            <Button title="Добавить событие" onPress={() => navigation.navigate('EventFormScreen')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    event: { marginBottom: 16 },
});

export default HomeScreen;
