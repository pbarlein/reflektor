export function Container({
  children,
  bred = false,
}: {
  children: React.ReactNode;
  /**
   * Rutenettet med rubrikker trenger mer bredde enn løpende tekst. Én prop,
   * ikke en klasse utenfra — da forblir det to bredder og ikke fem.
   */
  bred?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-6 ${bred ? "max-w-[84rem]" : "max-w-6xl"}`}
    >
      {children}
    </div>
  );
}
