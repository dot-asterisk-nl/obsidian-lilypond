# Obsidian Lilypond Plugin

By Stardust ✨. I have been given full authorization to maintain this project and do not own complete rights. Full rights belong to them.
The added software license may not be correct, please use at your own discretion.

## What is it?

The Obsidian Lilypond Plugin has a simple function, that is, allow rendering [lilypond](https://en.wikipedia.org/wiki/LilyPond) in Obsidian! 🎵

## Setting up

Ensure you have [Lilypond installed](https://lilypond.org/). There is an option in the settings called "Lilypond Path".
This must be set to the `lilypond` executable. The default path for Linux is `/usr/bin/lilypond`, the default path for
Windows is `C:\Program Files (x86)\LilyPond\usr\bin\lilypond-windows.exe`.

## How to use

Write a code-block in your markdown files like so:

	```lily
		\score{
			\relative c' {a}
			\layout {}
		}
	```

The plugin allows for any kind of lilypond code to be used at this point in time.
