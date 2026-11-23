import { Ornament } from '../../shared/ui/Ornament.tsx';

export function Footer() {
  return (
    <footer className="pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
      <Ornament className="mx-auto mb-4 max-w-xs" />
      <p className="font-body text-sm text-cream-muted">
        Fan-made, not affiliated with Nacon / Passtech Games. Ravenswatch © Nacon / Passtech Games.
      </p>
    </footer>
  );
}
