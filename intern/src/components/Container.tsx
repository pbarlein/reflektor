export function Container({ children }: { children: React.ReactNode }) {
  /*
   * Én bredde, ikke to. Radene ligger utenfor containeren og har sin egen
   * polstring — se kommentaren i page.tsx — så behovet for en «bred»
   * variant forsvant da rutenettet ble til rader.
   */
  return (
    <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8">{children}</div>
  );
}
