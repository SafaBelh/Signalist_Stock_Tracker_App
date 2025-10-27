import Image from "next/image";

const page = () => {
  return (
    <div>
      <Image
        src="/assets/icons/mainLogo.png"
        alt="Test Image"
        width={50}
        height={50}
      />
    </div>
  );
};

export default page;
