# Braille-Art

A web page to easily create and transform braille pictures. Braille Art can be created by providing any BTTV, FFZ, global or Twitch Channel emote or a custom image through link or upload.
<br>

## Usage
When generating with the *Replace blank characters* checkbox ticked, blank braille characters "⠀" (__not spaces__) will be replaced with "⠄" (__not a dot but a single braille character__).

The *dithering* option changes the way the pictures are generated. With this option not ticked, the pictures are generated with simple __color tresholds__. Results from both __ordered dithering__ and __Floyd–Steinberg dithering__ can look better, depending on the picture at hand.

The rest of the controls should be self explanatory.

<br>

## Code
Parts of the functionality are achieved through a javascript implementation of the [PyBrailleArt](https://github.com/VJ-Duardo/PyBrailleArt) library.

<br>

__Used API's and services:__
* [Twitch Emotes](https://twitchemotes.com/apidocs)
* [BetterTTV](https://betterttv.com/)
* [FrankerFaceZ](https://frankerfacez.com/developers)
* [CORS Anywhere](https://github.com/Rob--W/cors-anywhere)
