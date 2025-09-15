import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import rutinas from '../data/rutinas.json'
import FlatCard from '../components/FlatCard';
const rutinaImages = {
    1: require('../../assets/images/1.jpg'),
    2: require('../../assets/images/2.jpg'),
    3: require('../../assets/images/3.jpg'),
    4: require('../../assets/images/4.jpg'),
    5: require('../../assets/images/5.jpg'),
    6: require('../../assets/images/6.jpg'),
    7: require('../../assets/images/7.jpg'),
};
const RutinaScreen = () => {
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
        <View>
            <FlatList
                data={rutinas}
                renderItem={renderRutinaItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default RutinaScreen

const styles = StyleSheet.create({})