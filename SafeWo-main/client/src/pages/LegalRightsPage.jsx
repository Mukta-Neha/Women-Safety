import React, { useState } from 'react';
import {
  Scale,
  Shield,
  ShieldAlert,
  FileText,
  AlertTriangle,
  Lock,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  PhoneCall,
  Download,
  Check,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

const LEGAL_RIGHTS = [
  {
    id: 'zero-fir',
    title: 'Right to File a "Zero FIR"',
    law: 'Section 154 CrPC / Bharatiya Nagarik Suraksha Sanhita',
    summary:
      'You have the legal right to register an FIR at ANY police station, regardless of where the incident occurred or jurisdiction boundaries.',
    details: [
      'Police officers cannot refuse to lodge your complaint citing territorial jurisdiction.',
      'The police station must register it as a "Zero FIR" (assigned number 0) and initiate immediate preliminary action.',
      'Refusal by a police officer to register an FIR for cognizable crimes against women is a punishable offence under IPC Section 166A (up to 2 years imprisonment).',
    ],
    tag: 'Fundamental Police Right',
    color: 'rose',
  },
  {
    id: 'arrest-safeguards',
    title: 'Arrest Protections & Sunset Clause',
    law: 'Section 46(4) Code of Criminal Procedure',
    summary:
      'A woman cannot be arrested after sunset (6 PM) and before sunrise (6 AM), except in extraordinary cases with prior judicial magistrate permission.',
    details: [
      'Arrests of women must strictly be made by or in the presence of a female police officer.',
      'Body searches of women can only be conducted by another woman with strict decency standards.',
      'A woman arrested has the right to inform a family member or friend immediately, and must be medically examined upon request.',
    ],
    tag: 'Arrest Shield',
    color: 'purple',
  },
  {
    id: 'posh-act',
    title: 'Workplace Sexual Harassment (POSH Act)',
    law: 'Sexual Harassment of Women at Workplace Act, 2013',
    summary:
      'Every organization with 10 or more employees must maintain an active, impartial Internal Complaints Committee (ICC) presided over by a senior woman employee.',
    details: [
      'Applies to all employees (full-time, part-time, intern, contract, and visitors).',
      'The inquiry must be completed within 90 days, and the report submitted to the employer within 10 days.',
      'Victims can request interim relief such as paid leave (up to 3 months) or transfer to prevent retaliation.',
      'Strict confidentiality: Identity of the complainant and respondent cannot be leaked to the public or media.',
    ],
    tag: 'Workplace Rights',
    color: 'emerald',
  },
  {
    id: 'free-legal-aid',
    title: 'Right to 100% Free Legal Aid',
    law: 'Section 12 of the Legal Services Authorities Act, 1987 (NALSA)',
    summary:
      'All women in India are entitled to free, state-funded legal representation and court assistance regardless of their income or financial status.',
    details: [
      'You can approach the National Legal Services Authority (NALSA) or State Legal Services (SLSA) at any District Court.',
      'A government-appointed advocate will draft petitions, appear in court, and handle proceedings without any lawyer fees.',
      'Toll-Free National Legal Helpline: 15100 (Available nationwide 24/7).',
    ],
    tag: 'Free Legal Shield',
    color: 'blue',
  },
  {
    id: 'virtual-complaint',
    title: 'Right to Virtual Complaint / Registered Post',
    law: 'Delhi Police Guidelines & Ministry of Home Affairs Circular',
    summary:
      'If you cannot physically visit a police station due to trauma, threats, or illness, you have the right to submit complaints via email or registered post.',
    details: [
      'Complaints sent via email or post to the Police Commissioner or Deputy Commissioner are legally valid.',
      'A female police officer will visit your residence to record your official statement.',
      'You are never obligated to visit the police station alone for preliminary questioning.',
    ],
    tag: 'Remote Filing',
    color: 'amber',
  },
  {
    id: 'privacy-shield',
    title: 'Strict Identity Concealment & Privacy',
    law: 'Section 228A Indian Penal Code / Bharatiya Nyaya Sanhita',
    summary:
      'Publishing or disclosing the name, picture, workplace, or any identifying details of a sexual assault or harassment victim is a severe criminal crime.',
    details: [
      'Applies to print media, television, social media influencers, police disclosures, and private individuals.',
      'Violators face up to 2 years rigorous imprisonment and heavy fines.',
      'Statement recording can be conducted in private / camera settings in the presence of a trusted companion or magistrate.',
    ],
    tag: 'Privacy Right',
    color: 'rose',
  },
];

const CYBER_CHECKLIST_ITEMS = [
  'Take full-screen uncropped screenshots preserving URL bar, timestamp, and account handle',
  'Do not delete abusive messages, voice notes, or emails (they are crucial forensic evidence)',
  'Save the perpetrator profile link / URL (not just their display name)',
  'Note down dates, exact times, and platforms where each harassment event occurred',
  'Report directly to National Cyber Crime Portal at cybercrime.gov.in or call 1930',
  'File a content takedown request via StopNCII.org for non-consensual intimate imagery',
];

const QUIZ_QUESTIONS = [
  {
    q: 'Do you have trusted emergency contacts configured on SafeWo with direct calling numbers?',
    points: 20,
  },
  {
    q: 'Do you have high-accuracy browser / device location permissions enabled for safety apps?',
    points: 20,
  },
  {
    q: 'Are you aware that you can file a "Zero FIR" at ANY police station regardless of jurisdiction?',
    points: 20,
  },
  {
    q: 'Do you know how to report cyber harassment to the National Cybercrime Portal (1930)?',
    points: 20,
  },
  {
    q: 'Have you verified your primary Safe Zones (Home, College, Office) on SafeWo?',
    points: 20,
  },
];

export const LegalRightsPage = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [checkedEvidence, setCheckedEvidence] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleCheck = (idx) => {
    setCheckedEvidence((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAnswerQuiz = (qIdx, isYes) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: isYes }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[idx]) score += q.points;
    });
    return score;
  };

  const quizScore = calculateScore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-800/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" />
            Knowledge Is Power • Legal & Digital Protection
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Women’s Legal Rights & Cyber Safety Handbook
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm max-w-2xl mt-1">
            Understanding your constitutional rights is your strongest armor. Learn about Zero FIR, arrest safeguards, POSH act provisions, and cybercrime defense protocols.
          </p>
        </div>
      </div>

      {/* QUICK HELPLINES BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'National Cyber Helpline', num: '1930', desc: 'Financial fraud & cyber harassment' },
          { label: 'Women Helpline (Domestic/Crisis)', num: '181', desc: '24/7 National crisis response' },
          { label: 'Free Legal Aid (NALSA)', num: '15100', desc: 'Free government advocates' },
          { label: 'NCW Cyber Cell', num: '7827170170', desc: 'National Commission for Women' },
        ].map((h, i) => (
          <a
            key={i}
            href={`tel:${h.num}`}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 shadow-sm transition-all group"
          >
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{h.label}</span>
            <span className="text-lg font-black text-purple-700 dark:text-purple-400 group-hover:scale-105 transition-transform block mt-0.5">
              📞 {h.num}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">{h.desc}</span>
          </a>
        ))}
      </div>

      {/* SECTION 1: INTERACTIVE LEGAL RIGHTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Essential Legal Rights & Protections
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any card to expand comprehensive statutory details and police protocols.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEGAL_RIGHTS.map((right) => {
            const isExpanded = expandedCard === right.id;
            return (
              <div
                key={right.id}
                onClick={() => setExpandedCard(isExpanded ? null : right.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isExpanded
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {right.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate">{right.law}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-2">{right.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {right.summary}
                  </p>

                  {/* Expanded clauses */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-900/60 space-y-2 text-xs text-slate-700 dark:text-slate-300 animate-fadeIn">
                      <strong className="block text-[11px] font-bold uppercase text-purple-600 dark:text-purple-400">
                        Key Statutory Guidelines:
                      </strong>
                      <ul className="space-y-1.5 list-disc list-inside">
                        {right.details.map((d, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-bold">
                  <span>{isExpanded ? 'Show Less' : 'Read Full Details'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: DIGITAL EVIDENCE PRESERVATION CHECKLIST */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Digital Evidence Preservation Checklist
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Facing cyberstalking, online harassment, or unauthorized images? Follow these forensic preservation rules before blocking.
              </p>
            </div>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            cybercrime.gov.in
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {CYBER_CHECKLIST_ITEMS.map((item, idx) => {
            const isChecked = !!checkedEvidence[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isChecked
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 stroke-[3px]" />}
                </div>
                <span
                  className={`text-xs leading-relaxed ${
                    isChecked
                      ? 'text-indigo-900 dark:text-indigo-200 font-semibold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE SAFETY READINESS SELF-AUDIT QUIZ */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-900/50 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-indigo-300">
              Interactive Self-Audit
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">Personal Safety Readiness Score</h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Take this 1-minute 5-question audit to measure your safety readiness level and get tailored advice.
            </p>
          </div>

          {quizSubmitted && (
            <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/20">
              <div className="text-3xl font-black text-indigo-300">{quizScore}%</div>
              <div className="text-xs">
                <span className="block font-bold">
                  {quizScore >= 80 ? '🌟 Guardian Champion' : quizScore >= 50 ? '🛡️ Proactively Prepared' : '⚠️ Novice Level'}
                </span>
                <span className="text-indigo-200">
                  {quizScore >= 80 ? 'Excellent protection profile' : 'Recommended actions below'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Questions list */}
        <div className="space-y-3">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const currentAnswer = quizAnswers[idx];
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 font-medium">{q.q}</p>
                </div>

                <div className="flex gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleAnswerQuiz(idx, true)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentAnswer === true
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-slate-300'
                    }`}
                  >
                    Yes (+20%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswerQuiz(idx, false)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentAnswer === false
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-slate-300'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setQuizSubmitted(true)}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-purple-500/30 active:scale-95 transition-all"
          >
            Calculate Safety Readiness Score
          </button>
        </div>
      </div>
    </div>
  );
};
