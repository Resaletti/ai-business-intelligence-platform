export default function KPICard({
  title,
  value,
  change,
}) {

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
        transition-all
        duration-300
        hover:border-cyan-500
        hover:shadow-lg
        hover:shadow-cyan-500/20
        hover:-translate-y-1
      "
    >

      <p className="text-slate-400 text-sm uppercase tracking-wider">

        {title}

      </p>

      <h3 className="text-4xl font-bold mt-3">

        {value}

      </h3>

      {change && (

        <p className="text-cyan-400 text-sm mt-3 font-medium">

          {change}

        </p>

      )}

    </div>

  );

}