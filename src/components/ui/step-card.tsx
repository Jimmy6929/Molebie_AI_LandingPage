export function StepCard({
  number,
  title,
  description,
  code,
}: {
  number: string;
  title: string;
  description: string;
  code: string;
  isLast?: boolean;
}) {
  return (
    <div className="bg-base-black p-8 h-full">
      <span className="block text-6xl lg:text-7xl font-black text-accent-yellow mb-4 leading-none">
        {number}
      </span>
      <h3 className="text-xl font-bold text-bg-white mb-2">{title}</h3>
      <p className="text-bg-white/60 mb-4 leading-relaxed">{description}</p>
      <div className="border-2 border-accent-yellow bg-base-black p-4 font-mono text-sm text-accent-yellow break-all">
        {code}
      </div>
    </div>
  );
}
