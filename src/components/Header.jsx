import { Pressable, Text, View, Modal, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../global/colors';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({ title, subtitle, showBack, onBack }) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleBack = () => {
        if (typeof onBack === 'function') return onBack();

        if (navigation?.canGoBack()) navigation.goBack();
        else if (navigation?.getParent?.()?.canGoBack?.()) navigation.getParent().goBack();
    };

    const handleLogout = async () => {
        setMenuVisible(false);
        
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro que deseas salir de tu cuenta?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Salir", 
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem('auth');
                        dispatch(clearAuth());
                    }
                }
            ]
        );
    };

    return (
        <View style={{
            backgroundColor: colors.secondary,
            paddingTop: insets.top
        }}>
            <View
                style={{
                    height: 72,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {showBack ? (
                    <Pressable onPress={handleBack} hitSlop={10} style={{ padding: 6 }}>
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </Pressable>
                ) : (
                    <View style={{ width: 36 }} />
                )}

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{
                        color: colors.white,
                        fontSize: 20,
                        fontWeight: '700'
                    }}>
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text numberOfLines={1} style={{
                            color: colors.warning,
                            fontSize: 13,
                            marginTop: 2
                        }}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>

                {/* Botón de menú (3 puntos) */}
                <Pressable 
                    onPress={() => setMenuVisible(true)} 
                    hitSlop={10} 
                    style={{ padding: 6 }}
                >
                    <Ionicons name="ellipsis-vertical" size={24} color={colors.white} />
                </Pressable>

                {/* Modal del menú */}
                <Modal
                    transparent={true}
                    visible={menuVisible}
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}
                        activeOpacity={1}
                        onPress={() => setMenuVisible(false)}
                    >
                        <View 
                            style={{
                                position: 'absolute',
                                top: insets.top + 72,
                                right: 16,
                                backgroundColor: colors.white,
                                borderRadius: 8,
                                overflow: 'hidden',
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleLogout}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 16,
                                }}
                            >
                                <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                                <Text style={{ marginLeft: 8, color: colors.danger, fontWeight: '500' }}>
                                    Cerrar sesión
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </View>
    );
};

export default Header;
