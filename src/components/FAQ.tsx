'use client'

import { useState } from 'react'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-black/10 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 text-left flex justify-between items-center gap-4 hover:text-charcoal transition-colors"
      >
        <span className="font-medium text-lg text-charcoal">{question}</span>
        <span className={`text-2xl text-charcoal transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {isOpen && (
        <div className="pb-6 text-text-secondary leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Where do you get trend data from?',
      answer: 'We analyze publicly available discussions across Reddit, blogs, forums, and web communities. We focus on organic conversations rather than paid or promotional content.',
    },
    {
      question: 'Is this connected to Instagram or X directly?',
      answer: 'No. We focus on web-wide conversations to identify rising themes that typically appear on social platforms later. This gives you a first-mover advantage.',
    },
    {
      question: 'Can this replace my content strategy?',
      answer: 'Scyra enhances your strategy by surfacing what audiences are already talking about. You still bring your unique perspective and creativity.',
    },
    {
      question: 'Does it work for small niches?',
      answer: 'Yes — as long as your niche has active discussions online, we can detect trends. Some of our best insights come from highly specialized communities.',
    },
    {
      question: 'How accurate are the trend predictions?',
      answer: 'We measure velocity, engagement, and discussion quality to rank trends. While no prediction is perfect, our users report significantly higher engagement when creating content around detected trends.',
    },
  ]

  return (
    <div>
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  )
}
