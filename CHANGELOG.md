# Changelog

## [4.0.0](https://github.com/npm/parse-conflict-json/compare/v3.0.1...v4.0.0) (2024-09-24)
### ⚠️ BREAKING CHANGES
* `parse-conflict-json` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`2ff0df4`](https://github.com/npm/parse-conflict-json/commit/2ff0df4d37cb149ccd21481c8b26fd1b9aa316c7) [#97](https://github.com/npm/parse-conflict-json/pull/97) align to npm 10 node engine range (@hashtagchris)
### Dependencies
* [`5d1036d`](https://github.com/npm/parse-conflict-json/commit/5d1036dd519c3e8986ebaf9992e8ac4beb4224e1) [#97](https://github.com/npm/parse-conflict-json/pull/97) `json-parse-even-better-errors@4.0.0`
### Chores
* [`bbad0b5`](https://github.com/npm/parse-conflict-json/commit/bbad0b53516ca113241a1dbb1e5e60e35ba34919) [#97](https://github.com/npm/parse-conflict-json/pull/97) run template-oss-apply (@hashtagchris)
* [`aaa60b6`](https://github.com/npm/parse-conflict-json/commit/aaa60b66feb4eec118dfb01bce5fb4fb08a28ae7) [#96](https://github.com/npm/parse-conflict-json/pull/96) enable auto publish (#96) (@reggi)
* [`ceb69ec`](https://github.com/npm/parse-conflict-json/commit/ceb69ecb12523db7b01ea32dfd000d811b12791d) [#93](https://github.com/npm/parse-conflict-json/pull/93) bump @npmcli/eslint-config from 4.0.5 to 5.0.0 (@dependabot[bot])
* [`5724d51`](https://github.com/npm/parse-conflict-json/commit/5724d51bf2ae67842d89e027b0d5c48ae1afa23b) [#80](https://github.com/npm/parse-conflict-json/pull/80) bump @npmcli/template-oss to 4.22.0 (@lukekarrys)
* [`46686e2`](https://github.com/npm/parse-conflict-json/commit/46686e2baf57cd0afb4ee76ded4fad8637448d8d) [#94](https://github.com/npm/parse-conflict-json/pull/94) postinstall for dependabot template-oss PR (@hashtagchris)
* [`0694002`](https://github.com/npm/parse-conflict-json/commit/069400257a1b2e80d1a333ef9e6b9ba07f053f67) [#94](https://github.com/npm/parse-conflict-json/pull/94) bump @npmcli/template-oss from 4.23.1 to 4.23.3 (@dependabot[bot])

## [3.0.1](https://github.com/npm/parse-conflict-json/compare/v3.0.0...v3.0.1) (2023-03-16)

### Dependencies

* [`13f103a`](https://github.com/npm/parse-conflict-json/commit/13f103aba82f7ae65bea45c8075395bb1627d3f5) [#42](https://github.com/npm/parse-conflict-json/pull/42) bump just-diff from 5.2.0 to 6.0.0 (#42)

## [3.0.0](https://github.com/npm/parse-conflict-json/compare/v2.0.2...v3.0.0) (2022-10-12)

### ⚠️ BREAKING CHANGES

* `parse-conflict-json` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

* [`97eebf8`](https://github.com/npm/parse-conflict-json/commit/97eebf80dadec116682975047ace974c7989a4ed) [#27](https://github.com/npm/parse-conflict-json/pull/27) postinstall for dependabot template-oss PR (@lukekarrys)

### Dependencies

* [`11ac781`](https://github.com/npm/parse-conflict-json/commit/11ac781a568ad814de8ce021f201d1c03f5ca38f) [#33](https://github.com/npm/parse-conflict-json/pull/33) bump json-parse-even-better-errors from 2.3.1 to 3.0.0

### [2.0.2](https://github.com/npm/parse-conflict-json/compare/v2.0.1...v2.0.2) (2022-03-28)


### Dependencies

* bump just-diff-apply from 4.0.1 to 5.2.0 ([#12](https://github.com/npm/parse-conflict-json/issues/12)) ([3cdeb20](https://github.com/npm/parse-conflict-json/commit/3cdeb2088594229d7d0364d837edc68636e8e27e))

## v2.0.1

### Bug Fixes

Move @npmcli/template-oss to a dev dependency

## v2.0.0

### BREAKING CHANGES

BREAKING CHANGE: drops suport for node <= 10 and non LTS versions of
node 12 and node 14

### Bug Fixes

Don't set global object properties
