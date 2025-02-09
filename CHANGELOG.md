# Changelog

## [1.5.1](https://github.com/brunsviga13rk/emulator/compare/v1.5.0...v1.5.1) (2025-02-09)


### Bug Fixes

* react router in sub paths not serving assets ([#97](https://github.com/brunsviga13rk/emulator/issues/97)) ([91b9dcf](https://github.com/brunsviga13rk/emulator/commit/91b9dcf41d1b64fe5964edc8e343c5131c7610e8))

## [1.5.0](https://github.com/brunsviga13rk/emulator/compare/v1.4.1...v1.5.0) (2025-02-09)


### Features

* add custom title logo ([#82](https://github.com/brunsviga13rk/emulator/issues/82)) ([43a7998](https://github.com/brunsviga13rk/emulator/commit/43a7998a89ca02def0397899080e49d447ef8ce4))
* add embed page route ([#96](https://github.com/brunsviga13rk/emulator/issues/96)) ([d69d718](https://github.com/brunsviga13rk/emulator/commit/d69d718ee693e316c012c709f30769d9a1ea305e))
* reduce addition and multiplication steps ([a1c85da](https://github.com/brunsviga13rk/emulator/commit/a1c85da188deebe9db301b28cc33e2a647e0c2cd))


### Bug Fixes

* calculation solver producing wrong sequence ([#87](https://github.com/brunsviga13rk/emulator/issues/87)) ([a1c85da](https://github.com/brunsviga13rk/emulator/commit/a1c85da188deebe9db301b28cc33e2a647e0c2cd))
* memoize renderer component ([dd9bd57](https://github.com/brunsviga13rk/emulator/commit/dd9bd57c5c6a6fa6a1858f115405b06d63747519))
* overwrite token value when undefined in toString() ([a1c85da](https://github.com/brunsviga13rk/emulator/commit/a1c85da188deebe9db301b28cc33e2a647e0c2cd))
* prevent unecessary editor reloads ([#85](https://github.com/brunsviga13rk/emulator/issues/85)) ([dd9bd57](https://github.com/brunsviga13rk/emulator/commit/dd9bd57c5c6a6fa6a1858f115405b06d63747519))
* remove parameter of `shift_left` `shift_right` from Lua API ([#95](https://github.com/brunsviga13rk/emulator/issues/95)) ([2d0b026](https://github.com/brunsviga13rk/emulator/commit/2d0b0263d521a20f4e014849694714ce95a04f58))
* rename sub call to subtract in Lua API template ([a1c85da](https://github.com/brunsviga13rk/emulator/commit/a1c85da188deebe9db301b28cc33e2a647e0c2cd))
* resize canvas when needed ([#84](https://github.com/brunsviga13rk/emulator/issues/84)) ([7bff021](https://github.com/brunsviga13rk/emulator/commit/7bff02122d10e88ba23f8146a3d9ec46d6dd12ff))
* set link for docs to deployed mkdocs github page ([#89](https://github.com/brunsviga13rk/emulator/issues/89)) ([61ea1f4](https://github.com/brunsviga13rk/emulator/commit/61ea1f4763584baba869e868d916bb87a9b80ba4))
* swap links for docs and emulator ([#92](https://github.com/brunsviga13rk/emulator/issues/92)) ([abec47c](https://github.com/brunsviga13rk/emulator/commit/abec47cced3b2d97af9e6056f5c8562a60cb99ca))

## [1.4.1](https://github.com/brunsviga13rk/emulator/compare/v1.4.0...v1.4.1) (2025-02-06)


### Bug Fixes

* bump Lua API to 1.4.1 ([#80](https://github.com/brunsviga13rk/emulator/issues/80)) ([b667f60](https://github.com/brunsviga13rk/emulator/commit/b667f60d27ca932531d4529db54f9ed669dec97c))

## [1.4.0](https://github.com/brunsviga13rk/emulator/compare/v1.3.0...v1.4.0) (2025-02-06)


### Features

* add calculator demo ([b28cf05](https://github.com/brunsviga13rk/emulator/commit/b28cf0525b28d348f3b746352882188ed76b2728))
* add general animation event capture ([0e9a4be](https://github.com/brunsviga13rk/emulator/commit/0e9a4be9aee3c13e1af95da4409b2664a645c844))
* add multiplication algorithm to solver ([b28cf05](https://github.com/brunsviga13rk/emulator/commit/b28cf0525b28d348f3b746352882188ed76b2728))
* add register dashboard ([0e9a4be](https://github.com/brunsviga13rk/emulator/commit/0e9a4be9aee3c13e1af95da4409b2664a645c844))
* add synchronous get API ([0e9a4be](https://github.com/brunsviga13rk/emulator/commit/0e9a4be9aee3c13e1af95da4409b2664a645c844))
* add tamplate for Lua API ([0e9a4be](https://github.com/brunsviga13rk/emulator/commit/0e9a4be9aee3c13e1af95da4409b2664a645c844))
* brunsviga api ([#76](https://github.com/brunsviga13rk/emulator/issues/76)) ([b28cf05](https://github.com/brunsviga13rk/emulator/commit/b28cf0525b28d348f3b746352882188ed76b2728))
* implement debugger interface for solver ([0e9a4be](https://github.com/brunsviga13rk/emulator/commit/0e9a4be9aee3c13e1af95da4409b2664a645c844))
* redesign UI with MUI ([#78](https://github.com/brunsviga13rk/emulator/issues/78)) ([0e9a4be](https://github.com/brunsviga13rk/emulator/commit/0e9a4be9aee3c13e1af95da4409b2664a645c844))


### Bug Fixes

* overflow computation when offset &gt; 0 ([b28cf05](https://github.com/brunsviga13rk/emulator/commit/b28cf0525b28d348f3b746352882188ed76b2728))

## [1.3.0](https://github.com/brunsviga13rk/emulator/compare/v1.2.0...v1.3.0) (2025-01-29)


### Features

* add loading indicator ([#71](https://github.com/brunsviga13rk/emulator/issues/71)) ([51e676a](https://github.com/brunsviga13rk/emulator/commit/51e676a431e0f6a1ce4b936d6de10b391b2e8835))
* add sprocket offset ([a558d5b](https://github.com/brunsviga13rk/emulator/commit/a558d5b0d295fd2a05729d9044df06177ce38d77))
* redesign user interface ([#61](https://github.com/brunsviga13rk/emulator/issues/61)) ([d5763d7](https://github.com/brunsviga13rk/emulator/commit/d5763d7fd27c4d6a5b1d901c7de421499519a4d7))
* sled events ([#72](https://github.com/brunsviga13rk/emulator/issues/72)) ([a558d5b](https://github.com/brunsviga13rk/emulator/commit/a558d5b0d295fd2a05729d9044df06177ce38d77))

## [1.2.0](https://github.com/brunsviga13rk/emulator/compare/v1.1.0...v1.2.0) (2025-01-24)


### Features

* add conditions for event handling ([e858702](https://github.com/brunsviga13rk/emulator/commit/e85870254f84146636c8078cdf4e59d1d1968ab3))
* implement commata slider ([e858702](https://github.com/brunsviga13rk/emulator/commit/e85870254f84146636c8078cdf4e59d1d1968ab3))
* make project version as variable available ([17934d3](https://github.com/brunsviga13rk/emulator/commit/17934d3e6a4474ca13f90c452ed3cf042ed01660))
* user input recommendation at bottom panel ([#60](https://github.com/brunsviga13rk/emulator/issues/60)) ([17934d3](https://github.com/brunsviga13rk/emulator/commit/17934d3e6a4474ca13f90c452ed3cf042ed01660))


### Bug Fixes

* counter sprocket mixed up names ([e858702](https://github.com/brunsviga13rk/emulator/commit/e85870254f84146636c8078cdf4e59d1d1968ab3))
* incorrect bounding calculation for mouse events ([e858702](https://github.com/brunsviga13rk/emulator/commit/e85870254f84146636c8078cdf4e59d1d1968ab3))

## [1.1.0](https://github.com/brunsviga13rk/emulator/compare/v1.0.0...v1.1.0) (2025-01-22)


### Features

* add counter sprocket ([2c51427](https://github.com/brunsviga13rk/emulator/commit/2c514271cdb39defb67bed93c597b3ea8d993912))
* add deletion handle ([#49](https://github.com/brunsviga13rk/emulator/issues/49)) ([2c51427](https://github.com/brunsviga13rk/emulator/commit/2c514271cdb39defb67bed93c597b3ea8d993912))
* add event system ([#47](https://github.com/brunsviga13rk/emulator/issues/47)) ([0f75a30](https://github.com/brunsviga13rk/emulator/commit/0f75a30f25850ac8ce220af8af9540da96e7dc1f))


### Bug Fixes

* prevent handles from being spammed ([2c51427](https://github.com/brunsviga13rk/emulator/commit/2c514271cdb39defb67bed93c597b3ea8d993912))
* rename sprocket wheels with wrong numbers in name ([0f75a30](https://github.com/brunsviga13rk/emulator/commit/0f75a30f25850ac8ce220af8af9540da96e7dc1f))

## [1.0.0](https://github.com/brunsviga13rk/emulator/compare/v0.2.0...v1.0.0) (2025-01-16)


### ⚠ BREAKING CHANGES

* port from react-three to three.js
* react three to three js ([#43](https://github.com/brunsviga13rk/emulator/issues/43))

### Features

* add selectable interface ([6410801](https://github.com/brunsviga13rk/emulator/commit/6410801904f175e6c5fc3277d970e20dc8493634))
* add sprocket wheel class ([6410801](https://github.com/brunsviga13rk/emulator/commit/6410801904f175e6c5fc3277d970e20dc8493634))
* add warning in case of  missing WebGL 2 support ([6410801](https://github.com/brunsviga13rk/emulator/commit/6410801904f175e6c5fc3277d970e20dc8493634))
* rename sub meshes of brunsviga model ([c0a1c3d](https://github.com/brunsviga13rk/emulator/commit/c0a1c3df4dd7bdcdea5786017c924cb419adc9e4))
* selectable handles ([#38](https://github.com/brunsviga13rk/emulator/issues/38)) ([c0a1c3d](https://github.com/brunsviga13rk/emulator/commit/c0a1c3df4dd7bdcdea5786017c924cb419adc9e4))


### Bug Fixes

* baseplane offset ([#36](https://github.com/brunsviga13rk/emulator/issues/36)) ([2098225](https://github.com/brunsviga13rk/emulator/commit/209822551bacd667e3b893cfd852f8216f87298a))
* make orbit control the default ([#34](https://github.com/brunsviga13rk/emulator/issues/34)) ([261ab29](https://github.com/brunsviga13rk/emulator/commit/261ab2965aa2ac68465717c2d842a8058ca85406))


### Code Refactoring

* port from react-three to three.js ([6410801](https://github.com/brunsviga13rk/emulator/commit/6410801904f175e6c5fc3277d970e20dc8493634))
* react three to three js ([#43](https://github.com/brunsviga13rk/emulator/issues/43)) ([6410801](https://github.com/brunsviga13rk/emulator/commit/6410801904f175e6c5fc3277d970e20dc8493634))

## [0.2.0](https://github.com/brunsviga13rk/emulator/compare/v0.1.1...v0.2.0) (2025-01-06)


### Features

* add 3d gizmo ([c94cded](https://github.com/brunsviga13rk/emulator/commit/c94cdedff4a8f08f2ed31daa6fe625898d9c9f2b))
* add 3d gizmo ([#25](https://github.com/brunsviga13rk/emulator/issues/25)) ([c94cded](https://github.com/brunsviga13rk/emulator/commit/c94cdedff4a8f08f2ed31daa6fe625898d9c9f2b))
* add concept base model ([#31](https://github.com/brunsviga13rk/emulator/issues/31)) ([7bafefb](https://github.com/brunsviga13rk/emulator/commit/7bafefb5aef6428f30211b4b0c467d19e0156aaf))
* add GitHub icon to source link ([905aea6](https://github.com/brunsviga13rk/emulator/commit/905aea648765caec19908159bee0eef0541d6f01))
* add link icons ([#23](https://github.com/brunsviga13rk/emulator/issues/23)) ([905aea6](https://github.com/brunsviga13rk/emulator/commit/905aea648765caec19908159bee0eef0541d6f01))
* add people icon to credits ([905aea6](https://github.com/brunsviga13rk/emulator/commit/905aea648765caec19908159bee0eef0541d6f01))
* add studio environment map licensed CC0 ([7bafefb](https://github.com/brunsviga13rk/emulator/commit/7bafefb5aef6428f30211b4b0c467d19e0156aaf))
* add thesis link icon ([905aea6](https://github.com/brunsviga13rk/emulator/commit/905aea648765caec19908159bee0eef0541d6f01))
* base gradient ([#26](https://github.com/brunsviga13rk/emulator/issues/26)) ([0c0bc28](https://github.com/brunsviga13rk/emulator/commit/0c0bc2848794024720af96e8272f2f4d5454bc72))

## [0.1.1](https://github.com/brunsviga13rk/emulator/compare/v0.1.0...v0.1.1) (2024-12-04)


### Bug Fixes

* rename html page ([#18](https://github.com/brunsviga13rk/emulator/issues/18)) ([76acf10](https://github.com/brunsviga13rk/emulator/commit/76acf107016f367710c405420997d763f29601a8))

## [0.1.0](https://github.com/brunsviga13rk/emulator/compare/v0.1.0...v0.1.0) (2024-12-04)


### Features

* add link to GitHub emulator repository ([#4](https://github.com/brunsviga13rk/emulator/issues/4)) ([4fb6054](https://github.com/brunsviga13rk/emulator/commit/4fb605494bdd6a632350d1a903cf17492dfed076))


### Continuous Integration

* add content write permission to artifact upload ([#12](https://github.com/brunsviga13rk/emulator/issues/12)) ([3697b08](https://github.com/brunsviga13rk/emulator/commit/3697b082b9d3b3109c1dd7ecc518520bf5b044c0))
* add release please action ([#1](https://github.com/brunsviga13rk/emulator/issues/1)) ([a78ec8e](https://github.com/brunsviga13rk/emulator/commit/a78ec8e02f716763001e5a33e80c3fea4d0957d2))



## 0.0.1 (2024-12-04)


### Continuous Integration

* add release please action ([#1](https://github.com/brunsviga13rk/emulator/issues/1)) ([a78ec8e](https://github.com/brunsviga13rk/emulator/commit/a78ec8e02f716763001e5a33e80c3fea4d0957d2))
