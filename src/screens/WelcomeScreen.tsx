// src/screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>«Realtor's time»</Text>
            <Text style={styles.description}>
                Приложение для управления событиями
            </Text>
            <Button title="Перейти к событиям" onPress={() => navigation.navigate('Home')} />
            <Button title="О создателях" onPress={() => navigation.navigate('About')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    description: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
});

export default WelcomeScreen;
