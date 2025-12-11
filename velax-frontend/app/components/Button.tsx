import react from "react";

interface ButtonProps {
  BtnAttr: string;
}

const Button = ({ BtnAttr }: ButtonProps) => {
  return (
    <button className="bg-black text-white border border-gray-500 rounded-xl cursor-pointer">
      {BtnAttr}
    </button>
  );
};

export default Button;
