// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

interface Event {
    id: string;
    datetime: string;
    duration?: string;
    type: string;
    comment?: string;
}

const HomeScreen = ({ navigation }: any) => {
    const [events, setEvents] = useState<Event[]>([
        {
            id: '1',
            datetime: dayjs().format('YYYY-MM-DD HH:mm'),
            type: 'Встреча с клиентом',
            comment: 'Обсудить новый объект',
        },
    ]);

    const deleteEvent = (id: string) => {
        setEvents(events.filter(event => event.id !== id));
    };

    const editEvent = (event: Event) => {
        navigation.navigate('EventForm', { event, setEvents });
    };

    const renderEvent = ({ item }: { item: Event }) => (
        <View style={styles.eventCard}>
            <Text style={styles.eventText}>Тип: {item.type}</Text>
            <Text style={styles.eventText}>Дата-время: {item.datetime}</Text>
            {item.comment && <Text style={styles.eventText}>Комментарий: {item.comment}</Text>}
            <Button title="Удалить" onPress={() => deleteEvent(item.id)} color="red" />
            <Button title="Редактировать" onPress={() => editEvent(item)} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={item => item.id}
                renderItem={renderEvent}
            />
            <Button title="Добавить событие" onPress={() => navigation.navigate('EventForm', { setEvents })} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    eventCard: { marginBottom: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 },
    eventText: { fontSize: 16, marginBottom: 8 },
});

export default HomeScreen;
