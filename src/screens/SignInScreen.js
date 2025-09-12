import { Button, StyleSheet, Text, View } from 'react-native'


const SignInScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', gap: 16, padding: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: '700' }}>Gym Tracker</Text>
            <Text style={{ color: '#666' }}>Pantalla de login (placeholder)</Text>
            <Button title="Ir a Rutinas" onPress={() => navigation.replace('Routines')} />
        </View>
    )
}

export default SignInScreen

const styles = StyleSheet.create({})