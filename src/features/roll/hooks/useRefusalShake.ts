import { useTemporaryState } from '../../../shared/hooks/useTemporaryState.ts';

/** `ink-shake` keyframes length plus a short rest */
const SHAKE_MS = 400;

export function useRefusalShake() {
  const [isShaking, setIsShaking] = useTemporaryState(false, SHAKE_MS);

  return { isShaking, shake: () => setIsShaking(true) };
}
