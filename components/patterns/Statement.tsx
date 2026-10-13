import Reveal from '@/components/ui/Reveal'

/** P4 Statement: one display-m sentence (≤2 lines) between two hairlines, optional mono tag. */
export default function Statement({ text, tag }: { text: string; tag?: string }) {
  return (
    <Reveal className="border-y border-line py-12">
      {tag && <p className="mb-4 font-mono text-data text-text-3">{tag}</p>}
      <p className="max-w-4xl text-display-m text-text">{text}</p>
    </Reveal>
  )
}
