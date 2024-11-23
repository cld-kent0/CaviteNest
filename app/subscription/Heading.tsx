"use client";

interface HeadingProps {
  title: string;
  subTitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subTitle, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="mt-8 text-4xl font-extrabold">{title}</div>
      <div className="mt-2 text-2xl font-light text-neutral-500">{subTitle}</div>
    </div>
  );
};

export default Heading;
