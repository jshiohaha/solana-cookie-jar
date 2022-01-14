<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/jshiohaha/solana-cookie-jar">
    <center>
      <img src="images/cookie-monster.png" alt="cookie monster" width="75" />
    </center>
  </a>

  <h1 align="center">Solana Cookie Jar</h3>
  <p align="center">
    Library for embedded React components that enable anyone to send SOL and SPL tokens 🍬
    <br />
    <a href="#">Demo (soon)</a>
    ·
    <a href="https://github.com/jshiohaha/solana-cookie-jar/issues">Report Bug</a>
    ·
    <a href="https://github.com/jshiohaha/solana-cookie-jar/issues">Request Feature</a>
  </p>
</div>

## About The Project

![cookie-jar-demo](images/cookie-jar-demo.gif)

This library allows anyone to embed SOL and SPL token transfers into a React project. The goal is to help builders create increasingly richer Solana dApps.

CookieJar makes token transfers _~super easy~_ with the top level `CookieJar` component. You can also customize implementation with individual components that allow users to select tokens from a connected wallet, input a token amount, invoke a wallet signature request to authorize a token transfer, and more!

Some initial use cases include:

-   custom application token transfers,
-   tipping mechanic for content, or
-   payment functionality gating content or dApp functionality

Obviously, this list is very short. I'm sure there will be a plethora of ideas and use cases over time.

Don't get burnt by creating components in your own oven — use CookieJar 🍪

### Built With

-   [React.js](https://reactjs.org/)
-   [Typescript](https://www.typescriptlang.org)
-   [@project-serum/anchor docs](https://project-serum.github.io/anchor/getting-started/introduction.html)
-   [@solana/web3.js docs](https://solana-labs.github.io/solana-web3.js/)

## Getting Started

This section covers how you can setup up this project locally. If any steps are missing or you can add additional context, open a pull request with your changes.

### Prerequisites

You must have `npm` or `yarn` installed before working with this library locally. Depending on your operating system, there will be different approaches to installing these libraries.

The internet already has copious documentation on this, so I wonn't repeat here. It's just a internet quick search away.

### Installation

1. Clone the repo

```sh
git clone https://github.com/jshiohaha/solana-cookie-jar.git
```

2. Navigate to new directory with repository

```sh
cd solana-cookie-jar
```

3. Install required packages

```sh
yarn
```

4. Build code

```sh
yarn build
```

5. Explore other script commands in [package.json](https://github.com/jshiohaha/solana-cookie-jar/blob/main/package.json).

## Usage

Using the out-of-the-box CookieJar component is easy. It allows the caller to easily

-   specify which network the component connects to (e.g. devnet, testnet, or mainnet)
-   decide wether or not to show text input to attach a message via the [SPL Memo program](https://spl.solana.com/memo)
-   include an input component to control token input amount
-   include a token selector based on tokens in a wallet
-   send SOL or SPL tokens via invoking signed transactions from the browser

### Out-of-the-box CookieJar Component

```
import { ENV } from "@solana/spl-token-registry";
import { PublicKey } from '@solana/web3.js';
import { CookieJar } from "solana-cookie-jar";

// configure as variable, react state, environment variable, etc.
const destinationAddress = somePublicKey;

// create WalletContextState by connecting wallet via @solana/wallet-adapter-react
const walletStore = walletContextStateInstance;

<CookieJar
    title="Send Tokens"
    actionButtonText="Send"
    // optional: default is ENV.MainnetBeta
    env={ENV.MainnetBeta}
    // @ts-ignore
    walletContextState={walletStore}
    destinationAddress={destinationAddress}
    onError={(err: Error) => console.log('custom error callback function. error: ', err)}
    onSubmit={(signature: string | undefined) => console.log('on successful transaction handler: ', signature)}
/>
```

### Alternative Options

The sub-components that make up the default CookieJar component are exported from this library. So, you can piece together your own custom CookieJar as you please.

You could also fork this repo and add your own features/updates via a pull request. Or, fork this repo and work on your own independent implemenation, if you please.

If you're going to develop locally, you will need to reference the local component since you will be working with a non-published version. You might run into issues if you do not setup local development correctly. I personally ran into an "invalid hook" issue, which was solved by [this StackOverflow post](https://sm-stackoverflow.azurefd.net/questions/56021112/react-hooks-in-react-library-giving-invalid-hook-call-error/57422196).

## Roadmap

-   [] Add base components for genesis version 🥳
-   [] Add a changelog
-   [] Add a working demo
-   [] Create common package for shared logic/components
-   [] Improve documentation 🔁
-   [] More to come 🧞

See the [open issues](https://github.com/jshiohaha/solana-cookie-jar/issues) for a full list of proposed features (and known issues).

## Contributing

Any contributions to improve and/or extend the library are **greatly appreciated** 🙂

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewCookieRecipe`)
3. Commit your Changes (`git commit -m 'Add some NewCookieRecipe'`)
4. Push to the Branch (`git push origin feature/NewCookieRecipe`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Jacob Shiohira - [@jshiohaha](https://twitter.com/jshiohaha) - dev@jacobshiohira.com

Project Link: [https://github.com/jshiohaha/solana-cookie-jar](https://github.com/jshiohaha/solana-cookie-jar)

## Acknowledgments

I couldn't have done this without the work of many before myself. Below are links to documentation for libraries & tech integral to building this library. There are likely many that I missed, so I hope to keep adding more over time.

-   [React docs](https://github.com/jshiohaha/solana-cookie-jar)
-   [@project-serum/anchor docs](https://project-serum.github.io/anchor/getting-started/introduction.html)
-   [@solana/web3.js docs](https://solana-labs.github.io/solana-web3.js/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[cookie-monster]: images/cookie-monster.pn