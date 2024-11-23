"use client";

interface HeadingProps {
  title: string;
  subTitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subTitle, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2xl mt-16 font-bold">{title}</div>
      <div className="mt-4 font-light text-neutral-500">{subTitle}</div>
    </div>
  );
};

export default Heading;
