import {Text, TextInput, View, StyleSheet, Pressable} from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign'

type Props = {
    idx: number
    checked: boolean
    onToggle: () => void
    reps: number | null
    weight?: number | null
    updateReps: (reps: number) => void
    updateWeight: (weight: number) => void
}
export default function SetForm({idx, checked, onToggle, reps, weight, updateReps, updateWeight}: Props){
    
    return(
        <View style={styles.set}>
            {idx === 0 && <View style={styles.setHeader}>
                <Text style={styles.headerText}>SET</Text>
                <Text style={styles.headerText}>KG</Text>
                <Text style={styles.headerText}>REPS</Text>
                <Feather name="check" size={20} color="#858585" />
            </View>}
            <View style={styles.setForm}>
                <Text style={{fontWeight: 500}}>{idx + 1}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(n) => updateWeight(Number(n))}
                    value={weight != null ? String(weight) : ''}
                    placeholder="0"
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(n) => updateReps(Number(n))}
                    value={reps != null ? String(reps) : ''}
                    placeholder="0"
                    keyboardType="numeric"
                />

                <Pressable onPress={onToggle} style={[styles.checkbox, checked && styles.checked]}>
                    {checked && <AntDesign name="check" size={14} color="white" />}
                </Pressable>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    set: {
        flex: 1,
        marginHorizontal: 6 
    },
    setHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerText: {
        color: '#858585',
        fontWeight: 400,
        fontSize: 14,
        
    },
    setForm: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 8
    },
    input: {
        
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#858585',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: {
        backgroundColor: '#FF5526',
        borderColor: '#FF5526',
    }
})