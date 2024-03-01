import { SVGProps } from "react";

export default function ScipySvg({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 100 100"
      {...props}
    >
      <defs>
        <radialGradient id="g" cx="50%" cy="70%" r="70%">
          <stop offset="0" stopColor="#0053A0" />
          <stop offset=".5" stopColor="#0053A0" />
          <stop offset=".95" stopColor="#00264a" />
          <stop offset="1" stopColor="black" />
        </radialGradient>
      </defs>
      <path d="M94,33l3-2 M97,28v3h2.5" fill="none" stroke="#000" />
      <circle cx="50" cy="50" fill="url(#g)" r="47.5" stroke="#000" />
      <path
        d="M7,77c24-27,23-4,44,2c18,4,23-15,10-25c-7-6-16-5-23-9c-10-5-8-20,2-23c29-10,16,32,49,13"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
      />
      <path
        d="M80,32l5,11l9-8l-1-3z"
        fill="#fff"
        stroke="#fff"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
