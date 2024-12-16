import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

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

    const handleDeleteEvent = async (eventId: string) => {
        Alert.alert(
            'Удаление события',
            'Вы уверены, что хотите удалить это событие?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedEvents = events.filter((event) => event.id !== eventId);
                        setEvents(updatedEvents);
                        await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
                    },
                },
            ]
        );
    };

    const handleEditEvent = (event: any) => {
        navigation.navigate('EventForm', {
            event,
            setEvents,
            defaultDate: selectedDate || new Date().toISOString().split('T')[0],
        });
    };

    const eventsForSelectedDate = events
        .filter((event) => event.date === selectedDate)
        .sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        });

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
                        <View style={{ flex: 1 }}>
                            <Text style={styles.eventText}>{item.type}</Text>
                            <Text style={styles.eventText}>{item.time}</Text>
                            <Text style={styles.eventComment}>{item.comment}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleEditEvent(item)} style={styles.iconButton}>
                            <Icon name="pencil" size={24} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteEvent(item.id)} style={styles.iconButton}>
                            <Icon name="trash" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Button
                title="Добавить событие"
                onPress={() => {
                    navigation.navigate('EventForm', {
                        setEvents,
                        defaultDate: selectedDate || new Date().toISOString().split('T')[0],
                    })
                }
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    event: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    eventText: { fontSize: 16 },
    eventComment: { fontSize: 12, color: 'gray' },
    iconButton: { marginLeft: 8 },
});

export default HomeScreen;
