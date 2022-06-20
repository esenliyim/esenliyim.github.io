---
layout: Post
title: "Analyzing IMDb: Pt1"
date: 2022-05-25
subtitle: Taking a look at IMDb data
useHeaderImage: true
headerImage: /img/posts/imdbanalysis.webp
headerMask: rgba(40, 57, 101, .59)
tags:
- imdb
- cinema
- data analysis
---

I won't go into much detail here, but there's this pet project of mine that I have been working on for a while now. 
It's supposed to be an absolutely totally very revolutionary piece of software that addresses the greatest obstacle to 
world peace: the disgusting and hostile situation that comes about when multiple people try to pick a film to watch together. 

To do its thing, the application takes in data from multiple sources, be it internally generated or imported from an 
outside source, and uses that data to create a "common piece of data", so to speak. One of these outside sources is 
IMDb, as is practically inevitable wherever film data is involved. As much as I like IMDb and make great use of their 
service, turns out their data is kind of annoying to work with.

## Seeing what we're working with

To figure out what kind of _infrastructure_ I needed for the application, I figured I would try to get to know 'my data'
better. Figure out what the data contains, how much of it is there, how much of it is relevant to me, how am I gonna go
about handling it, that sort of thing. Do some research, basically.

As I just mentioned a couple paragraphs ago, it was inevitable that such an application would eventually find itself 
with a bunch of data that came from IMDb. In fact, I expect that's where the majority of the user-given data would come 
from. Because, you know, it's a huge platform. So it's a good place to start my humble data analysis. 

The IMDb data I expect to end up working with is mostly in the form of CSV files, which look like this:

```csv:no-line-numbers
Position,Const,Created,Modified,Description,Title,URL,Title Type,IMDb Rating,Runtime (mins),Year,Genres,Num Votes,Release Date,Directors,Your Rating,Date Rated
1,tt7220754,2022-05-04,2022-05-04,,Hevi reissu,https://www.imdb.com/title/tt7220754/,movie,7.0,92,2018,"Comedy, Music",8902,2018-03-09,"Jukka Vidgren, Juuso Laatio",,
2,tt2724064,2022-05-04,2022-05-04,,Sharknado,https://www.imdb.com/title/tt2724064/,tvMovie,3.3,86,2013,"Action, Adventure, Comedy, Horror, Sci-Fi, Thriller",49177,2013-07-11,Anthony C. Ferrante,,
3,tt1094249,2022-05-04,2022-05-04,,Hotel Chevalier,https://www.imdb.com/title/tt1094249/,short,7.2,13,2007,"Short, Drama, Romance",33516,2007-09-03,Wes Anderson,,
4,tt0056757,2022-05-04,2022-05-04,,The Fugitive,https://www.imdb.com/title/tt0056757/,tvSeries,8.1,51,1963,"Adventure, Crime, Drama, Thriller",3977,1963-09-17,,,
```

::: tip Why these titles?
The sample list above is something I made up for this post. Those particular titles were not chosen at random, nor 
because they mean so much to me. They each represent a certain type of title, and that matters to the point I'll try to make.
:::

The files come from two sources: user uploads, or just `curl`'d straight from IMDb's website using their export 
feature. Which are actually the same thing. I fetch the CSVs from the same place that users get theirs from. I just skip
the middleman, save the user the steps in-between.

One important thing about my application is that it's all about films. No TV shows, no music videos, no anime, no nothin'. 
Don't want em. I'm interested in films only. But platforms like IMDb or TMDB or Trakt don't do films only, do they? 
No, they carry everything. And they let you mix all kinds of media together in the same collection. 
Except good ol' Letterboxd, which only deals with films, but that's another story. Anyway, what that means is 
that when a user tries to import data from one of those sources into my application, that data is very likely going to 
be a mix of films and everything else, and I'll have to be able to get rid of that "something else" while making sure
I don't accidentally get rid of the relevant stuff.

