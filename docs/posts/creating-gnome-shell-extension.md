---
layout: Post
title: "Creating a Gnome Shell Extension is annoying"
date: 2022-06-22
subtitle: "Why is gnome-shell like this?"
useHeaderImage: true
headerImage: /img/posts/creating-gnome-shell-extension/header.webp
headerMask: rgba(40, 57, 101, .4)
tags:

- dev
- software

---

I've been developing and maintaining a Gnome Shell extension for some time. I don't have much love for the whole
process.

<!-- more -->

[Sp-tray](https://github.com/esenliyim/sp-tray) is the extension I've created. It doesn't do a whole lot, really. Uses
DBus to get the metadata information from Spotify, and just displays it on the system tray or whatever it is called in
Gnome. Though I've given a lot of freedom in customizing _how_ the information is displayed, which I'm kinda proud of.
That's not the point of this post though. The point is, creating a Gnome Shell extension is not fun.

The extensions are written in GJS, which, in Gnome's own words, "is simply JavaScript bindings for the existing GNOME
platform APIs". Essentially you write a piece of (mostly) regular ol' JS code, put it in a certain directory on your
system, Gnome Shell picks it up and executes it in its own JS runtime. No problem with that. That's how a lot of
extension systems work, nothing unusual there. You write using a very common language for which documentation is plenty,
and you're not using a weird dialect or flavor or anything. I mean it still has its quirks. Check out the following
little snippet, which is just a few lines that import the relevant stuff into my code:

```javascript
const {GObject, Gtk, Gio} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const Gettext = imports.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
```

You don't do any `require()`s or `import from`s. It does look and (mostly) work like regular ol' JS, but it's still
different enough to notice.

So what's the problem? Well there are a number of things that make the development process more annoying than it needs
to be. Here are some of those, in no particular order.

## Uncomfortable debugging

Debugging JS is not a good experience in general, but debugging GJS makes me want to shoot myself in the knee sometimes.

The most useful debugging tool you have is the `log()` function, which, as its name might suggest, logs something
somewhere. Usually that "somewhere" is `journalctl`, which is a common dumping ground where a whole bunch of other
things on the system will be dumping their own logs, so you'll have to search for your own logs in there. Even if you
filter it to only show gnome-shell logs, you'll still see bajillions of lines of logs that are not relevant to you in
the slightest. Often I find myself having to sorta "decorate" my logs with weird strings to make them easier to find in
that jungle. Some days, some component of gnome-shell feels extra chatty and decides to flood `journalctl` with a ton
of messages. Have fun finding your own particular needle in that haystack. I mean look at this:

![gnome-shell log screenshot](~@source/.vuepress/public/img/posts/creating-gnome-shell-extension/gnome-shell-log-screenshot.png)

This is what the logs look like when the shell is started. A lot of lines dumped by a lot of things. Not groovy.

And who doesn't love the "you forgot to handle a promise rejection in line 93" kind of error messages, where line 93 is
just the beginning of the function that eventually does something that eventually ends up doing something else that
deals with promises somewhere down the line. Good luck finding where the unhandled rejection is in the file.

One thing that drove me up the wall while trying to figure out why my DBus code wasn't working was the fact that the
`log()` function is entirely helpless in telling me what certain GLib variables look like. I call a certain function
from that library, it returns an object, but I have no clue what the hell it looks like. Can't just log it because it's
an object. Can't `JSON.stringify()` it, because the objects contained in that object don't have proper `toString()`s,
and all you get is `{}`. I eventually figured it out, but the lack of proper debugging tools made it so much more
difficult than it needed to be. This sort of things happen entirely way too often.

## Questionable documentation

Back when I started writing the thing, which was a few years before I put it on Github and then on Gnome's extension
website, finding any documentation about how any of this works was an art in and of itself. I had to read documentation
written for Gnome's C and Python APIs, and then just make educated guesses to sorta "translate" those to GJS. Even when
I did find things written for GJS, a lot of the time they were auto-generated texts that were even less descriptive than
the functions' signatures. Plenty of discussions on forums and platforms like stackoverflow about the sad, sad state of
GJS documentation.

To be fair though, these days it's better. Not ideal, but better. I'm having a much easier time getting my hands on
useful documentation that doesn't require any "if I was a GJS dev, how would I name this C function in Javascript" kind
of thinking from me.

## Breaking changes

This is one of the bigger ones. Gnome's developers make breaking changes to their APIs very often. With every new
update, you can see many of your installed extensions throwing up error messages saying "this extension does not
support current gnome-shell version" or whatever. Very often it's just a matter of adding the current gnome-shell
version number to the extension's metadata as a supported version without having to do anything else, but more often
than not, things do break down completely and require a ton of dev time to fix.

For example, the piece of code that creates the settings menu for the extension is twice as long as it needs to be,
because at some point we got upgraded to a new version of Gtk, which completely broke a lot of things that came before
it. You either stopped supporting the older gnome-shell versions with your newer extension versions, or you wrote a lot
extra code to implement a second strategy to create your menu.

I'm fairly sure an update to gnome-shell some weeks ago made a breaking change to the DBus thingamajigs. Code that used
to work perfectly fine for instantiating a DBus proxy suddenly started to return garbage values. Took me a while to
find a solution [because of the...](#uncomfortable-debugging) Though actually it could have also been Spotify's
recent update that broke things. They did make some changes to their DBus interface around the same time. But reading
GLib's changelogs, I think it wasn't Spotify's fault.

## No IDE support

Code completion is life. Code completion reduces the number of mistakes you make. Code completion makes it easier to
find the mistakes that you did make. Code completion helps you find the functions you're looking for. Code completion
is everything.

There is no code completion of any kind while writing a Gnome Shell extension. None. You're on your own. It can be very,
_very_ frustrating. There are some projects on Github that are trying to remedy that, but from what I can tell they're
not in a usable state. I imagine that things like the weird way of importing code seen at the beginning of this post
have something to do with it.

## Testing is non-existent

Usual test suites don't know what to do with your code, since it's structured in a way to be executed by gnome-shell.
As far as I can tell, there are no test suites for GJS, so the only way to test your code is to load it up and see if
it works. Which is of course not ideal. It is also quite annoying if you're developing on Xorg, and completely and
utterly impractical if you're developing on Wayland. Because you see, extensions are loaded when gnome-shell starts.
The only way to make your changes take effect is to restart the entire gnome-shell. On Xorg it's mostly a minor
inconvenience that freezes your PC for a couple of seconds, but on Wayland it requires restarting your whole user
session, because Gnome doesn't support restarting just the shell under Wayland. And that is, of course, quite far from
being just a minor inconvenience. That is straight up unacceptable. Imagine having to log out and log back in to your
user account just because you made a small typo somewhere. Just... no. There seem to be some workarounds to this by
running a nested Wayland session under X, but... meh.

## What makes it all even weirder

Gnome's developers are... _peculiar_. They have peculiar ideas as to what makes a DE usable, and they have a peculiar
_vision_ for their product. They aren't making a conventional desktop environment to be used on a PC, their DE is geared
towards laptops and their touchpad gestures. It's proven to be a rather controversial position. Not very surprising,
considering Gnome is the most common DE in the Linux ecosystem, where I imagine a very large chunk of users are on PCs.
Also, still fresh are the traumatic memories of Windows 8, which also appeared to follow this same path to some degree.

Anyway, the "vanilla" Gnome is some pretty bare-bones stuff that lacks a ton of features and functionality that the
average PC user has come to expect from their computer. Those are made available via extensions. Like, if you want to
have a usable desktop in your _desktop_
environment, you have to enable an extension that lets you put items on your desktop. Want your taskbar to show what
windows you currently have open? That's an extension. Without those the PC feels like a tablet, which is not
unintentional, as explained above.

In my opinion at least, Gnome is completely worthless without the extensions to enable some of those features. I don't
see Gnome Shell extensions as flair, or neat additions to my system. To me the extensions are an absolute necessity to
make Gnome usable as a desktop environment. I simply would not use Gnome without them, not even begrudgingly. Which is
why I find it very odd that creating them has been such a pain in the ass for such a long time. If you're so heavily
rely on extensions, why not make their development easier?

Well, I'm rambling again. I hope you folks enjoyed yourselves. Catch you later on down the trail.

[Header image source](https://www.manufactum.com/garden-gnome-swing-a33585/)