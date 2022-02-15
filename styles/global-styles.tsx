import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    :root {
    --color-primary: #004e98;
    --color-primary-dark: #003668;
    --color-primary-light: #3a6ea5;
    --color-light: #fcfcfc;
    --color-accent: #ff6700;
    --color-accent-dark: #c24e00;
    --color-white: #ffffff;
    --color-black: #333333;

    --font-title: "Poppins", sans-serif;
    --font-body: "Lora", sans-serif;
    }

    html,
    body {
        padding: 0;
        margin: 0;
        font-family: "Lora", sans-serif;
        font-weight: 300;
        color: var(--color-black);
        line-height: 1.4;
    }

    a {
        color: var(--color-primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    section {
        margin: 2rem 0;      
    }

    * {
        box-sizing: border-box;
    }

    input {
        font-family: "Poppins", sans-serif;
    }

    input::-webkit-calendar-picker-indicator {
        display: none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: "Poppins", sans-serif;
        font-weight: 500;
    }
`;
