import React from "react";
import QRCodeComponent from "@/components/ui/QRCodeComponent";

const Home: React.FC = () => {
  const qrValue = "https://www.example.com";

  return (
    <div className="w-full">
      <QRCodeComponent value={qrValue} />
    </div>
  );
};

export default Home;
