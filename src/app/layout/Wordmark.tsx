import { StorybookCap } from './StorybookCap.tsx';

export function Wordmark() {
  return (
    <h1 className="flex items-baseline gap-5 text-[19px] leading-none whitespace-nowrap uppercase max-[560px]:flex-col max-[560px]:gap-1 max-[560px]:text-[14px]">
      <span className="sr-only">Ravenswatch Randomizer</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        <StorybookCap />
        <span className="wordmark__word">avenswatch</span>
      </span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        <StorybookCap />
        <span className="wordmark__word">andomizer</span>
      </span>
    </h1>
  );
}
