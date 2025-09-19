import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './Tabs';
import RunScreen from '../screens/RunScreen';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../store/slices/authSlice';
import AuthStack from './AuthStack';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
    // Mover el hook useSelector dentro del componente
    const isLoggedIn = useSelector(selectIsLoggedIn);
    
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                <>
                    <RootStack.Screen name="HomeTabs" component={AppTabs} />
                    <RootStack.Screen name="Run" component={RunScreen} />
                </>
            ) : (
                <RootStack.Screen name="Auth" component={AuthStack} />
            )}
        </RootStack.Navigator>
    );
}
