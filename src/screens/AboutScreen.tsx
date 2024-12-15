// src/screens/AboutScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AboutScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>О создателях</Text>
            <Text style={styles.text}>
                Приложение разработано командой из нескольких человек:
                {"\n"}- Переверзев Иван
                {"\n"}- Шамаров Илья
                {"\n"}- Киньябулатова Уралия
            </Text>
            <Button title="Назад" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    text: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
});

export default AboutScreen;
