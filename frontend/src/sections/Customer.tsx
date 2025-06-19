"use client";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import React from "react";

const Customers = [
  {
    text: "I almost fell for a fake business account. This app flagged it instantly. A total lifesaver!",
    imageSrc: avatar1.src,
    name: "Jamie Rivera",
    username: "@jamietechguru00",
  },
  {
    text: "Perfect tool for influencers. I now verify collaboration requests to ensure they’re legitimate.",
    imageSrc: avatar2.src,
    name: "Josh Smith",
    username: "@jjsmith",
  },
  {
    text: "We use this in our agency to screen brand profiles before working with them. Highly accurate and efficient.",
    imageSrc: avatar3.src,
    name: "Morgan Lee",
    username: "@morganleewhiz",
  },
  {
    text: "Scanned hundreds of profiles. The tool clearly distinguishes between genuine and suspicious behavior.",
    imageSrc: avatar4.src,
    name: "Casey Jordan",
    username: "@caseyj",
  },
  {
    text: "Helped me clean up my follower list. I removed dozens of fake accounts after using this app.",
    imageSrc: avatar5.src,
    name: "Taylor Kim",
    username: "@taylorkimm",
  },
  {
    text: "Smart UI and backed by machine learning — it's the best fake profile checker I’ve found so far.",
    imageSrc: avatar6.src,
    name: "Riley Smith",
    username: "@rileysmith1",
  },
  {
    text: "The detection report was detailed and accurate. Loved how easy it was to use!",
    imageSrc: avatar7.src,
    name: "Jordan Patels",
    username: "@jpatelsdesign",
  },
  {
    text: "The best thing is the peace of mind. No more guessing if a profile is legit or not.",
    imageSrc: avatar8.src,
    name: "Sam Dawson",
    username: "@dawsontechtips",
  },
  {
    text: "I run giveaways, and this tool helps filter out bot accounts before selecting winners.",
    imageSrc: avatar9.src,
    name: "Casey Harper",
    username: "@casey09",
  },
];

const firstColumn = Customers.slice(0, 3);
const secondColumn = Customers.slice(3, 6);
const thirdColumn = Customers.slice(6, 9);

const CustomersColumn = (props: { className?: string; Customers: typeof Customers; duration?: number }) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.Customers.map(({ text, imageSrc, name, username }) => (
              <div key={username} className="card">
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <Image src={imageSrc} alt={name} width={40} height={40} className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">{name}</div>
                    <div className="leading-5 tracking-tight">{username}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export const Customer = () => {
  return (
    <section className="bg-gradient-to-b from-[#ffe4ec] to-white py-24">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>
          <h2 className="section-title mt-5">What our users say</h2>
          <p className="section-description mt-5">
            Thousands of users trust our platform to detect fake Instagram profiles, verify brands, and stay safe online.
          </p>
        </div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
          <CustomersColumn Customers={firstColumn} duration={15} />
          <CustomersColumn Customers={secondColumn} className="hidden md:block" duration={19} />
          <CustomersColumn Customers={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};
