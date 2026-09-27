/* Die Bibliothek `hyphen` bringt keine Typen mit — hier das Nötigste.
   Sie ist ein CommonJS-Modul; unter ESM kommt sie als Standard-Export. */
declare module 'hyphen/de' {
  type Optionen = { hyphenChar?: string; minWordLength?: number };
  const de: {
    hyphenateSync(text: string, optionen?: Optionen): string;
    hyphenateHTMLSync(html: string, optionen?: Optionen): string;
    hyphenate(text: string, optionen?: Optionen): Promise<string>;
    hyphenateHTML(html: string, optionen?: Optionen): Promise<string>;
  };
  export default de;
}
