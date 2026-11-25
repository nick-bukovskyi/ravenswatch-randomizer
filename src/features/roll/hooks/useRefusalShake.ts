import { useTemporaryState } from '../../../shared/hooks/useTemporaryState.ts';
import { playRefusal } from '../../sound/lib/soundEffects.ts';

/** `ink-shake` keyframes length plus a short rest */
const SHAKE_MS = 400;

export function useRefusalShake() {
  const [isShaking, setIsShaking] = useTemporaryState(false, SHAKE_MS);

  function shake() {
    playRefusal();
    setIsShaking(true);
  }

  return { isShaking, shake };
}
