# TSender Sample

A 100% client-side UI for the TSender contract. This sample project was made for the Full-Stack Web3 Development Crash Course of Cyfrin Updraft.

Test Website: https://ricardopintos.github.io/tsender-sample/

- [TSender Sample](#tsender-sample)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
    - [Environment Variables](#environment-variables)
    - [Mock token](#mock-token)
  - [Setup](#setup)
- [Testing](#testing)
  - [Unit](#unit)
  - [e2e](#e2e)
- [Acknowledgments](#acknowledgments)
- [Thank you](#thank-you)

<br>

![LokapalBanner](https://github.com/user-attachments/assets/14bc28f5-6c30-490c-8159-08acac29390b)

<br>

# Getting Started

## Requirements

- [node](https://nodejs.org/en/download)
    - You'll know you've installed it right if you can run `node --version` and get a response like `v23.0.1`
- [pnpm](https://pnpm.io/)
    - You'll know you've installed it right if you can run `pnpm --version` and get a response like `10.1.0`
- [git](https://git-scm.com/downloads)
    - You'll know you've installed it right if you can run `git --version` and get a response like `git version 2.33.0`

### Environment Variables

You'll need a `.env.local` the following environment variables:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Project ID from [reown cloud](https://cloud.reown.com/)

### Mock token

- Mock token address: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

## Setup

```bash
git clone https://github.com/RicardoPintos/tsender-sample
cd tsender-sample
pnpm install
pnpm anvil
```

You'll want to make sure you have a Metamask/Rabby wallet connected to your anvil instance. Ideally you're connected to the wallet that comes with the default anvil instance. This will have some mock tokens in it.

Then, in a second browser run:

```bash
pnpm run dev
```

# Testing

## Unit

```bash
pnpm test:unit
```

## e2e

Playwright should also install the browsers needed to run tests.

To test e2e, do the following

```bash
pnpm cache
```

Then run:

```bash
pnpm test:e2e
```

This will throw an error like:

```
Error: Cache for 08a20e3c7fc77e6ae298 does not exist. Create it first!
```

The `08a20e3c7fc77e6ae298` is your `CACHE_NAME`

In your `.cache-synpress` folder, rename the folder that isn't `metamask-chrome-***` to your `CACHE_NAME`.

Then, you should be able to run:

```
pnpm test:e2e
```

And it'll work!


<br>

# Acknowledgments

Thanks to the Cyfrin Updraft team and to Patrick Collins for their amazing work. Please check out their courses on [Cyfrin Updraft](https://updraft.cyfrin.io/courses).

<br>

# Thank you

If you appreciated this, feel free to follow me!

[![Ricardo Pintos Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=x&logoColor=white)](https://x.com/pintosric)
[![Ricardo Pintos Linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ricardo-mauro-pintos/)
[![Ricardo Pintos YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@PintosRic)

![EthereumBanner](https://github.com/user-attachments/assets/8a1c6e53-2e66-4256-9312-252a0360b7df)