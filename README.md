# Status Zero
Zero, as in, zero effort. This tool automates [Status Hero](https://statushero.com/) check-ins by retrieving all of the previous workday's commit logs and submitting them as your status update. You _are_ writing good commit messages, aren't you? Set it to run on a cron job and never think about check-ins again!

## Config
You must provide a `config.yaml` file with your configuration settings. Copy `config.example.yaml` to get started.

```
statusHeroUsername: 'my-username'
statusHeroPassword: 'my-password'
gitAuthor: 'Your author name from .gitconfig'
gitDirectories:
  - ~/path/to/your/project
  - ~/path/to/your/other/project
```
