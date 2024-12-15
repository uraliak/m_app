// src/screens/EventFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventFormScreen = ({ route, navigation }: any) => {
    const { setEvents, event } = route.params || {};
    const [datetime, setDatetime] = useState(event ? new Date(event.datetime) : new Date());
    const [type, setType] = useState(event ? event.type : '');
    const [comment, setComment] = useState(event ? event.comment : '');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        if (selectedDate) setDatetime(new Date(selectedDate));
    };

    const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
        setShowTimePicker(false);
        if (selectedDate) setDatetime(new Date(datetime.setHours(selectedDate.getHours(), selectedDate.getMinutes())));
    };

    const handleSubmit = async () => {
        if (!datetime || !type) {
            Alert.alert('Ошибка', 'Дата-время и тип события обязательны');
            return;
        }

        const newEvent = { id: event ? event.id : Date.now().toString(), datetime: datetime.toISOString(), type, comment };

        let events = [];
        try {
            const storedEvents = await AsyncStorage.getItem('events');
            if (storedEvents) {
                events = JSON.parse(storedEvents);
            }
        } catch (error) {
            console.error('Ошибка при загрузке событий из хранилища:', error);
        }

        if (event) {
            events = events.map((ev: any) => (ev.id === event.id ? newEvent : ev));
        } else {
            events.push(newEvent);
        }

        try {
            await AsyncStorage.setItem('events', JSON.stringify(events));
        } catch (error) {
            console.error('Ошибка при сохранении событий:', error);
        }

        setEvents(events);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Дата:</Text>
            <Button title="Выбрать дату" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={datetime}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.label}>Время:</Text>
            <Button title="Выбрать время" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker
                    value={datetime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <Text style={styles.label}>Тип события:</Text>
            <Picker selectedValue={type} onValueChange={setType} style={styles.input}>
                <Picker.Item label="Выберите тип события" value="" />
                <Picker.Item label="Встреча с клиентом" value="Встреча с клиентом" />
                <Picker.Item label="Показ" value="Показ" />
                <Picker.Item label="Запланированный звонок" value="Запланированный звонок" />
            </Picker>

            <Text style={styles.label}>Комментарий:</Text>
            <TextInput
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                placeholder="Введите комментарий"
            />

            <Button title={event ? "Сохранить изменения" : "Сохранить"} onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 16 },
});

export default EventFormScreen;
