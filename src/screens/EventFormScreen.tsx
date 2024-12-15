import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';  // Импортируйте Picker

const EventFormScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const { eventToEdit, defaultDate } = route.params || {};
    const [date, setDate] = useState<Date | null>(
        eventToEdit ? new Date(eventToEdit.date) : new Date(defaultDate || Date.now())
    );
    const [time, setTime] = useState(eventToEdit?.time || '');
    const [type, setType] = useState(eventToEdit?.type || '');
    const [comment, setComment] = useState(eventToEdit?.comment || '');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Используем useEffect для обновления параметров экрана
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Сохранить"
                    onPress={saveEvent}
                />
            ),
        });
    }, [navigation]);

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
                const updatedEvents = events.map((event: any) =>
                    event.id === eventToEdit.id ? newEvent : event
                );
                await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
                navigation.goBack();
            } else {
                const updatedEvents = [...events, newEvent];
                await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось сохранить событие.');
        }
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setTime(selectedTime.toLocaleTimeString());
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Дата</Text>
            <Button
                title={date ? date.toISOString().split('T')[0] : 'Выберите дату'}
                onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.label}>Время</Text>
            <Button
                title={time || 'Выберите время'}
                onPress={() => setShowTimePicker(true)}
            />
            {showTimePicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTimeChange}
                />
            )}

            <Text style={styles.label}>Тип события</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={type}
                    onValueChange={(itemValue) => setType(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Выберите тип события" value="" />
                    <Picker.Item label="Встреча с клиентом" value="meeting" />
                    <Picker.Item label="Показ" value="show" />
                    <Picker.Item label="Запланированный звонок" value="call" />
                </Picker>
            </View>

            <Text style={styles.label}>Комментарий</Text>
            <TextInput
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                placeholder="Введите комментарий (необязательно)"
            />
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 8,
    },
    picker: {
        height: 50,
        width: '100%',
    },
});

export default EventFormScreen;
