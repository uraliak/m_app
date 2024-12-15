import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }: { navigation: any }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const loadEvents = async () => {
            const storedEvents = await AsyncStorage.getItem('events');
            if (storedEvents) {
                setEvents(JSON.parse(storedEvents));
            }
        };
        loadEvents();
    }, []);

    const handleDayPress = (day: any) => {
        setSelectedDate(day.dateString);
    };

    const eventsForSelectedDate = events.filter(
        (event) => event.date === selectedDate
    );

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: 'blue' },
                }}
            />

            <FlatList
                data={eventsForSelectedDate}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.event}>
                        <Text>{item.type}</Text>
                        <Text>{item.time}</Text>
                        <Text>{item.comment}</Text>
                    </View>
                )}
            />

            <Button
                title="Добавить событие"
                onPress={() =>
                    navigation.navigate('EventForm', { setEvents })
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    event: { marginBottom: 16 },
});

export default HomeScreen;
