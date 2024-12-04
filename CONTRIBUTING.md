# Contributing

Feel free to contribute by opening issues or pull requests through forks.
Please make sure to use conventional commits as outlined below.
Merging is done by maintainers and owner of the repository.

# Conventional Commits

This project makes use of Google's release please action for GitHub. Thus
commit messages shall be written as specified by the conventional commits
standard as these are required to determine version increments, generate
changelogs and eventually build releases.

A quick rundonw of conentional commits can be found
[here](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13).

Sources:
- [Release-Please](https://github.com/googleapis/release-please-action)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0)

# Releases

Do not create releases or tags manually. This process is fully automated by
the `release-please` action. Changes made to the main branch are tracked in a
release pull requests that when merged creates a release and tags the commit.
This will trigger the build and upload of the docker container to GitHub's
registry as well as adding the static files to the release as artifact.