So how do I do that? Easy. Look at the sample CSV file above. You'll see a `Title Type` field in the header row. Great.
I know [_Hevi reissu_](https://www.imdb.com/title/tt7220754/?ref_=nv_sr_srsg_0) (aka Heavy Trip, a great Norwegian flick) 
is a film. It says `movie` under its `Title Type`, so there we go. I program the application to pick up `movie`s only. Done.

No, not done. Because look at the CSV again. I know [_Sharknado_](https://www.imdb.com/title/tt2724064/?ref_=nv_sr_srsg_0) is also a film. But its title type is not `movie`, 
it's `tvMovie`. I bet most people wouldn't even know it's a TV movie when they add that legendary masterpiece to their 
list. Now when someone imports a list with _Sharknado_ on it, it will get ignored. Same with [_Hotel Chevalier_](https://www.imdb.com/title/tt1094249/?ref_=fn_al_tt_1), 
Wes Anderson's 2007 short and the standalone prologue to one my favorite films of his, [_Darjeeling Limited_](https://www.imdb.com/title/tt0838221/?ref_=nv_sr_srsg_0). It's a 
short film, but a film nonetheless, and I want it picked up. So apparently I need to add `short` to my `title type` 
whitelist.

Now it's kinda obvious that IMDb may or may not have a rather _fine_ title categorization scheme. One might also call it 
"confusing", but we're ain't here to judge noone's database schemas. Anyway, clearly just guessing at the names of those 
subtypes will not work. I will have to find me a definitive list of what possible types I can expect from them.
Probably should have done it at the beginning, but oh well. Off to google with me. Well, turns out that information is 
nowhere to be found. There's no official documentation about it, at least none that I could find. All I managed to find 
were a few old forum posts, but I can't possibly trust the completeness and reliability of the information on there. 
Most of them were non-programming related discussions about the types anyway.

Well what do you do when you can't find the information on a search engine? 

## Break out the :snake:

Yes, this is a job for every programmer's favorite elongated, limbless, carnivorous reptile: Python. We're gonna unleash
it on IMDb's dataset and _DEMAND_ information from it. Fortunately, IMDb regularly publishes a number of [datasets on their website](https://www.imdb.com/interfaces/). 
Pretty neat stuff. It's not everything they have because part of their business model is selling data through their paid 
APIs and whatnot, but still very cool. In case you're wondering, the latest dump contains a grand total of 8,870,622 
lines. As you'll see below, though, only a small part of that is films. Spoilers: the vast majority of those are not 
even **m**ovies, despite the second letter in the website's name.

Anyway, the idea is, if nobody's giving me a complete list of all the title types, I'm gonna brute force the problem. 
Since this is a complete list of every single title IMDb has, it should also contain every single title type they have. 
Or at least if there are title types that aren't on there, I don't need to worry about them because I can't encounter 
them anyway. And, thanks to the almighty snake, all it takes is a whopping 13 lines of code that took like 2 minutes to 
write.

```python
import csv

with open("titles.tsv") as imdbData, open("foundTypes.txt", 'a') as foundTypesFile:
    foundtypes = []
    data = csv.reader(imdbData, delimiter="\t", quotechar='"')
    
    for row in data:
        titleType = row[1]
        genres = row[len(row) - 1].split(',')
        if titleType not in foundtypes:
            foundtypes.append(titleType)
            foundTypesFile.write(titleType)
            foundTypesFile.write("\n")
```

13 lines. Open the file, shove its contents into Python's csv reader, then go row by row, adding the title type into a 
list if it isn't already in there. I'm sure it could be written better, but this one still goes through ~9 million lines 
in about 10 seconds, so who cares, really? It'll do.

:::info I'm an idiot.
While doing all this, I was utterly unaware that SQLite has [a built-in function for importing delimited files](https://www2.sqlite.org/cvstrac/wiki?p=ImportingFiles), which
would have made my life much easier.
:::

Excluding the one from the header row, there are apparently a total of 11 different title types. Namely, as they appear
in CSV/TSV files: `short, movie, tvEpisode, tvSeries, tvShort, tvMovie, tvMiniSeries, tvSpecial, video, videoGame, tvPilot`. 
Thank you, snake. Now I know what I'm up against.

## Genreless films are a thing

Another very common feature in any application that lists films is the ability to filter them by genre. Obviously I want
my program to be able to do that too, it's sort of a must. 

Unsurprisingly, a similar problem to the one above can be encountered here too. I need a complete list of 
genres, but it's nowhere to be found, at least not in any sort of documentation that describes how they're used in 
data rather than in the website UI. TMDB's public API has an endpoint where you can ask for that complete list, so does
Trakt. They return the names of all their genres, and how they're referred to within the data. So you don't have to guess
anything, you don't have to manually populate arrays, you can have your code do it. But IMDb doesn't have anything like 
that, at least nothing that doesn't cost more than most people's yearly salaries, so I gotta go back to the snake again.

Extending the above script to apply the same logic to genres will generate a complete 
list of all genre names as they appear in the dataset. And they are: `Documentary, Short, Animation, Comedy, Romance,
Sport, News, Drama, Fantasy, Horror, Biography, Music, War, Crime, Western, Family, Adventure, Action, History, Mystery, \N,
Sci-Fi, Musical, Thriller, Film-Noir, Talk-Show, Game-Show, Reality-TV, Adult`. A total of 29 genres. Well, 28, because
obviously `\N` is not a genre (or is it?). Apparently there are titles on IMDb that don't have genres. Anyway: note to 
self: set the genre field in your own database model to be nullable.

## Getting an approximate on the scope of the data I'll be working with

Ever wonder how many films there are? I kinda did wonder, making this application. Not sure how useful it'd be for the 
development process, but I decided to find out how many films are there, or at least on IMDb, which, I'm guessing would 
be the largest database out there. So, once again, back to the snake. Modify the above script to:

```python
import csv

types = ['short', 'movie', 'tvMovie', 'tvSpecial', 'tvShort']

with open("titles.tsv") as imdbData:
    count = 0
    data = csv.reader(imdbData, delimiter="\t", quotechar='"')

    for row in data:
        titleType = row[1]
        if titleType in types:
            count += 1
    
    print("total films: ", count)
```

I included `tvSpecial` and `tvShort` in there too. They may not sound like they'd be considered films, but I took a short
trip through IMDb to look at some samples of those types, and I saw enough titles that _I_ think belong in there. So in
they are.

Anyway, the code runs for 10 seconds, again. Unsurprising since it's basically the same thing. The grand total of 'films'
in IMDb's dataset is... :drum: DRUM ROLL :drum:... 1,657,142. That's a lot of titles, but the figure is not very _realistic_ for my 
purposes. You can cut it down by quite a bit if you take out all the porn out of it. Did you even know pornographic 
titles can also have IMDb pages? Anyway, this platform is supposed to be a 'social' one, and though watching porn is 
indubitably a very classy cinematic event to enjoy together with one's peers, it's not quite the kind of thing I'm going for. 
So they're getting filtered out.

```python
isAdult = row[4]
if (titleType in types) and (isAdult == "0"):
```

you get 1,646,062 titles. In other words, only about 16% of IMDb's entire database is made up of films that aren't porn.
Honestly though, that's a lot less porn than I'd anticipated. Just over 11 thousand adult titles. Though I'm sure it'd 
be more if I hadn't filtered out certain title types.

Moving on, let's think about what else I can weed out using only the limited data in that one file. 
One option is to ignore anything with runtime shorter than some arbitrary value. Say, 7 minutes. 7 is a good number. I 
think I feel okay about ignoring stuff shorter than that. Watch them on your own time, not together with friends over 
beers and a bowl of popcorn. Back to the snake. Change the code. Cast the field into an int. Run into errors because 
apparently some of those 1.7m titles have `\N` as their runtime. Should have seen that coming, as there are a bunch of real
reasons why the runtime of a title may not be known. Fix the error, and now we're at 908,191 titles. 
Almost half of the 16% is gone already, we're now at ~10%.

Now unfortunately that's about what can be reasonably scripted using only the basic 'titles' data dump from IMDb. To 
weed out other "irrelevant" titles, you'd have to look at other pieces of data. Like, a large chunk of that remaining 10%
is absolutely useless stuff that probably only exist as someone's bragging rights, or to pad some portfolios or whatever.
As a quick example, there are a ton of 'making of's out there like 
[this one](https://www.imdb.com/title/tt11616456/?ref_=fn_al_tt_7) or [this one](https://www.imdb.com/title/tt7401512/?ref_=fn_al_tt_8), 
that do get through my rudimentary filter, but I don't realistically see any group of friends ever getting together to have
a nice evening watching those. Can you imagine like four dudes, who have no personal affiliation to those things in any way, 
all agreeing to sit down and watch a super obscure indie films's even more super obscure making-of documentary. Not happening. 
To get rid of things like that you'd have to get creative and reference IMDb's other 
dumps, which contain further details about titles. But I'm not willing to do that, I was mostly just satisfying my 
curiosity anyway. 

I also wrote a little Go program (because it's a very parallelizable task and Go is great for that) 
that queries ALL the films on TMDB. There it's a bit easier to get exactly what you want because you're working with a 
nice API that also happens to be well documented. Though of course, since it's making a metric :peach: load of API calls, it 
takes a while to run. I may share the results of that in another post. I've actually upgraded my CPU and _tripled_ the 
core count since that code was written. Should let the new one have a go (huehuehueh) at it one of these days.

So anyway, that was it. There are a bunch more lessons I've learned while working with the data from sources like IMDb, some of
them about database modelling, some about films themselves, some about other things. I'll be writing about those soon.
Now go away, or I shall taunt you a second time-a.
