---
layout: Post
title: "Breaking down my IMDb seenlist"
date: 2022-05-31
subtitle:
useHeaderImage: true
headerImage: /img/posts/breaking-down-my-seenlist.webp
headerMask: rgba(40, 57, 101, .4)
hide: true
tags:

- imdb
- cinema
- data analysis

---

This one's sort of a spiritual successor to [my analysis of IMDb's dataset](./imdbanalysis-2.md). This time I'm not
gonna look at the whole thing, but just my own personal seenlist.

<!-- more -->

The reason I'll be doing this is twofold:

1. I want to see what I have been up to all those years, for the fun of it. I'm not after some deep introspection here,
   I just want to see what kind of stuff I have watched. What genres did I watch the most, who's the actor
   I've seen the most, that sort of stuff. Dumb trivia about myself.

2. I want this to be sort of an exploratory mission into breaking down someone's seenlist. Brainstorm about what
   interesting statistics I can pull from the list, and maybe perhaps turn that into a small webapp somewhere down the
   line, for others to do for themselves.

## Methodology

Once again, a quick word ~~from our sponsor today~~ about how I'll be going about doing it.

I keep a list on IMDb, where I keep track of all the films I've watched over the years, which is, of course, the
seenlist in question. I've used IMDb's exporting feature to download it as a CSV file. That's part of my data.

The only kind of data contained in that CSV file, however, is very basic information about the films. Their titles, IDs,
release dates, that sort of thing. To reuse a dummy list I made specifically for [this post](./imdbanalysis.md), here's
what it looks like:

```
Position,Const,Created,Modified,Description,Title,URL,Title Type,IMDb Rating,Runtime (mins),Year,Genres,Num Votes,Release Date,Directors,Your Rating,Date Rated
1,tt2724064,2022-05-04,2022-05-04,,Sharknado,https://www.imdb.com/title/tt2724064/,tvMovie,3.3,86,2013,"Action, Adventure, Comedy, Horror, Sci-Fi, Thriller",49177,2013-07-11,Anthony C. Ferrante,,
2,tt1094249,2022-05-04,2022-05-04,,Hotel Chevalier,https://www.imdb.com/title/tt1094249/,short,7.2,13,2007,"Short, Drama, Romance",33516,2007-09-03,Wes Anderson,,
3,tt7220754,2022-05-04,2022-05-04,,Hevi reissu,https://www.imdb.com/title/tt7220754/,movie,7.0,92,2018,"Comedy, Music",8902,2018-03-09,"Jukka Vidgren, Juuso Laatio",,
4,tt0056757,2022-05-04,2022-05-04,,The Fugitive,https://www.imdb.com/title/tt0056757/,tvSeries,8.1,51,1963,"Adventure, Crime, Drama, Thriller",3977,1963-09-17,,,
5,tt0261024,2022-05-04,2022-05-04,,Live Aid,https://www.imdb.com/title/tt0261024/,tvSpecial,8.5,960,1985,"Documentary, Music",2205,1985-07-13,"Vincent Scarza, Kenneth Shapiro",,
```

I want more than what's on there, this time around. I want original language, I want the cast, and I want more of the
crew. Like the writers and producers and composers and such. For that I am going to need a larger database that contains
more information than what I used in my previous two posts. 

Fortunately I just happen to have something like that lying around. I've got this MongoDB database that contains a very 
heavily filtered but still plenty large enough (reduced down to 157,596 entries from 1.2+ million) collection of films that 
contains a bunch more information that isn't available on that CSV file above. I got cast (not all of them, though), 
I got crew, I got production companies, languages, some basic financial information, more detailed information about 
the production status of the title, I got the good stuff. 

Now I'm not some weird data hoarder type person who keeps databases like that for no reason, I've "assembled" it using 
TMDB's API and been using it for the development of another project for a while. There's plenty of information in there 
already, but if I think I want/need more down the line, I can always add more. Still got my TMDB API key.

## What do we want to see

Well the idea I have is to create graphs and charts and whatnot like in [this post](./imdbanalysis-2.md), but of 
course this time only for one list. For starters it's going to be _my_ own personal list, but we'll see if I want to 
pretty it up and turn it into a web application. But what will these graphs and charts and whatnot show, that is the 
question.

First of all, I think I'm only interested in films. My personal list of 900+ films has only one entry in it that 
isn't a film, I've never even considered keeping a list of TV shows that I've seen, let alone their individual 
episodes, because, again, not interested.

The 