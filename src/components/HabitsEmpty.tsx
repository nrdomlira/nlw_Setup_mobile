import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';

export function HabitsEmpty() {
    const { navigate } = useNavigation();
    return (
        <Text className='text-zinc-400 text-base'>
            Você ainda não cadastrou nenhum hábito para monitorar hoje.
            Começe cadastrando um {' '}

            <Text className='text-zinc-400 text-base underline active:text-violet-500'
                onPress={() => navigate('new')}>
                aqui.
            </Text>
        </Text>
    );
} 