import { FeatureIcon } from "./feature-icon";

type IconName = "brain" | "microphone" | "eye" | "document" | "globe" | "shield";

export function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: IconName;
}) {
  return (
    <div className="bg-base-black p-8 h-full">
      <div className="mb-4">
        <FeatureIcon name={icon} />
      </div>
      <h3 className="text-lg font-bold text-bg-white mb-2 text-left">{title}</h3>
      <p className="text-bg-white/60 leading-relaxed text-left">{description}</p>
    </div>
  );
}
