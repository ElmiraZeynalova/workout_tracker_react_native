import Runner from './running.svg'
import Dumbbell from './dumbbell.svg'
import Bicep from './bicep.svg'
import Leg from './leg.svg'
import { SvgProps } from 'react-native-svg'

export const exerciseIcons:  Record<string, React.FC<SvgProps>> = {
    'squat': Leg,
    'push-up': Dumbbell,
    'pull-up': Dumbbell,
    'bicep': Bicep
}
