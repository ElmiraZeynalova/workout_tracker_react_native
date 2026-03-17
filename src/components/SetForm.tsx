import {Text, TextInput, View, StyleSheet} from 'react-native'

type Props = {
    reps: number | null
    weight?: number | null
    updateReps: (reps: number) => void
    updateWeight: (weight: number) => void
}
export default function SetForm({reps, weight, updateReps, updateWeight}: Props){

    return(

        <View>
            <Text>Reps: </Text>
            <TextInput
                style={styles.input}
                onChangeText={(n) => updateReps(Number(n))}
                value={String(reps || '')}
                placeholder="0"
                keyboardType="numeric"
            />
            <Text>Weight: </Text>
            <TextInput
                style={styles.input}
                onChangeText={(n) => updateWeight(Number(n))}
                value={String(weight || '')}
                placeholder="0"
                keyboardType="numeric"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {

    }
})