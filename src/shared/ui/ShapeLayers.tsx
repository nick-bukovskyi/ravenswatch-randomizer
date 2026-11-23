/** Clip-path layers for a `.shape-layers` host, which sets the shape and tone */
export function ShapeLayers() {
  return (
    <>
      <span aria-hidden="true" className="shape-layers__layer shape-layers__ring" />
      <span aria-hidden="true" className="shape-layers__layer shape-layers__frame" />
      <span aria-hidden="true" className="shape-layers__layer shape-layers__line" />
      <span aria-hidden="true" className="shape-layers__layer shape-layers__fill" />
    </>
  );
}
