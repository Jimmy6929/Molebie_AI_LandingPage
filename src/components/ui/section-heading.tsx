export function SectionHeading({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="mb-12">
      <div
        className={`h-[3px] w-full mb-6 ${
          light ? "bg-base-black" : "bg-accent-yellow"
        }`}
      />
      <h2
        className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-none text-left ${
          light ? "text-base-black" : "text-bg-white"
        }`}
      >
        {children}
      </h2>
    </div>
  );
}
