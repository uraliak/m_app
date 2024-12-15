import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
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

    const getMarkedDates = () => {
        const marked: { [key: string]: any } = {};
        events.forEach((event) => {
            if (!marked[event.date]) {
                marked[event.date] = { marked: true, dotColor: 'red' };
            }
        });

        if (selectedDate) {
            marked[selectedDate] = {
                ...(marked[selectedDate] || {}),
                selected: true,
                selectedColor: 'blue',
            };
        }

        return marked;
    };

    const eventsForSelectedDate = events
        .filter((event) => event.date === selectedDate)
        .sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        });

    const deleteEvent = async (eventId: string) => {
        const updatedEvents = events.filter((event) => event.id !== eventId);
        setEvents(updatedEvents);
        await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    const confirmDelete = (eventId: string) => {
        Alert.alert(
            'Удалить событие',
            'Вы уверены, что хотите удалить это событие?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: () => deleteEvent(eventId),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={handleDayPress}
                markedDates={getMarkedDates()}
            />

            <FlatList
                data={eventsForSelectedDate}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.event}>
                        <View style={styles.eventInfo}>
                            <Text style={styles.eventType}>{item.type}</Text>
                            <Text style={styles.eventTime}>{item.time}</Text>
                            <Text style={styles.eventComment}>{item.comment}</Text>
                        </View>
                        <View style={styles.eventActions}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() =>
                                    navigation.navigate('EventForm', {
                                        eventToEdit: item,
                                        setEvents,
                                    })
                                }
                            >
                                <Text style={styles.buttonText}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => confirmDelete(item.id)}
                            >
                                <Text style={styles.buttonText}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <Button
                title="Добавить событие"
                onPress={() =>
                    navigation.navigate('EventForm', {
                        setEvents,
                        defaultDate: selectedDate || new Date().toISOString().split('T')[0],
                    })
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    event: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    eventInfo: { flex: 3 },
    eventType: { fontSize: 16, fontWeight: 'bold' },
    eventTime: { fontSize: 14, color: 'gray' },
    eventComment: { fontSize: 14, color: '#555' },
    eventActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    editButton: {
        marginRight: 8,
        padding: 8,
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    deleteButton: {
        padding: 8,
        backgroundColor: '#F44336',
        borderRadius: 4,
    },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
