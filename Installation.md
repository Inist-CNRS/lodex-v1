# Installation

## Requirements

Installing LODEX requires to have both
[mongodb](http://docs.mongodb.org/manual/installation/) 2.4+ and
[nodejs](http://nodejs.org/) installed (4 or more recent).

Although their installation is simple, it is different from one environment to
another.

Below are some suggestions, according to the Operating System you are using.

- [Linux](#linux)
- [Windows](#windows)
- [MacOS](#macos)

### Linux

#### MongoDB

- [Red Hat, CentOS, Fedora or Amazon Linux](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/)
- [Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)
- [Debian](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-debian/)
- [other Linux Systems](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/)

> **Warning:** only versions 2.4+ of Mongo were tested, these are not versions
avaible by default on Ubuntu 12.04, for example.

> **Tip:** another way is using [docker](https://www.docker.com/):
>  see [the official mongo image](https://hub.docker.com/_/mongo/).

#### NodeJS

Use a a 4.* version of [nodejs](http://nodejs.org/).

> **Tip:** use [nvm](https://github.com/creationix/nvm) to be able to choose
nodejs's version.

Once node is installed, go to the [`npm` step](#npm-installation).

### Windows

In general, pay attention to the version of Windows you use (32-bit or 64-bit), and download an MSI installer.

To find which version of Windows you are running, enter the following command in the Command Prompt:

```
wmic os get osarchitecture
```

#### MongoDB

See [install MongoDB on Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/).

Don't forget to create a `\data\db` at the root of the partition where you
installed Mongo, it will prevent the need to give parameters to the
`mongod.exe`.

> **Note:** if you did not choose `C:\`, use the Custom install process of
> mongodb to set the right installation path. Example: `D:\mongodb`.

> **Warning:** only versions 2.4+ of Mongo were tested.

Running `bin\mongod.exe` (in the installation directory) may require that you
give network authorizations (only the first time).

#### NodeJS

On [nodejs's downloads page](http://nodejs.org/download/), get the Windows MSI Installer (`v4.*.* LTS`), and use it.

#### Requirements

These requirements maybe already fullfilled on your machine:
- Python 2 installed
- .NET Framework 2.0 SDK (installed, and in the PATH)

#### Command Prompt

To launch LODEX, you'll need to open a new command prompt, then go to the [`npm` step](#npm-installation).

### MacOS

Install [Homebrew](http://brew.sh/), and then use it to install
[mongodb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) (v2.4+)
and [node](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#osx) (v4 LTS).


## npm installation

Once node is installed, you can install the `lodex` command itself by:

```bash
$ npm install --production lodex -g
```

> **Note:** the `--production` option is not required, it only prevents the
>  installation of development (and test) dependencies. If you intend
>  to run these tests, you can safely remove this option.

> **Note 2:** under Windows, you may need to use the `--msvs_version=2012`
> option, see this [StackOverflow page](http://stackoverflow.com/questions/14278417/cannot-install-node-modules-that-require-compilation-on-windows-7-x64-vs2012).

## Usage

Make sure mongodb is running, and then.

```bash
$ lodex
```

Then, point your browser to http://localhost:3000/
