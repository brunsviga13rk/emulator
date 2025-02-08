
<div align="center">
    <img alt="icon" src="./public/brunsviga_icon.svg" width="30%"/>
</div>

<div align="center">
    <h2>Brunsviga 13 RK emulator</h2>
    <p>
        Web based emulation of the Brunsviga 13 RK
        mechanical calculator from the 1950s.
    </p>
    <img src="https://img.shields.io/github/check-runs/brunsviga13rk/emulator/main">
    <img src="https://img.shields.io/github/deployments/brunsviga13rk/emulator/github-pages?label=deployment">
    <img src="https://img.shields.io/github/package-json/v/brunsviga13rk/emulator">
    <img src="https://img.shields.io/github/license/brunsviga13rk/emulator">
    <img src="https://img.shields.io/github/languages/top/brunsviga13rk/emulator">
    <br>
    <img src="https://img.shields.io/badge/MUI-%230081CB.svg?logo=mui&logoColor=white">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?logo=react&logoColor=%2361DAFB">
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?logo=tailwind-css&logoColor=white">
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?logo=vite&logoColor=white">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/lua-%232C2D72.svg?logo=lua&logoColor=white">
    <img src="https://img.shields.io/badge/github%20pages-121013?logo=github&logoColor=white">
    <br>
    <br>
    <a href="https://brunsviga13rk.github.io/emulator">Demo<a/> |
    <a href="https://brunsviga13rk.github.io/docs">Docs<a/> |
    <a href="https://github.com/brunsviga13rk/thesis">Paper<a/>
</div>
<br>

# Features

- Fully interactive 3D visualization
- Automatically generate steps for calculation
- Lua scripting

# Technology

For the purpose of simplicity and due to the small scale of this project the
following list of frameworks and build systems was chosen:

- ⚡ Vite (for building)
- 🌐 React (simple UI)
- 🎁 Three.js (WebGL abstraction)
- 🧻 Typescript (typesafe(r) Javascript)
- 🌪️ Tailwind CSS (styling through classes)
- 🌍 Material UI
- 🌕 Lua scripting
- 🔥 Phosphor Icons

# Quick Start

Make sure you have `npm` and `git` installed. Clone this repository and run the
following commands:
```sh
npm install && npm run dev .
```
This will install all required dependencies and start the emulation by
running a web server on port `5173`. You can now visit:
[http://localhost:5173](http://localhost:5173).

# Docker

Alternatively to compiling and running the emulation natively with node,
a ready to use Dockerfile can be used to build and run the emulation.
First, build the image:
```sh
docker build --tag brunsviga13rk/emulation:git .
```
Then you can create a container from the image and bind it to a local port:
```sh
docker run -p 8080:80 brunsviga13rk/emulation:git
```
You can now visit:
[http://localhost:8080](http://localhost:8080).

# Workflow

The workflow for developer looks like the following:
Features, bugfixes or other works are committed to in dedicated branches
categorized by the work done in them. For example a feature "add XYZ" maybe
developed in a branch "feat/add-xyz". When ready this branch is squash merged
into main. An action will automatically add the changes to a release pull
request and increment the version number if needed. When a new version shall
be released the release pull request is merged and automatically, the container
image is build and pushed to GHCR. Additionally the application is deployed to
a GitHub page [here](https://brunsviga13rk.github.io/emulator/).

```mermaid
sequenceDiagram
    actor Developer
    participant Repository
    participant Checks
    participant Release-Please
    participant Deploy
    participant Docker

    Developer ->> Repository: Push to development branch
    Repository ->> Checks: Run mandatory checks
    Checks ->> Developer: Allow merge into main
    Developer ->> Repository: squash merge feature/bugfix, ...
    Repository ->> Checks: Run checks on main
    Repository ->> Release-Please: Track changes in PR
    Developer ->> Repository: Merge release PR
    Repository ->> Checks: Run checks on main
    Repository ->> Release-Please: Create release and tag commit
    Repository ->> Docker: Build & upload OCI container for release
    Repository ->> Deploy: Deploy to pages
```
