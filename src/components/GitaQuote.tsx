import { useMemo } from "react";

const VERSES: { sanskrit: string; hindi: string; ref: string }[] = [
  {
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    hindi:
      "तुम्हारा अधिकार केवल कर्म करने में है, फलों में कभी नहीं। इसलिए फल की इच्छा से कर्म मत करो, और न ही कर्म न करने में तुम्हारी आसक्ति हो।",
    ref: "भगवद्गीता — अध्याय 2, श्लोक 47",
  },
  {
    sanskrit:
      "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
    hindi:
      "हे धनंजय! आसक्ति को त्यागकर, सिद्धि-असिद्धि में समान भाव रखकर, योग में स्थित होकर कर्म करो — इसी समत्व को योग कहते हैं।",
    ref: "भगवद्गीता — अध्याय 2, श्लोक 48",
  },
  {
    sanskrit: "उद्धरेदात्मनाऽऽत्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    hindi:
      "मनुष्य को अपने आप से ही अपना उद्धार करना चाहिए, स्वयं को गिरने नहीं देना चाहिए। मनुष्य स्वयं ही अपना मित्र है और स्वयं ही अपना शत्रु।",
    ref: "भगवद्गीता — अध्याय 6, श्लोक 5",
  },
  {
    sanskrit:
      "श्रद्धावाँल्लभते ज्ञानं तत्परः संयतेन्द्रियः।\nज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति॥",
    hindi:
      "श्रद्धावान, तत्पर और जितेन्द्रिय पुरुष ज्ञान को प्राप्त करता है, और ज्ञान पाकर शीघ्र ही परम शांति को प्राप्त हो जाता है।",
    ref: "भगवद्गीता — अध्याय 4, श्लोक 39",
  },
  {
    sanskrit:
      "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥",
    hindi:
      "जैसे मनुष्य पुराने वस्त्रों को त्यागकर नए वस्त्र धारण करता है, वैसे ही आत्मा जीर्ण शरीरों को छोड़कर नए शरीर धारण करती है।",
    ref: "भगवद्गीता — अध्याय 2, श्लोक 22",
  },
  {
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदाऽऽत्मानं सृजाम्यहम्॥",
    hindi:
      "हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं स्वयं को प्रकट करता हूँ।",
    ref: "भगवद्गीता — अध्याय 4, श्लोक 7",
  },
];

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - start) / 86400000);
}

export function GitaQuote() {
  const v = useMemo(() => VERSES[dayOfYear(new Date()) % VERSES.length], []);
  return (
    <section className="py-10">
      <div className="reveal mb-6.5">
        <p className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">
          A little wisdom
        </p>
        <h2 className="text-[1.6rem] font-bold tracking-[-0.035em] text-fg-strong">
          श्रीमद्भगवद्गीता
        </h2>
      </div>
      <article
        className="reveal relative overflow-hidden rounded-[14px] border border-border bg-card p-6 sm:p-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--ok) 8%, transparent), transparent 60%), radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--fg-strong) 4%, transparent), transparent 60%)",
        }}
      >
        <div className="pointer-events-none absolute right-4 top-3 font-serif text-[5rem] leading-none text-faint opacity-30">
          ॐ
        </div>
        <pre className="whitespace-pre-wrap font-serif text-[1.05rem] leading-[1.7] tracking-[-0.005em] text-fg-strong sm:text-[1.15rem]">
          {v.sanskrit}
        </pre>
        <p className="mt-4 border-l-2 border-border-strong pl-4 text-[0.95rem] leading-relaxed text-muted">
          {v.hindi}
        </p>
        <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-widest text-faint">
          — {v.ref}
        </p>
      </article>
    </section>
  );
}
