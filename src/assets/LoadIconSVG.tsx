import { useMantineTheme } from "@mantine/styles";

const LoadIconSvg = () => {
  const theme = useMantineTheme();
  return (
    <div>
      {theme.colorScheme === "dark" ? (
        <svg
          width="10"
          height="13"
          viewBox="0 0 10 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 11.7H7.5V9.75C7.5 9.035 7.25521 8.42292 6.76562 7.91375C6.27604 7.40458 5.6875 7.15 5 7.15C4.3125 7.15 3.72396 7.40458 3.23438 7.91375C2.74479 8.42292 2.5 9.035 2.5 9.75V11.7ZM5 5.85C5.6875 5.85 6.27604 5.59542 6.76562 5.08625C7.25521 4.57708 7.5 3.965 7.5 3.25V1.3H2.5V3.25C2.5 3.965 2.74479 4.57708 3.23438 5.08625C3.72396 5.59542 4.3125 5.85 5 5.85ZM0 13V11.7H1.25V9.75C1.25 9.08917 1.39844 8.46896 1.69531 7.88937C1.99219 7.30979 2.40625 6.84667 2.9375 6.5C2.40625 6.15333 1.99219 5.69021 1.69531 5.11062C1.39844 4.53104 1.25 3.91083 1.25 3.25V1.3H0V0H10V1.3H8.75V3.25C8.75 3.91083 8.60156 4.53104 8.30469 5.11062C8.00781 5.69021 7.59375 6.15333 7.0625 6.5C7.59375 6.84667 8.00781 7.30979 8.30469 7.88937C8.60156 8.46896 8.75 9.08917 8.75 9.75V11.7H10V13H0Z"
            fill="#99F5FF"
          />
        </svg>
      ) : (
        <svg
          width="10"
          height="13"
          viewBox="0 0 10 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 11.7H7.5V9.75C7.5 9.035 7.25521 8.42292 6.76562 7.91375C6.27604 7.40458 5.6875 7.15 5 7.15C4.3125 7.15 3.72396 7.40458 3.23438 7.91375C2.74479 8.42292 2.5 9.035 2.5 9.75V11.7ZM5 5.85C5.6875 5.85 6.27604 5.59542 6.76562 5.08625C7.25521 4.57708 7.5 3.965 7.5 3.25V1.3H2.5V3.25C2.5 3.965 2.74479 4.57708 3.23438 5.08625C3.72396 5.59542 4.3125 5.85 5 5.85ZM0 13V11.7H1.25V9.75C1.25 9.08917 1.39844 8.46896 1.69531 7.88937C1.99219 7.30979 2.40625 6.84667 2.9375 6.5C2.40625 6.15333 1.99219 5.69021 1.69531 5.11062C1.39844 4.53104 1.25 3.91083 1.25 3.25V1.3H0V0H10V1.3H8.75V3.25C8.75 3.91083 8.60156 4.53104 8.30469 5.11062C8.00781 5.69021 7.59375 6.15333 7.0625 6.5C7.59375 6.84667 8.00781 7.30979 8.30469 7.88937C8.60156 8.46896 8.75 9.08917 8.75 9.75V11.7H10V13H0Z"
            fill="#2E83FF"
          />
        </svg>
      )}
    </div>
  );
};

export default LoadIconSvg;
