// src/screens/EventFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

const EventFormScreen = ({ route, navigation }: any) => {
    const { setEvents, event } = route.params || {};
    const [date, setDate] = useState(event ? new Date(event.datetime) : new Date());
    const [time, setTime] = useState(event ? dayjs(event.datetime).format('HH:mm') : '12:00');
    const [type, setType] = useState(event ? event.type : '');
    const [comment, setComment] = useState(event ? event.comment : '');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (event) {
            setDate(new Date(event.datetime));
            setTime(dayjs(event.datetime).format('HH:mm'));
            setType(event.type);
            setComment(event.comment);
        }
    }, [event]);

    const handleSubmit = () => {
        if (!date || !time || !type) {
            Alert.alert('Ошибка', 'Дата, время и тип события обязательны');
            return;
        }

        const datetime = dayjs(`${dayjs(date).format('YYYY-MM-DD')} ${time}`).format();
        const newEvent = { id: event ? event.id : Date.now().toString(), datetime, type, comment };

        if (event) {
            setEvents((prev: any) =>
                prev.map((ev: Event) => (ev.id === event.id ? newEvent : ev))
            );
        } else {
            setEvents((prev: any) => [...prev, newEvent]);
        }

        navigation.goBack();
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
            setTime(dayjs(selectedTime).format('HH:mm'));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Дата:</Text>
            <Button title={`Выбрать дату (${dayjs(date).format('DD.MM.YYYY')})`} onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.label}>Время:</Text>
            <Button title={`Выбрать время (${time})`} onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker
                    value={new Date(`${dayjs(date).format('YYYY-MM-DD')}T${time}:00`) }
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
