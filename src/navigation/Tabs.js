import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

import RutinaScreen from '../screens/rutinas/RutinaScreen';
import ConfigStackNavigator from './ConfigStack';
import { colors } from '../global/colors';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                header: () => (
                    <Header
                        title="Gym-Tracker"
                        subtitle={route.name === 'Rutinas!' ? 'Rutinas!' : 'Config!'}
                    />
                ),
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.mediumGray,
                tabBarStyle: { height: 56 + insets.bottom, paddingBottom: Math.max(insets.bottom, 8) },
                tabBarIcon: ({ color, size }) => {
                    const name = route.name === 'Rutinas' ? 'list'
                        : route.name === 'Config' ? 'settings'
                            : 'ellipse';
                    return <Ionicons name={name} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Rutinas" component={RutinaScreen} />
            <Tab.Screen name="Config" component={ConfigStackNavigator} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}
