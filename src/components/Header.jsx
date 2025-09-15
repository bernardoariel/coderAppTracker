import { StyleSheet, Text, View } from 'react-native'

import { colors } from '../global/colors'

const Header = ({ title, subtitle }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>{subtitle}</Text>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        height: 200,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 24,
        color: colors.lightGray
    },
    subTitle: {
        fontSize: 14,
        color: colors.lightGray
    }
})