import React from 'react';

export const Stats: React.FC = () => {
  const stats = [
    {
      value: "3 450+",
      label: "Caméras installées",
      desc: "Résidentiel & professionnel"
    },
    {
      value: "< 2h",
      label: "Intervention d'urgence",
      desc: "Astreinte technique 24/7"
    },
    {
      value: "100%",
      label: "Conforme RGPD / CNIL",
      desc: "Masquage & respect de la loi"
    },
    {
      value: "3 Ans",
      label: "Garantie matériel & pose",
      desc: "Échange à neuf en cas de panne"
    }
  ];

  return (
    <section className="py-14 border-y border-zinc-800/40 bg-zinc-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-left space-y-1">
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-zinc-300">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-500">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
