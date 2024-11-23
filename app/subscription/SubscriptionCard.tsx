"use client";

interface SubscriptionCardProps {
  title?: string;
  description?: string;
  price?: string;
  priceDesc?: React.ReactNode;
  features?: string[];
  center?: boolean;
  border?: boolean;
  borderColor?: string;
  lineColor?: string;
  hoverColor?: string;
  isSelected?: boolean;
  isButtonHidden?: boolean;
  onSubscribe?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
    title, 
    description, 
    price, 
    priceDesc, 
    features = [], 
    center, 
    border = false, 
    borderColor = "border-gray-300",
    lineColor = "border-gray-300",
    hoverColor = "bg-gray-300",
    isSelected = false,
    isButtonHidden = false,
    onSubscribe,
    }) => {
    return (
    <div className={` ${center ? "text-center" : "text-start"} `}>
        <hr style={{ 
            borderColor: lineColor,
            borderWidth: "7px",
            borderStyle: "solid",
            borderRadius: "50px",
            width: "96%",
            height: "2px",
            margin: "0px auto"
        }}/> 
        <div className={`bg-white shadow-xl rounded-2xl p-7 ${border ? `border-2 ${borderColor}` : ""}`}>
            <div className="text-4xl font-extrabold">
                {title}
            </div>
            <div className="mt-4 text-1xl font-medium text-black">
                {description}
            </div>
            <div className="flex justify-center items-center my-10">
                <div className="text-5xl font-bold">{price}</div>
                <div className="ml-2 mt-3 text-lg text-black font-semibold">
                    / quarterly
                </div>
            </div>
            <div className="mt-2 text-1xl flex justify-center font-medium italic text-black">
                {priceDesc}
            </div>
            <div className="my-8 flex justify-center">
                {!isButtonHidden && (
                <button
                    onClick={onSubscribe}
                    className={`
                        font-bold
                        w-56
                        py-2 
                        border-2
                        border-black
                        rounded-3xl 
                        ${isSelected ? 'bg-gray-300 opacity-50 cursor-not-allowed' :  `hover:text-white text-transition duration-300 hover:${hoverColor}`}`}
                        disabled={isSelected}
                        title="Click to Proceed"
                    >
                        {isSelected ? "Current Plan" : "Get Started" }
                </button>)}
            </div>
            <ul className="list-none list-inside mt-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center mt-3">
                        <span className="text-green-500 mr-2 mb-1.25">✔</span>
                            {feature}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default SubscriptionCard;
