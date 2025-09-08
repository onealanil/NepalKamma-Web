"use client";

import { Dictionary } from "@/types/dictionary/dictionary";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";


export default function FAQSection({ dict }: { dict: Dictionary }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);


  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="pt-16 pb-0 md:pb-16">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          {dict.landing.faq.title}
        </h2>

        <div className="space-y-4 max-w-3xl mx-auto">
          {dict.landing.faq.items.map((faq: {question: string, answer: string}, index: number) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="text-lg font-medium text-gray-700">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                    }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-gray-600 text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
