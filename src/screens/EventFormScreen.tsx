import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';

const EventFormScreen = ({ route, navigation }: any) => {
    const { setEvents } = route.params;
    const [datetime, setDatetime] = useState(dayjs().format('YYYY-MM-DD HH:mm'));
    const [type, setType] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (!datetime || !type) {
            Alert.alert('Ошибка', 'Дата-время и тип события обязательны');
            return;
        }

        setEvents((prev: any) => [
            ...prev,
            { id: Date.now().toString(), datetime, type, comment },
        ]);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Дата-время:</Text>
            <TextInput
                style={styles.input}
                value={datetime}
                onChangeText={setDatetime}
                placeholder="Введите дату и время"
            />
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
            <Button title="Сохранить" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 16 },
});

export default EventFormScreen;
