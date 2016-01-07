# LODEX

LODEX is an experimentation aiming to link [ISTEX](http://www.istex.fr) data to the web of data.

> **Warning**: LODEX is not funded by ISTEX.

## Start

To start `lodex`:

```bash
$ lodex /path/to/repository
```

The repository pointed can be empty.

## Settings

You can put your settings in any of these paths:

- `./.lodexrc` (or any upper level repository: `../`, `../../`, *etc*.)
- `$HOME/.lodexrc`
- `$HOME/.lodex/config`
- `$HOME/.config/lodex`
- `$HOME/.config/lodex/config`
- `/etc/lodexrc`
- `/etc/lodex/config`

Or you can pass it:

- in command line arguments,
- in variables prefixed with `lodex`,
- via an option `--config file`, then from that file.

## Contribute
