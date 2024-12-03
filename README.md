
<div align="center">
    <img alt="icon" src="./public/brunsviga_icon.svg" width="30%"/>

    <h2>Brunsviga 13 RK emulator</h2>
    <p>
        Web based emulation of the Brunsviga 13 RK
        mechanical calculator from the 1950s.
    </p>
</div>

# Technology

For the purpose of simplicity and due to the small scale of this project the
following list of frameworks and build systems was chosen:

- Vite (for building)
- React (simple UI)
- Three.js (WebGL abstraction)
- Typescript (typesafe(r) Javascript)
- Tailwind CSS (styling through classes)

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
