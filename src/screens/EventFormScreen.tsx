import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventFormScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const { setEvents, defaultDate, eventToEdit } = route.params || {};

    const [date, setDate] = useState<Date | null>(
        eventToEdit ? new Date(eventToEdit.date) : new Date(defaultDate || Date.now())
    );
    const [time, setTime] = useState(eventToEdit?.time || '');
    const [type, setType] = useState(eventToEdit?.type || '');
    const [comment, setComment] = useState(eventToEdit?.comment || '');

    useEffect(() => {
        if (isNaN(date?.getTime() || 0)) {
            setDate(new Date());
        }
    }, [date]);

    const saveEvent = async () => {
        if (!date || !time || !type) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
            return;
        }

        const newEvent = {
            id: eventToEdit?.id || Date.now().toString(),
            date: date.toISOString().split('T')[0],
            time,
            type,
            comment,
        };

        try {
            const storedEvents = await AsyncStorage.getItem('events');
            const events = storedEvents ? JSON.parse(storedEvents) : [];

            if (eventToEdit) {
                // Редактирование события
                const updatedEvents = events.map((event: any) =>
                    event.id === eventToEdit.id ? newEvent : event
                );
                await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
                setEvents(updatedEvents);
            } else {
                // Создание нового события
                const updatedEvents = [...events, newEvent];
                await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
                setEvents(updatedEvents);
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось сохранить событие.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Дата</Text>
            <Button
                title={date ? date.toISOString().split('T')[0] : 'Выберите дату'}
                onPress={() => {
                    const newDate = prompt('Введите дату (в формате YYYY-MM-DD):');
                    if (newDate) {
                        const parsedDate = new Date(newDate);
                        if (!isNaN(parsedDate.getTime())) {
                            setDate(parsedDate);
                        } else {
                            Alert.alert('Ошибка', 'Некорректная дата.');
                        }
                    }
                }}
            />

            <Text style={styles.label}>Время</Text>
            <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="Введите время (например, 14:00)"
            />

            <Text style={styles.label}>Тип события</Text>
            <TextInput
                style={styles.input}
                value={type}
                onChangeText={setType}
                placeholder="Введите тип события"
            />

            <Text style={styles.label}>Комментарий</Text>
            <TextInput
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                placeholder="Введите комментарий (необязательно)"
            />

            <Button title="Сохранить событие" onPress={saveEvent} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginTop: 8,
    },
});

export default EventFormScreen;
