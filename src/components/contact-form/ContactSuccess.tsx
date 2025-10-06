import Image from "next/image";
import React from "react";

const ContactSuccess: React.FC = () => {
  return (
    <div className="text-center bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-2 text-[#FF5000]">
        Kiitos yhteydenotostasi!
      </h2>
      <p>Vastaamme sinulle mahdollisimman pian.</p>

      <Image
        src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-06.png"
        alt="Thank You"
        width={939}
        height={814}
        className="mx-auto mt-4 max-h-30 w-auto"
      />

      <span className="text-sm text-gray-500 mt-4 block">
        Vastauksen saaminen ei ole taattua, mutta pyrimme vastaamaan kaikkiin
        viesteihin. Jos et saa vastausta, voit kokeilla ottaa yhteyttä sähköpostitse.
      </span>
    </div>
  );
};

export default ContactSuccess;
