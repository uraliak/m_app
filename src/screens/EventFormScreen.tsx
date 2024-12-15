import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventFormScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const { event, setEvents } = route.params || {};
    const [date, setDate] = useState(event ? new Date(event.date) : new Date());
    const [time, setTime] = useState(event ? new Date(event.time) : new Date());
    const [type, setType] = useState(event ? event.type : '');
    const [comment, setComment] = useState(event ? event.comment : '');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleSaveEvent = async () => {
        if (!type) {
            Alert.alert('Ошибка', 'Тип события обязателен.');
            return;
        }

        const newEvent = {
            id: event ? event.id : Date.now().toString(),
            date: date.toISOString().split('T')[0], // Только дата
            time: time.toISOString().split('T')[1].substring(0, 5), // Только время
            type,
            comment,
        };

        const storedEvents = (await AsyncStorage.getItem('events')) || '[]';
        const parsedEvents = JSON.parse(storedEvents);

        if (event) {
            // Обновление события
            const updatedEvents = parsedEvents.map((ev: any) =>
                ev.id === event.id ? newEvent : ev
            );
            await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
            setEvents(updatedEvents);
        } else {
            // Новое событие
            const updatedEvents = [...parsedEvents, newEvent];
            await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
            setEvents(updatedEvents);
        }

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Дата события:</Text>
            <Button
                title={date.toISOString().split('T')[0]}
                onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            <Text style={styles.label}>Время события:</Text>
            <Button
                title={time.toISOString().split('T')[1].substring(0, 5)}
                onPress={() => setShowTimePicker(true)}
            />
            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) setTime(selectedTime);
                    }}
                />
            )}

            <Text style={styles.label}>Тип события:</Text>
            <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                style={styles.input}
            >
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

            <Button
                title={event ? 'Сохранить изменения' : 'Сохранить'}
                onPress={handleSaveEvent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 16 },
});

export default EventFormScreen;
