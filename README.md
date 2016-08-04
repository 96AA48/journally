## journally

![journally in urxvt](https://i.imgur.com/8zM05pA.gif)
<sup>Logging a Windows 10 virtual machine startup</sup>

A simple wrapper around journalctl for realtime monitoring with colors and filtering.

## Install :
```
npm i journally -g
```

## Usage :
```
Usage:
  journally [OPTIONS] [MATCHES]
```

journally supports all of the flags and arguments from journalctl! (Thanks to [@gerrard00](https://github.com/gerrard00))  

Reference the options in the journalctl [man page](https://www.freedesktop.org/software/systemd/man/journalctl.html) or with `journally --help`.

## Configuration

You can configure journally with different colors and formats with the `~/.journallyrc` file:
```javascript
{
  "filters": [
    //If this value is the same as journalctl's SYSLOG_IDENTIFIER, the entry is ignored.
    "annoyingprogram"
  ],
  //Customisable output!
  "output": "{__realtime_timestamp.blue} {|.yellow} {syslog_identifier.green} {says.yellow} {message.green}"
  //Use JSON properties found in the journalctl json output and custom ones for stuff like 'says' or a '|' seperator.
  //To add some color with your desired color with a dot in front.
}
```
journalctl's JSON documentation can be found [here](https://www.freedesktop.org/wiki/Software/systemd/json/) or check the `reference.json` file in the package/repo for an example of the returned JSON object by journalctl.

## Contributing

If you want to add a feature to the project, feel free to either create an issue or to clone the repository and submit a pull request!

All help is welcome!

## LICENSE
Check out the `LICENSE` file for more information.
