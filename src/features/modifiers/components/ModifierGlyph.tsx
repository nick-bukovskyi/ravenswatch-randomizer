interface ModifierGlyphProps {
  icon: string;
}

/** The source art is black, so it is a CSS mask over a light fill */
export function ModifierGlyph({ icon }: ModifierGlyphProps) {
  return (
    <span aria-hidden="true" className="modifier-glyph">
      <span style={{ maskImage: `url("${icon}")` }} />
    </span>
  );
}
