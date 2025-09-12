import { Button, StyleSheet, Text, View } from 'react-native'


const RoutinesScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', gap: 16, padding: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Tus Rutinas</Text>
            <Text style={{ color: '#666' }}>Listado de rutinas (placeholder)</Text>
            <Button title="Volver a Login" onPress={() => navigation.replace('SignIn')} />
        </View>
    )
}

export default RoutinesScreen

const styles = StyleSheet.create({})