// Founder Square components are plain HTML with the classes in bundle.css.
// These interfaces document what the consumer provides.
export interface LogoProps { ink?: 'red' | 'white' | 'black'; variant?: 'logo' | 'mark'; /** CSS height; 20px minimum for the full logo */ height?: string }
export interface HeaderProps { links: { label: string; href: string; current?: boolean }[] }
export interface FooterProps { email: string; pages: { label: string; href: string }[]; follow?: string; bottom: [string, string]; photoCredit?: { label: string; href: string } }
export interface ButtonProps { label: string; href: string; variant?: 'red' | 'light' }
export interface TextLinkProps { label: string; href: string }
export interface CopyEmailProps { address: string }
export interface HeroProps { title: string; photo: { src: string; alt: string }; event: { title: string; line: string; cta: ButtonProps } }
export interface EventRowProps { day: string; month: string; weekdayYear: string; datetime: string; title: string; href: string; summary: string; facts: string; aside: string; link: TextLinkProps }
export interface PageHeadProps { title: string; statement?: string; body?: string; cta?: ButtonProps }
export interface AboutProps { heading: string; statement: string; body: string; link?: TextLinkProps }
export interface RegisterBandProps { title: string; line: string; cta: ButtonProps }
export interface ScheduleProps { heading: string; note?: string; items?: { time: string; what: string }[] }
export interface QuestionsProps { heading: string; items: { q: string; a: string }[] }
declare global { interface Window { FounderSquare: { copyButtons(root?: ParentNode, address?: string): void } } }
