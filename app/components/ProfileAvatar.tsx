import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <Image
      className="rounded-full"
      width={70}
      height={70}
      src={src || "/images/placeholder.jpg"}
      alt="avatar"
    />
  );
};

export default Avatar;
