<p align="center">
  <a href="https://botmate.dev">
    <img src="./botmate.svg" width="80px" alt="BotMate logo" />
  </a>
</p>

<h3 align="center">
  Open-source bot management platform, self-hosted.
</h3>
<p align="center">
The ultimate platform for bot management, 100% JavaScript/TypeScript, flexible and customizable.
</p>

<p align="center"><a href="https://cloud.botmate.dev">Cloud (coming soon)</a> · <a href="https://docs.botmate.dev">Documentation</a> · <a href="https://t.me/chatbotmate">Telegram Chat</a></p>

<p align="center">
<img src="https://skillicons.dev/icons?i=ts,nodejs,mongo,tailwind"/>
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/github/repo-size/botmate/botmate" alt="reposize"/>
  <img src="https://img.shields.io/npm/v/%40botmate%2Fserver" alt="wakatime"/>
</p>

> [!IMPORTANT]  
> This project is still in beta, expect breaking changes and bugs.

BotMate is a web platform for managing multiple bots across different platforms, designed to be user-friendly for both developers and non-technical users. Quickly get your bots up and running with minimal setup. All you need is a single command to run in the terminal and you're good to go.

🌟 Please consider giving this project a star if you find it useful. It helps us to keep improving the project and adding new features. 😊

## Table of contents

- [Table of contents](#table-of-contents)
- [Features](#features)
  - [📦 Plugin system](#-plugin-system)
  - [💎 Easy to use](#-easy-to-use)
  - [🌎 Multi-platform](#-multi-platform)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [CLI](#cli)
  - [Docker (coming soon)](#docker-coming-soon)
- [Insights](#insights)

## Features

### 📦 Plugin system

BotMate comes with a built-in plugin system that allows developers to extend the platform with custom features. Other users can install these plugins with a single command. To learn more about creating plugins, check out the [documentation](https://docs.botmate.dev).

### 💎 Easy to use

With minimal setup, you can get your bots up and running in no time. BotMate is designed to be user-friendly for both developers and non-technical users alike. You can easily manage your bots from a single dashboard, making it easy to keep track of all your bots in one place.

### 🌎 Multi-platform

Ever wanted to manage all your bots in one place? BotMate supports multiple platforms, including Discord, Slack, and Telegram. You can easily manage all your bots from a single dashboard.

## Installation

Get started with BotMate in just a few steps. Run the following commands in your terminal to create a new BotMate project.

### Requirements

- Node.js (v20 or higher)
- pnpm (v8 or higher)
- Linux, macOS, Android, or Windows
- MongoDB ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))

### CLI

Run the following command to create a new BotMate project:

```bash
pnpm create botmate
```

After the project is created, navigate to the project directory and install the dependencies:

```bash
cd botmate
pnpm install
```

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL=mongodb://localhost:27017/botmate
```

Finally, start the development server:

```bash
pnpm dev
```

### Docker (coming soon)

> Docker images will be available soon.

## Insights

![Alt](https://repobeats.axiom.co/api/embed/8f15179799757d9039aa8a947b878e4fe47ff2df.svg 'Repobeats analytics image')
