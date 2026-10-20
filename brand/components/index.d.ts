// Founder Square components are plain HTML with the classes below, styled by
// bundle.css. These interfaces document what the consumer provides; the few
// behaviours live on window.FounderSquare (bundle.js).

export interface LogoProps { variant?: 'horizontal' | 'stacked' | 'mark' | 'favicon'; ground: 'dark' | 'light'; /** CSS height; see identity minimums */ height?: string }
export interface ButtonProps { label: string; href: string; variant?: 'default' | 'accent' | 'hero'; /** mono eyebrow, hero variant only */ sub?: string; external?: boolean; wide?: boolean }
export interface PanelLinkProps { label: string; href: string; eyebrow?: string; accent?: boolean }
export interface CopyEmailProps { address: string; buttonLabel?: string }
export interface LedProps { state: 'on' | 'live' | 'off' | 'caret'; /** the word beside it; required */ text: string }
export interface BadgeProps { text: 'Placeholder' | 'Example' | string }
export interface HeaderProps { sections: { id: string; name: string }[]; current?: string; cta: ButtonProps }
export interface ThemeToggleProps { /** stored per visitor as bn-theme */ initial?: 'dark' | 'light' }
export interface StatusBoardProps { cells: { label: string; value: string; state?: LedProps['state'] }[]; countdownTo?: string; log?: string[] }
export interface TickerProps { items: { label: string; value: string; open?: boolean }[]; /** px per second, default 70 */ speed?: number }
export interface StatProps { label: string; value: string }
export interface ScheduleProps { rows: { time: string; what: string }[]; /** index of the current row */ now?: number }
export interface EventCardProps { series: string; date: string; status: 'confirmed' | 'placeholder'; kind: string; title: string; blurb: string; glyph: string; seed: number; link: { label: string; href: string } }
export interface TierProps { number: string; name: string; price: string; perks: string[]; featured?: boolean }
export interface TeamCardProps { name: string; role: string; seed: number; href: string }
export interface FaqProps { items: { q: string; a: string }[] }
export interface CtaBandProps { first: string; second: string; href: string; label?: string }
export interface PanelGridProps { columns: number; cells: { label: string; value: string; accent?: boolean }[] }
export interface SectionHeadProps { number: string; name: string; title: string; foot?: string; lead: string; paragraphs: string[] }
export interface LineArtProps { scene: 'radar' | 'glyph' | 'globe' | 'runway'; seed?: number; text?: string; /** glyph: dashed outline for placeholders */ outline?: boolean; live?: boolean; /** scales every line's alpha; hover uses up to 1.4 */ gain?: number }

declare global {
  interface Window {
    FounderSquare: {
      lineArt(canvas: HTMLCanvasElement, opts?: LineArtProps): { render(t: number): void; recolor(): void };
      roller(el: HTMLElement, template: string): { set(value: string): void };
      rollNumber(el: HTMLElement): { set(value: string): void };
      faq(root: HTMLElement): void;
      tokenRGB(el: HTMLElement, name: string): [number, number, number];
    };
  }
}
