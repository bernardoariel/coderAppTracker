import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, View, Text, Image } from 'react-native';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import rutinas from './src/data/rutinas.json'

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from './src/components/Header';
import FlatCard from './src/components/FlatCard';

const rutinaImages = {
  1: require('./assets/images/1.jpg'),
  2: require('./assets/images/2.jpg'),
  3: require('./assets/images/3.jpg'),
  4: require('./assets/images/4.jpg'),
  5: require('./assets/images/5.jpg'),
  6: require('./assets/images/6.jpg'),
  7: require('./assets/images/7.jpg'),
};

const Stack = createNativeStackNavigator();
export default function App() {
  const renderRutinaItem = ({ item }) => (
    <FlatCard>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={rutinaImages[item.id]}
          style={{ width: 100, height: 100, borderRadius: 12, marginVertical: 8, marginRight: 16 }}
        />
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{item.title}</Text>
      </View>
    </FlatCard>
  )
  return (
    <Provider store={store}>
      {/* <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Ingresar' }} />
          <Stack.Screen name="Routines" component={RoutinesScreen} options={{ title: 'Rutinas' }} />
        </Stack.Navigator>
      </NavigationContainer> */}
      <View style={styles.container}>
        <Header title="Gym-Tracker" />
        <FlatList
          data={rutinas}
          renderItem={renderRutinaItem}
          keyExtractor={item => item.id}
        />
        <StatusBar style='light' />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },

});
