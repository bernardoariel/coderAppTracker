import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../global/colors'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Header = ({ title, subtitle, showBack }) => {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets();
    const H = 72;
    return (
        <View
            style={{
                backgroundColor: '#2563EB',
                paddingTop: insets.top,  // respeta notch
            }}
        >
            <View
                style={{
                    height: H,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',      // centra vertical
                    justifyContent: 'flex-start',
                    gap: 12,
                }}
            >
                {showBack && (
                    <Pressable
                        onPress={() => navigation.goBack()}
                        hitSlop={10}
                        style={{ padding: 6 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </Pressable>
                )}

                <View style={{ flexShrink: 1 }}>
                    <Text
                        numberOfLines={1}
                        style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}
                    >
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text
                            numberOfLines={1}
                            style={{ color: '#E5ECFF', fontSize: 13, marginTop: 2 }}
                        >
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
            </View>
        </View>
    );
}



export default Header
