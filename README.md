# discord-emoji-generator
Generates emojis with a specified font for use on Discord.

## Usage
In the font field, users can specify any font family supported by HTML by default. Users
can also paste in a URL to a custom font of their choice.

**NOTE:** The URL must be to a supported font type, like `woff2` or `ttf`. If you are copying
the `src` attribute from a Google Font CSS file, be sure to use the Latin font face rather than
the Latin-ext version.

### TODO
- Add option to create [animated emojis](https://github.com/DenverCoder1/readme-typing-svg)

### Ideas
- Export each character in a sentence as a different emoji, adding names to an array as
an indicator that a letter doesn't need to be generated again, then download the lot of them
as a ZIP file.
	- Intended for use with custom fonts, to port them to Discord. Need to have different options
	for upper case and lower case as well.
	- Checkbox option to generate the whole alphabet, that way they can use as desired