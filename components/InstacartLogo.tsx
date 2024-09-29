import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const InstacartLogo: React.FC = () => {
  return (
    <div className="relative w-full max-w-[400px] mx-auto mb-8 h-24">
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: "-120px", opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          className="absolute"
        >
          <Image
            src="/instacart/Instacart_Carrot.png"
            alt="Instacart Carrot"
            width={60}
            height={60}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
          className="ml-16"
        >
          <Image
            src="/instacart/Instacart_Logo_Kale.png"
            alt="Instacart Logo"
            width={280}
            height={60}
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default InstacartLogo;