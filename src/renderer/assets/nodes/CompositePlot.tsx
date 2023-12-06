import { memo, SVGProps } from "react";

const CompositePlot = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      viewBox="0 0 125 126"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 6C0.5 2.96244 2.96243 0.5 6 0.5H119C122.038 0.5 124.5 2.96243 124.5 6V119.796C124.5 122.834 122.038 125.296 119 125.296H6C2.96243 125.296 0.5 122.834 0.5 119.796V6Z"
        className="fill-accent2 stroke-accent2"
        fillOpacity="0.05"
      />
      <path
        d="M17.4197 26.0186C16.8501 26.0186 16.409 26.2334 16.0965 26.6631C15.784 27.0895 15.6277 27.6852 15.6277 28.4502C15.6277 30.042 16.2251 30.8379 17.4197 30.8379C17.921 30.8379 18.5281 30.7126 19.241 30.4619V31.7314C18.6551 31.9756 18.0008 32.0977 17.2781 32.0977C16.2397 32.0977 15.4454 31.7835 14.8953 31.1553C14.3452 30.5238 14.0701 29.6188 14.0701 28.4404C14.0701 27.6982 14.2052 27.0488 14.4754 26.4922C14.7456 25.9323 15.1329 25.5042 15.6375 25.208C16.1453 24.9085 16.7394 24.7588 17.4197 24.7588C18.1131 24.7588 18.8097 24.9264 19.5096 25.2617L19.0213 26.4922C18.7544 26.3652 18.4858 26.2546 18.2156 26.1602C17.9454 26.0658 17.6801 26.0186 17.4197 26.0186ZM27.9439 28.4209C27.9439 29.6025 27.651 30.5107 27.065 31.1455C26.4791 31.7803 25.6393 32.0977 24.5455 32.0977C23.4518 32.0977 22.6119 31.7803 22.026 31.1455C21.44 30.5107 21.1471 29.5993 21.1471 28.4111C21.1471 27.223 21.44 26.3164 22.026 25.6914C22.6152 25.0632 23.4583 24.749 24.5553 24.749C25.6523 24.749 26.4905 25.0648 27.0699 25.6963C27.6526 26.3278 27.9439 27.236 27.9439 28.4209ZM22.734 28.4209C22.734 29.2184 22.8854 29.819 23.1881 30.2227C23.4908 30.6263 23.9433 30.8281 24.5455 30.8281C25.7532 30.8281 26.357 30.0257 26.357 28.4209C26.357 26.8128 25.7564 26.0088 24.5553 26.0088C23.9531 26.0088 23.499 26.2122 23.193 26.6191C22.887 27.0228 22.734 27.6234 22.734 28.4209ZM33.1459 32L31.4271 26.3994H31.3832C31.4451 27.5387 31.476 28.2988 31.476 28.6797V32H30.1234V24.8613H32.184L33.8734 30.3203H33.9027L35.6947 24.8613H37.7553V32H36.3441V28.6211C36.3441 28.4616 36.3458 28.2777 36.349 28.0693C36.3555 27.861 36.3783 27.3076 36.4174 26.4092H36.3734L34.5326 32H33.1459ZM41.7707 28.2207H42.2688C42.7342 28.2207 43.0826 28.1296 43.3137 27.9473C43.5448 27.7617 43.6604 27.4932 43.6604 27.1416C43.6604 26.7868 43.5627 26.5247 43.3674 26.3555C43.1753 26.1862 42.8726 26.1016 42.4592 26.1016H41.7707V28.2207ZM45.1887 27.0879C45.1887 27.8561 44.9478 28.4437 44.466 28.8506C43.9875 29.2575 43.3055 29.4609 42.4201 29.4609H41.7707V32H40.257V24.8613H42.5373C43.4032 24.8613 44.0607 25.0485 44.51 25.4229C44.9624 25.7939 45.1887 26.349 45.1887 27.0879ZM53.7158 28.4209C53.7158 29.6025 53.4229 30.5107 52.8369 31.1455C52.251 31.7803 51.4111 32.0977 50.3174 32.0977C49.2236 32.0977 48.3838 31.7803 47.7979 31.1455C47.2119 30.5107 46.9189 29.5993 46.9189 28.4111C46.9189 27.223 47.2119 26.3164 47.7979 25.6914C48.387 25.0632 49.2301 24.749 50.3271 24.749C51.4242 24.749 52.2624 25.0648 52.8418 25.6963C53.4245 26.3278 53.7158 27.236 53.7158 28.4209ZM48.5059 28.4209C48.5059 29.2184 48.6572 29.819 48.96 30.2227C49.2627 30.6263 49.7152 30.8281 50.3174 30.8281C51.5251 30.8281 52.1289 30.0257 52.1289 28.4209C52.1289 26.8128 51.5283 26.0088 50.3271 26.0088C49.7249 26.0088 49.2708 26.2122 48.9648 26.6191C48.6589 27.0228 48.5059 27.6234 48.5059 28.4209ZM60.1092 30.0176C60.1092 30.6621 59.8764 31.1699 59.4109 31.541C58.9487 31.9121 58.3042 32.0977 57.4773 32.0977C56.7156 32.0977 56.0418 31.9544 55.4559 31.668V30.2617C55.9376 30.4766 56.3445 30.6279 56.6766 30.7158C57.0118 30.8037 57.3178 30.8477 57.5945 30.8477C57.9266 30.8477 58.1805 30.7842 58.3563 30.6572C58.5353 30.5303 58.6248 30.3415 58.6248 30.0908C58.6248 29.9508 58.5857 29.8271 58.5076 29.7197C58.4295 29.609 58.3139 29.5033 58.1609 29.4023C58.0112 29.3014 57.7036 29.1403 57.2381 28.9189C56.8019 28.7139 56.4747 28.5169 56.2566 28.3281C56.0385 28.1393 55.8644 27.9196 55.7342 27.6689C55.604 27.4183 55.5389 27.1253 55.5389 26.79C55.5389 26.1585 55.7521 25.6621 56.1785 25.3008C56.6082 24.9395 57.2007 24.7588 57.9559 24.7588C58.327 24.7588 58.6801 24.8027 59.0154 24.8906C59.354 24.9785 59.7072 25.1022 60.075 25.2617L59.5867 26.4385C59.2059 26.2822 58.8901 26.1732 58.6395 26.1113C58.3921 26.0495 58.1479 26.0186 57.907 26.0186C57.6206 26.0186 57.4008 26.0853 57.2479 26.2188C57.0949 26.3522 57.0184 26.5264 57.0184 26.7412C57.0184 26.8747 57.0493 26.9919 57.1111 27.0928C57.173 27.1904 57.2706 27.2865 57.4041 27.3809C57.5408 27.472 57.8615 27.638 58.366 27.8789C59.0333 28.1979 59.4907 28.5186 59.7381 28.8408C59.9855 29.1598 60.1092 29.5521 60.1092 30.0176ZM62.1031 32V24.8613H63.6168V32H62.1031ZM68.8676 32H67.3539V26.1211H65.4154V24.8613H70.8061V26.1211H68.8676V32ZM76.716 32H72.6047V24.8613H76.716V26.1016H74.1184V27.6689H76.5354V28.9092H74.1184V30.75H76.716V32ZM88.5408 32H86.617L83.5115 26.5996H83.4676C83.5294 27.5534 83.5603 28.2337 83.5603 28.6406V32H82.2078V24.8613H84.117L87.2176 30.208H87.2518C87.2029 29.2803 87.1785 28.6243 87.1785 28.2402V24.8613H88.5408V32ZM97.5221 28.4209C97.5221 29.6025 97.2291 30.5107 96.6432 31.1455C96.0572 31.7803 95.2174 32.0977 94.1236 32.0977C93.0299 32.0977 92.19 31.7803 91.6041 31.1455C91.0182 30.5107 90.7252 29.5993 90.7252 28.4111C90.7252 27.223 91.0182 26.3164 91.6041 25.6914C92.1933 25.0632 93.0364 24.749 94.1334 24.749C95.2304 24.749 96.0686 25.0648 96.648 25.6963C97.2307 26.3278 97.5221 27.236 97.5221 28.4209ZM92.3121 28.4209C92.3121 29.2184 92.4635 29.819 92.7662 30.2227C93.0689 30.6263 93.5214 30.8281 94.1236 30.8281C95.3313 30.8281 95.9352 30.0257 95.9352 28.4209C95.9352 26.8128 95.3346 26.0088 94.1334 26.0088C93.5312 26.0088 93.0771 26.2122 92.7711 26.6191C92.4651 27.0228 92.3121 27.6234 92.3121 28.4209ZM105.624 28.3623C105.624 29.5374 105.289 30.4375 104.619 31.0625C103.951 31.6875 102.986 32 101.723 32H99.7016V24.8613H101.943C103.108 24.8613 104.013 25.1689 104.658 25.7842C105.302 26.3994 105.624 27.2588 105.624 28.3623ZM104.052 28.4014C104.052 26.8682 103.375 26.1016 102.021 26.1016H101.215V30.75H101.865C103.323 30.75 104.052 29.9671 104.052 28.4014ZM111.915 32H107.804V24.8613H111.915V26.1016H109.318V27.6689H111.735V28.9092H109.318V30.75H111.915V32Z"
        className="fill-accent2"
      />
      <rect
        x="13"
        y="41"
        width="27"
        height="49"
        rx="3"
        className="fill-accent2"
        fillOpacity="0.6"
      />
      <rect
        x="16"
        y="48"
        width="21"
        height="5"
        rx="2.5"
        className="fill-accent2"
      />
      <rect
        x="16"
        y="56"
        width="21"
        height="28"
        rx="2"
        className="fill-accent2"
      />
      <rect
        x="53"
        y="41"
        width="27"
        height="33"
        rx="3"
        className="fill-accent2"
        fillOpacity="0.6"
      />
      <rect
        x="88"
        y="68"
        width="27"
        height="45"
        rx="3"
        className="fill-accent2"
        fillOpacity="0.4"
      />
      <rect
        x="91"
        y="74"
        width="21"
        height="22"
        rx="2"
        className="fill-accent2"
        fillOpacity="0.8"
      />
      <rect
        x="91"
        y="99"
        width="21"
        height="9"
        rx="2"
        className="fill-accent2"
        fillOpacity="0.8"
      />
      <rect
        x="56"
        y="47"
        width="21"
        height="5"
        rx="2.5"
        className="fill-accent2"
      />
      <rect
        x="56"
        y="55"
        width="21"
        height="5"
        rx="2.5"
        className="fill-accent2"
      />
      <rect
        x="56"
        y="63"
        width="21"
        height="5"
        rx="2.5"
        className="fill-accent2"
      />
      <path
        d="M40 50C42.4074 50.1417 47.3185 52.04 47.7037 58.5C48.0889 64.96 51.3951 66.8583 53 67"
        className="stroke-accent2"
        stroke-width="0.5"
      />
      <path
        d="M80 63C81.4815 63.2417 84.5037 66.48 84.7407 77.5C84.9778 88.52 87.0123 91.7583 88 92"
        className="stroke-accent2"
        stroke-width="0.5"
      />
    </svg>
  );
};

export default memo(CompositePlot);
