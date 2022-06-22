import{_ as s,r as h,o as i,c as r,b as n,a as e,e as o,d as t}from"./app.4a19620f.js";const l={},d=o(`<p>One day I decided, just to sate my own personal curiosity, to look at IMDb&#39;s data dump and see what kind of stuff it&#39;s made of.</p><p>I once looked at it to see how much of it was relevant to me and my project, but I do also want to know just what&#39;s in there, really. How many TV shows are in there? How long is the average film? What&#39;s the most popular genre? Questions, questions...</p><h2 id="methodology" tabindex="-1"><a class="header-anchor" href="#methodology" aria-hidden="true">#</a> Methodology</h2><p>Before we get this party started, let me first say a few words about the &quot;what&quot; and &quot;how&quot; and &quot;why&quot; of it all.</p><p>The &quot;what&quot;, aka my data source, is going to be <a href="https://www.imdb.com/interfaces/" target="_blank" rel="noopener noreferrer">IMDb&#39;s official data dump</a>. It&#39;s a big ol&#39; TSV file that contains all the titles in their database, with some basic metadata. Here&#39;s the output from the command <code>head titles.tsv</code> to give you an idea as to what it looks like:</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>tconst	titleType	primaryTitle	originalTitle	isAdult	startYear	endYear	runtimeMinutes	genres
tt0000001	short	Carmencita	Carmencita	0	1894	\\N	1	Documentary,Short
tt0000002	short	Le clown et ses chiens	Le clown et ses chiens	0	1892	\\N	5	Animation,Short
tt0000003	short	Pauvre Pierrot	Pauvre Pierrot	0	1892	\\N	4	Animation,Comedy,Romance
tt0000004	short	Un bon bock	Un bon bock	0	1892	\\N	12	Animation,Short
tt0000005	short	Blacksmith Scene	Blacksmith Scene	0	1893	\\N	1	Comedy,Short
tt0000006	short	Chinese Opium Den	Chinese Opium Den	0	1894	\\N	1	Short
tt0000007	short	Corbett and Courtney Before the Kinetograph	Corbett and Courtney Before the Kinetograph	0	1894	\\N	1	Short,Sport
tt0000008	short	Edison Kinetoscopic Record of a Sneeze	Edison Kinetoscopic Record of a Sneeze	0	1894	\\N	1	Documentary,Short
tt0000009	short	Miss Jerry	Miss Jerry	0	1894	\\N	40	Romance,Short

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>wc -l</code>&#39;ing the same file gets you a line count of 8,870,623.</p><p>To work with the data contained in that file, I parsed it with a Python script and created an Sqlite database. That way I can use regular SQL queries to extract whatever information I need. Much quicker, easier, faster than going through the whole file every single time like a chump. Which I totally definitely absolutely didn&#39;t do for a couple hours at the start. The <code>.db</code> file is 862MB, in case you were wondering. Anyway, this is the &quot;how&quot;.</p><p>The &quot;why&quot; is, to put it simply, &quot;because why not&quot;. That&#39;s it.</p><p>I don&#39;t do this kind of thing very often, and it&#39;s probably gonna be full of stupid mistakes and nonsensical assumptions and dumb attempts and whatever else one can do to mess it up. But... yeah...</p><p>Oh, as for the presentation of the whole thing, I&#39;ll be using <a href="https://seaborn.pydata.org/index.html" target="_blank" rel="noopener noreferrer">Seaborn</a> to generate the color palettes for the charts. I just give it the length of result set of any SQL query I want to generate a colored chart for, and it spits out an appropriate palette, which is an array of hex color strings. Very neat library that I have recently discovered. End shoutout.</p><h2 id="breaking-it-down-by-title-type" tabindex="-1"><a class="header-anchor" href="#breaking-it-down-by-title-type" aria-hidden="true">#</a> Breaking it down by title type</h2><p>First let&#39;s find the answer the question of &quot;how many of what&quot;. In an earlier post, I wrote about the lil&#39; Python script I wrote to get me a list of all the title types IMDb uses in their database. Meaning I don&#39;t have to figure out what the types are again, I can just use the list it&#39;s generated to make my life a little easier.</p>`,13),c=o('<p>As you can see TV episodes make up the overwhelming majority of IMDb&#39;s data set. To be specific, with 6,656,002 individual entries, they make up almost exactly 75% of the grand total of 8,870,622 entries in there.</p><p>As you probably can <em>not</em> see on the graph, however, unless you have hawk eyes and a freakishly high DPI display, with just 2 (two) entries, TV Pilots are a bit underrepresented in the database. The only two representatives of that type are the legendary <a href="https://www.imdb.com/title/tt14761346/?ref_=hm_tpks_tt_i_1_pd_tp1_pbr" target="_blank" rel="noopener noreferrer">Testing Title 14</a> and everyone&#39;s favorite <a href="https://www.imdb.com/title/tt15258334/?ref_=hm_tpks_tt_i_1_pd_tp1_pbr" target="_blank" rel="noopener noreferrer">TV Pilot</a>. Good stuff.</p><p>However, the chart above is a bit misleading. Because the TV episodes are filed under <code>tvSeries</code> or <code>tvMiniSeries</code>, both of which are also represented with their own entries, obviously. For example, <a href="https://www.imdb.com/title/tt2301451/?ref_=ttep_ep14" target="_blank" rel="noopener noreferrer"><em>Ozymandias</em></a> and <a href="https://www.imdb.com/title/tt0903747/?ref_=fn_al_tt_1" target="_blank" rel="noopener noreferrer"><em>Breaking Bad</em></a> each have their own entries, but I feel treating them as two separate things is not the right way to go about doing it. So to get a better idea as to how many of what is there, I&#39;m going to take the episodes out of the equation and let every TV series and miniseries be represented by one single entry each. When I do that, the chart suddenly looks a bit different:</p>',3),u=o("<p>Now <code>short</code> seem to be winning, with <code>movie</code> on its back. In my earlier post, I (totally arbitrarily) decided to lump several of these types together to define one single &quot;film&quot; type. Namely I merged <code>short</code>, <code>movie</code>, <code>tvMovie</code>, <code>tvSpecial</code>, and <code>tvShort</code> into one. I <em>am</em> fully aware that it&#39;s not an ideal thing to do. I am aware of the can of worms that it opens, but still that is what I will be using. Now I&#39;m also going to merge <code>tvSeries</code>, <code>tvMiniSeries</code>, and the juggernaut that is <code>tvPilot</code> as well, to make a single &quot;TV&quot; type. If you do that to the graph, you get:</p>",1),m=o('<p><em>Now</em>, with about 75% of the entire thing being films, the International <strong>MOVIE</strong> Database is looking like it&#39;s living up to its name.</p><p>I&#39;ll leave <code>video</code> and <code>videoGame</code> alone, though. Video games are obviously their own thing entirely, and the <code>video</code> type contains things like concert recordings and music videos and whatnot, so I don&#39;t think it really belongs to either of the bigger categories.</p><p>Also at this point I&#39;m creating two SQL views called &#39;films&#39; and &#39;tvShows&#39; to make my life easier going forward. I&#39;ll be ignoring the episodes unless explicitly stated otherwise, and will be operating solely on those &#39;films&#39; and &#39;tvShows&#39; views.</p><h2 id="breaking-it-down-by-genre" tabindex="-1"><a class="header-anchor" href="#breaking-it-down-by-genre" aria-hidden="true">#</a> Breaking it down by genre</h2><p>Let&#39;s look at genres. I&#39;m gonna split this into two subsections. One for films, and then one for TV. Each of those subsections will be further split into two: one for individual genres, and then <em>combinations</em> of genres.</p><p>The individual genres subsection will look at how often individual genres come up for that respective title type. The combinations section will in turn be looking at which genres are found together most often.</p><h3 id="films-by-genres" tabindex="-1"><a class="header-anchor" href="#films-by-genres" aria-hidden="true">#</a> Films by genres</h3><h4 id="individual-genres" tabindex="-1"><a class="header-anchor" href="#individual-genres" aria-hidden="true">#</a> Individual genres</h4><p>As promised, here&#39;s the genre distribution for all films. The total is obviously (a lot) larger than the total number of films, but that&#39;s because there&#39;s an N-to-N relationship between films and genres. One film can belong to up to 3 genres. That one seems to be a rule that is strictly enforced by IMDb, because I have found no entry in the database that has more than 3 genres assigned to it. No trolly entries that have ALL the genres or anything like that.</p>',9),f=o('<p>Not very expectedly, the dominant genre seems to be &quot;Short&quot;. So unexpected in fact, at least for me, that it made me a little suspicious. So I decided to investigate. See what kind of &quot;shorts&quot; do we have in there? I went digging. The results will SHOCK YOU. Though probably not.</p><p>The average runtime of these Shorts is 13 minutes and change. There are 204,612 Shorts that are longer than that. 24,601 Shorts are longer than 30 minutes, 76 are longer than an hour. Going the opposite direction, there are 215,947 Shorts that are shorter than 10 minutes, of which 75,590 are shorter than 5 minutes. Surprisingly, only 1592 of those 823,013 Shorts is porn. IMDb keeps subverting my expectations in that regard. I keep overestimating just how much porn there would be.</p><p>The longest Short, by the way, is probably a bit longer than you&#39;d expect. It&#39;s <a href="https://www.imdb.com/title/tt15062194/?ref_=hm_wls_tt_i_1" target="_blank" rel="noopener noreferrer">this weird Batman-related thing</a> that is a whopping 4019 (yes, four thousand and nineteen) minutes long. Only 3 days of your life, in other words. What a hoot. I&#39;m sure whoever created that entry had <em>a lot</em> of fun. Well, actually <em>I</em> did have a little fun asking people how long they think the longest short film on IMDb is. Nobody even came close hehe.</p><p>But what is a &quot;Short&quot;, really? Well, The Academy of Motion Picture Arts and Sciences actually says <a href="https://www.oscars.org/sites/oscars/files/91aa_short_films.pdf" target="_blank" rel="noopener noreferrer">a short film can only have a runtime equal to or less than 40 minutes</a>. So I&#39;ll just take out everything that&#39;s longer than 40 minutes. That leaves me with 515,256 films that are &lt;=40 minutes BUT only 5,253 that are &gt;40. There are a whopping 302,504 films that don&#39;t have any runtime at all. I mean that&#39;s unfortunate, but there are a whole bunch of legitimate reasons why an entry might be missing runtime information.</p><ul><li>It might be an old title with not much known about it beyond the fact that it exists</li><li>It might be an old title where the runtime is difficult to determine for reasons discussed somewhere below</li><li>It might be an upcoming title</li><li>It might be a title that got cancelled/scrapped</li><li>It might be a title that got lost in development hell</li><li>It might be a small project that a drama school student filmed in his basement using an iPhone 4, and never bothered with the runtime</li><li>It&#39;s a crowd-sourced database, and it might just be one of the countless junk entries where nothing makes sense</li></ul><p>Surprisingly, a very large number of entries don&#39;t have any genre assigned to them at all, which is... more difficult to explain than the missing runtime issue. My first thought was that they&#39;re probably upcoming titles, right? So I did some selecting. I first counted all the released genre-less films with known release years and known non-null runtimes. I got a total of 29,844. So there are still a \u{1F351} load of films that we know <em>some</em> things about, except their genres. I think this deserves some more investigation. Here&#39;s a very handy chart that shows the yearly rates of genre-less films. To be clear, this is the per-thousand rate of genre-less films with non-null runtimes. I had to show it in per-thousands because some of the numbers were very small.</p>',6),b=e("p",null,"Well, clearly time has something to do with it. The sharp decline in the number of genre-less films starting with 1979 is an unmistakable sign of that. Looking at the actual numbers, you know, rather than the percentages, Interestingly, looking at the actual numbers, I see that the yearly numbers of genre-less films has been relatively steady for the last century or so. It's been in the 350-550 range every year. Though obviously the number of total films produced shoots way up, and consequently the rate shoots way down.",-1),p=e("h4",{id:"genre-combinations",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#genre-combinations","aria-hidden":"true"},"#"),t(" Genre combinations")],-1),g=e("p",null,"On to the combinations. I'm just gonna look at the top 15 genre combinations, because there are a total of 28 defined genres, which means there are over 3000 combinations of up to 3 genres. I'm not getting into all that. The top 15 will have to do. Excluding the films that don't have any genre associated with them, this is what we have:",-1),y=o('<p>These top 15 genre combinations make up a total of 1,001,969 films, by the way. That&#39;s 60% of the total 1,657,142 films.</p><p>What I personally find interesting that there&#39;s not a single science-fiction in there. Not one. Hurts me deeply as a big sci-fi fan. Maybe that changes with TV though, we&#39;ll see.</p><p>I&#39;d also expect there to be more comedy shorts. Because, you know, at some point everyone and their mother were making dumb comedy shorts. Though that combo is still at 5th place, so there&#39;s definitely no shortage of those.</p><h3 id="tv-by-genres" tabindex="-1"><a class="header-anchor" href="#tv-by-genres" aria-hidden="true">#</a> TV by genres</h3><p>Truth be told, personally I&#39;m not <em>that</em> interested to see what this section looks like. I don&#39;t have much interest in TV shows, more of a film person. But I might as well do to the TV shows what I did to films. So here goes.</p><p>This time I&#39;ll just skip the genreless stuff altogether, though. I just think they&#39;re junk data. Said all I want to say about them anyway.</p><h4 id="individual-genres-1" tabindex="-1"><a class="header-anchor" href="#individual-genres-1" aria-hidden="true">#</a> Individual genres</h4><p>First, let&#39;s see the distribution by individual genres.</p>',8),w=e("p",null,"First thing I'm noticing here is just how little sci-fi there is. I mean look at it. Only 4868 shows. That's just sad.",-1),v=e("p",null,"The second thing I'm noticing is that there's more comedy than drama. That is unexpected. Honestly I was expecting drama to make up a huge majority of TV shows, don't know why.",-1),k=e("p",null,"I also wasn't expecting reality TV to be in the 4th place. I know there's a lot of those out there, but still I'd never have guessed they'd be this common. 4th place is A LOT.",-1),_=e("p",null,"Another surprising thing is that there are more adult tv shows than there are musicals or westerns. Noirs I expected, but honestly the lack of westerns is kinda shocking to me. Again, don't know why.",-1),I=e("h4",{id:"genre-combinations-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#genre-combinations-1","aria-hidden":"true"},"#"),t(" Genre combinations")],-1),T=e("p",null,"Finally for this section, here's the top 15 genre combos for the TV stuff:",-1),S=e("p",null,`Well, turns out, IMDb entries for TV stuff don't really like to combine genres. On the chart of "top 15 genre combos", there are only 2 actual combinations, the rest are all single genres.`,-1),x=e("h2",{id:"average-runtimes",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#average-runtimes","aria-hidden":"true"},"#"),t(" Average runtimes")],-1),C=e("p",null,"This is my own personal perception of things, which is probably wrong, but for the last decade or so I've felt like films are getting longer. It's like they used to be like 90 or so minutes, and now they're pushing 2 hours on average. Up until now the only source for that perception has been my own \u{1F351} exclusively, but after this my feelings will finally be based on numbers.",-1),M=e("p",null,"Well, selecting the average of all films' runtimes returns 47.12 minutes. Which sounds a little low, but not that surprising when you consider just how much of those films are shorts. Here's a nice little chart to visualise how long films (films only, no TV) tend to be:",-1),q=e("p",null,[t('What stands out to me immediately is how common and pronounced the peaks at "nice round numbers". Like 10, 60, 90, 100, whatever. More on that '),e("a",{href:"#the-nice-round-number-effect"},"here"),t(".")],-1),W=e("p",null,[t("Let's run a quick "),e("code",null,"NTILE()"),t(" select query to get rid of the top and bottom 10% runtimes, and see how long 80% of all films (that is, all films that "),e("em",null,"have a runtime in the first place"),t(") are:")],-1),A=o("<p>The &quot;nice round number&quot; effect becomes even more obvious when you do that. With the notable exceptions of 22 and 52 minutes, every single one of those peaks is divisible by 5. Curious that the only two exceptions both end with a 2. Wonder if science can explain that one.</p><p>Finally, let&#39;s go back to that question I asked above. Have films <em>really</em> been getting longer? For that, I&#39;ll just look at the average runtimes of the <em>movies</em> over the years. Yes <em>movies</em>, not the &quot;films&quot; view I defined earlier. The reason for that is because the question I&#39;m trying to answer here is about the stuff I&#39;ve seen in the theaters, which (probably) would all fall under the <code>movie</code> title type in IMDb&#39;s data set. I&#39;m not interested about shorts or straight-to-video stuff, I want to know specifically about theaters this time, so I&#39;ll stick to <code>movie</code>s. Not that I expect it to make a load of difference, mind you. Not with all the garbage data people are apparently putting in there.</p><p>I will also be limiting the query to the stuff that&#39;s already been released. Because if you involve upcoming titles from the future, the data goes kinda crazy. 2026, for example, has 3 entries that average 211 minutes in runtime, which is an <em>extreme</em> deviation from the norm as you&#39;ll see below. Pretty much all future years are like that, so I&#39;ll stick to the past and the present to keep the input a bit &quot;cleaner&quot;.</p>",3),D=e("p",null,"And the answer is... maybe? It looks pretty steady-ish over the last couple decades or so, with the average moving by only a handful of minutes. Though there's a clear dip around 2009.",-1),V=e("p",null,[t(`Well, the way I got to the above information is, as mentioned above, by averaging the runtimes of all 40+ minute films, and grouping them by year. This particular set of "40+ minute films" includes almost everything, a huge portion of which is, to put it bluntly, irrelevant garbage. To better answer that question I'll have to formulate a much more... `),e("em",null,"selective"),t(` query to filter out a ton of this stuff and hopefully end up with a smaller set that more accurately represents what the theater experience actually is like. I already have a bunch of ideas as to what I could filter things for, but they're all unfortunately beyond the scope of this quick and dirty "analysis", as I'd have to bring in at least one extra dataset from IMDb that contains a bunch more information. I'll do that later.`)],-1),N=e("p",null,`Another idea is to apply this "analysis" to my own personal seenlist on IMDb. That way I could also compare my personal experience against how things really are. Maybe the average runtime hasn't changed much at all, and I just happened to see the longer stuff. We'll see.`,-1),j=e("h3",{id:"the-nice-round-number-effect",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#the-nice-round-number-effect","aria-hidden":"true"},"#"),t(' The "nice round number" effect')],-1),R=e("p",null,"For the first few decades of filmmaking, it was something of a wild west in terms of playback speed. Not only there was no set standard for framerate that everyone adhered to, the early mechanisms that moved the frames in front of the projector and/or the camera lens were not very precise, often being cranked by hand. As such, obtaining an accurate runtime figure wasn't as straightforward as it is now. That became a common thing after the standardization of 24fps in 1929, and the increase in the accessibility of motorized film equipment that could operate at consistent speeds.",-1),B=e("p",null,`Which makes me wonder, what does the "nice round number" effect look like across the years? Is it more common for the old stuff because it can very often be hardly more than a wild guess? Or pulling numbers out of one's \u{1F351} is a timeless tradition of entering data into IMDb?`,-1),F=e("p",null,"For this one, I will divide the dataset's timeline into chunks of 10 years, and I will count the total number of known runtimes per each date range, count how many of them are divisible by 5, and then put the percentages on top of the whole thing.",-1),O=e("p",null,"Well, there it is. On average, 31.3(repeating, of course)% of all films, which have a non-null runtime in the first place, have a runtime in minutes that is divisible by 5. That definitely does show a general preference towards rounding numbers, but it's not as big of a deal as I'd have thought. Honestly, before seeing these numbers I was expecting something like 40% or so, if not higher. My bad.",-1),H=e("h2",{id:"yearly-output",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#yearly-output","aria-hidden":"true"},"#"),t(" Yearly output")],-1),P=e("p",null,`Now I'd like to take a look at the yearly film yields. The "yield", in this here case, will be both the total number of films that came out that year, and their total runtime in minutes.`,-1),L=o('<p>The most <em>recent</em> obvious first. That damn COVID. Look what it did to film yields... WOULD BE my first reaction but if you look closely, the downward trend seems to have started in 2017, which is 2 years before the first recorded case of the ol&#39; rona. Wonder what 2017 and 2018 have to say for themselves. 2019 too, because the first case was at the end of <em>december</em> 2019, they had some 300-odd days to make films that year. What happened there? Where did the films go?</p><p>The more observant ones among you will probably have noticed that barely perceptible peak that happens right before WW1, or <em>The Great War</em>, as we called it back then, kicks off. Now that, that one is interesting. That one tells you a story about the huge shift in how humans approached the entire medium that is film. Follow the &quot;Films per year (including null runtimes)&quot; curve. See how, after the sharp peak in 1913, the numbers don&#39;t reach the same level until 1996. Same story without the null runtimes, more or less. Now follow the third curve, the total runtime per year curve. <em>That</em> one catches up to 1913 pretty much immediately after WW1 ends, and, with the exception of WW2 between 1939 and 1945, and the few trying years surrounding the collapse of the USSR in 1991, it never goes down. It goes up up up, until the 2017 wall is hit. Anyway, what that curve shows you is that at the inception of them moving pictures, in its very early years, people (probably) made <em>a lot</em> of very short things. Of course, the first examples of this medium are stuff like <a href="https://en.wikipedia.org/wiki/The_Horse_in_Motion" target="_blank" rel="noopener noreferrer"><em>The Horse in Motion</em></a>. Very short collections of frames that wouldn&#39;t even run for a full second in modern framerates. As the improving technology made it more possible to keep shooting longer pictures, and a better understanding of the artform in general started making filmmakers more comfortable with it, people started producing those said longer pictures. And actually you can see that in this chart of average runtimes, which this time includes <em>all</em> the films without any further filters (except excluding the nulls for obvious reasons):</p>',2),G=e("p",null,[t("See how the average runtime just "),e("em",null,"explodes"),t(" starting in early 1910s. That was what I was talking about. From ~16 minutes in 1913 to ~55 minutes in 10 years. Also see the decline in average runtime that starts around the time the USSR starts to not feel very well at all. I'm sure there's a joke about Russian literature to be made in there, but I can't quite put my finger on it.")],-1),E=e("p",null,[t("What is really fascinating to me on that chart, I mean the first one of the section, is the damn near exponential increase that seems to have kicked off in the 21st century. Wonder what's the main driving force behind that rate of increase, though. It could simply be that people were making films at an exponentially increasing rate, "),e("em",null,"or"),t(" it could just mean that people were entering movies into the database at an exponentially increasing rate. I don't doubt that the amount of films coming out have increased, but I do kinda doubt that's the only reason behind the numbers. It could very well be some sort of survivorship bias.")],-1),U=e("h3",{id:"by-title-type",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#by-title-type","aria-hidden":"true"},"#"),t(" By title type")],-1),z=e("p",null,"One thing I got curious about while writing this was the yearly totals of different title types. So I wrote a quick query for that:",-1),Y={class:"custom-container tip"},K={viewBox:"0 0 25 25",xmlns:"http://www.w3.org/2000/svg","xml:space":"preserve",style:{"fill-rule":"evenodd","clip-rule":"evenodd","stroke-linejoin":"round","stroke-miterlimit":"2"}},Q=e("path",{d:"M297.6 258.73H296c-59.47.87-110.69 51.45-111.83 110.43-.626 36.485 16.525 71.085 45.94 92.68 17.86 13.18 29.88 33.56 33.77 56.42h67.62c4-22.82 16.13-43.3 34.16-56.74 28.589-21.097 45.496-54.587 45.496-90.118 0-30.03-12.078-58.833-33.496-79.882a113.133 113.133 0 0 0-80.06-32.79ZM265.19 550.7v26.6c0 4.84 1.17 6.43 1.17 6.43l63.72-.59V550.7h-64.89Z",style:{fill:"#48b884","fill-rule":"nonzero"},transform:"matrix(.042 0 0 .042 0 -5.178)"},null,-1),Z=e("path",{d:"M297.64 123.3C133.26 123.3 0 256.56 0 420.94s133.26 297.63 297.64 297.63 297.63-133.25 297.63-297.63S462 123.3 297.64 123.3ZM385 487.57c-14.11 10.48-22.51 28.09-22.51 47.14v48.43c-.016 17.792-14.648 32.428-32.44 32.45h-64.86c-15.6 0-32.44-12-32.44-38.29v-42.82c0-19-8.21-36.4-21.93-46.52-37.882-27.85-59.959-72.44-59.14-119.45 1.46-77.24 66-141.09 143.81-142.22 38.87.19 76.89 14.37 105 42.11a143.764 143.764 0 0 1 43.14 103c-.159 45.761-21.911 88.86-58.63 116.17Z",style:{fill:"#48b884","fill-rule":"nonzero"},transform:"matrix(.042 0 0 .042 0 -5.178)"},null,-1),J=[Q,Z],X=e("p",{class:"custom-container-title"},"The charts are interactive!",-1),$=e("p",null,"Once you're done admiring the unstoppable money printer that is TV, you can (and probably should) take it out of the chart by clicking on its label on the legend. The scales of the chart will then re-adjust to better fit the remaining content, and you will be able to see the other curves at finer detail.",-1),ee=o('<p>What&#39;s really interesting to me there is how steady the Shorts were for almost 80 years until they exploded in the early 90s for some reason. Look at that. The curve was almost flat.</p><p>Something I once saw mentioned on Reddit was that <code>tvMovie</code>s were taking over <code>movies</code> through streaming. As mentioned in an <a href="#yearly-output">earlier paragraph</a>, <code>movie</code>s do seem to be on decline numbers-wise, however that doesn&#39;t seem to be because <code>tvMovies</code> are taking over, at least not according to this chart. <code>tvMovie</code>s are going down as well, and since before the virus too. A lot of the films that go straight to a streaming platform are still filed under the <code>movie</code> title type anyway, not <code>tvMovie</code>. Off the top of my head, Netfix&#39; <a href="https://www.imdb.com/title/tt11196036/" target="_blank" rel="noopener noreferrer"><em>The Card Counter</em></a> is a <code>movie</code>. I don&#39;t even think it was ever in the theaters. As far as I remember, Martin Scorsese&#39;s <a href="https://www.imdb.com/title/tt1302006/" target="_blank" rel="noopener noreferrer"><em>The Irishman</em></a>, which is another Netflix title, was only shown in a handful of select theaters on the planet after much begging and crying. Still a <code>movie</code> as far as IMDb is concerned. I mean streaming isn&#39;t TV either, is it? It&#39;s its own thing. The whole streaming business exploded as a direct result of people getting sick of TV in the first place.</p><p>Unfortunately, dis/proving that one is not a job that can be done using IMDb datasets. They have a few of these that contain further information about titles and people, but nothing about streaming platforms or even production companies. You know who gives out that information, though? Good ol&#39; TMDB. They have a nice public API where I can query a whole bunch of data, including what I think I&#39;d need for this job. All that is for another time, though.</p><p>That was it for this one, though. In case I don\u2019t see ya, good afternoon, good evening, and good night!</p>',4);function te(ae,ne){const a=h("Chart");return i(),r("div",null,[d,n(a,{id:"chart_382ee18b","data-code":`{
  "type": "doughnut",
  "data": {
    "datasets": [{
      "data": [
        866119,
        608020,
        6656002,
        223871,
        10523,
        135819,
        43119,
        36661,
        259523,
        30963,
        2
      ],
      "backgroundColor": [
        "#781c81",
        "#452d8a",
        "#4063b0",
        "#4b91c0",
        "#62ac9a",
        "#83ba6d",
        "#abbe51",
        "#ceb641",
        "#e39a36",
        "#e6642c",
        "#d92120"
      ]
    }],
    "labels": [
        "short",
        "movie",
        "tvEpisode",
        "tvSeries",
        "tvShort",
        "tvMovie",
        "tvMiniSeries",
        "tvSpecial",
        "video",
        "videoGame",
        "tvPilot"
    ]
  }
}`}),c,n(a,{id:"chart_382ee1aa","data-code":`{
  "type": "doughnut",
  "data": {
    "datasets": [{
      "data": [
        866119,
        608020,
        223871,
        10523,
        135819,
        43119,
        36661,
        259523,
        30963,
        2
      ],
      "backgroundColor": [
        "#781c81",
        "#452d8a",
        "#4b91c0",
        "#62ac9a",
        "#83ba6d",
        "#abbe51",
        "#ceb641",
        "#e39a36",
        "#e6642c",
        "#d92120"
      ]
    }],
    "labels": [
        "short",
        "movie",
        "tvSeries",
        "tvShort",
        "tvMovie",
        "tvMiniSeries",
        "tvSpecial",
        "video",
        "videoGame",
        "tvPilot"
    ]
  }
}`}),u,n(a,{id:"chart_382ee1c3","data-code":`{
  "type": "doughnut",
  "data": {
    "datasets": [{
      "data": [
        1657142,
        266992,
        259523,
        30963
      ],
      "backgroundColor": [
        "#452d8a",
        "#4b91c0",
        "#e39a36",
        "#e6642c"
      ]
    }],
    "labels": [
        "film",
        "TV",
        "video",
        "videoGame"
    ]
  }
}`}),m,n(a,{id:"chart_382ee21e","data-code":`{
  "type": "bar",
  "data": {
    "datasets": [{
        "label": "Total films of genre",
        "data": [823013, 509557, 308665, 293831, 88451, 82655, 80304, 79438, 76153, 66326, 60131, 52466, 50558, 44614, 44248, 39740, 39017, 33735, 26575, 20635, 19336, 14685, 13845, 10297, 9546, 5609, 2696, 819, 766],
        "backgroundColor": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"]
    }],
    "labels": ["Short", "Drama", "Comedy", "Documentary", "\\\\N", "Horror", "Action", "Romance", "Thriller", "Animation", "Crime", "Music", "Family", "Fantasy", "Adventure", "Sci-Fi", "Mystery", "Biography", "History", "Musical", "Sport", "Western", "War", "Adult", "News", "Reality-TV", "Talk-Show", "Game-Show", "Film-Noir"]
  }
}`}),f,n(a,{id:"chart_64a5702a","data-code":`{
  "data": {
    "datasets": [
        {
        "type": "line",
        "label": "\u2030 of genre-less films",
        "backgroundColor": "#36a2eb",
        "borderColor": "#36a2eb",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [0.0, 0, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0, 0.0, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.59, 0.0, 0.0, 0.0, 0.18, 0.31, 0.65, 0.92, 3.27, 3.21, 1.63, 3.4, 6.4, 5.68, 6.96, 7.04, 8.02, 11.6, 13.78, 9.99, 14.74, 13.22, 13.92, 15.14, 13.37, 20.52, 35.14, 33.49, 43.3, 40.3, 39.33, 40.18, 38.24, 50.68, 60.63, 55.77, 43.05, 50.92, 56.68, 43.15, 27.85, 24.35, 25.27, 39.52, 33.69, 65.82, 53.72, 53.91, 37.37, 39.5, 41.52, 42.24, 40.38, 39.82, 47.48, 44.56, 52.29, 43.96, 49.75, 42.11, 63.86, 60.01, 64.4, 67.26, 58.82, 61.39, 62.71, 70.54, 69.34, 61.39, 70.22, 67.43, 70.02, 74.42, 76.11, 71.68, 72.34, 70.98, 69.77, 66.84, 68.04, 58.49, 58.17, 53.95, 53.98, 52.0, 52.61, 51.09, 49.51, 49.13, 47.38, 44.54, 37.11, 37.01, 32.79, 30.26, 34.33, 29.24, 21.24, 18.32, 17.69, 15.81, 12.21, 9.75, 8.36, 6.37, 6.55, 6.35, 5.46, 5.43, 5.65, 4.71, 4.83, 4.37, 5.38, 4.62, 8.31]
    }
    ],
    "labels": [1874, 1875, 1876, 1877, 1878, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  }
}`}),b,p,g,n(a,{id:"chart_64a56fec","data-code":`{
  "type": "doughnut",
  "data": {
    "datasets": [{
        "data": [165102, 145700, 135978, 124046, 113915, 105341, 62467, 30501, 25994, 18399, 15424, 15121, 14789, 14623, 14569],
        "backgroundColor": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3", "#1f78b4", "#b2df8a"]
    }],
    "labels": ["Drama, Short", "Short", "Drama", "Documentary", "Comedy, Short", "Documentary, Short", "Comedy", "Animation, Short", "Horror, Short", "Short, Thriller", "Horror", "Thriller", "Action", "Music", "Music, Short"]
  }
}`}),y,n(a,{id:"chart_64a56f66","data-code":`{
  "type": "bar",
  "data": {
    "datasets": [{
        "label": "Total TV show/series/whatever of genre",
        "data": [61950, 49560, 34903, 22320, 20346, 15236, 15174 ,10648, 10443, 10386, 10141, 9916, 7931, 7800, 7585, 5807, 5528, 5507, 4988, 4868, 4524 ,4483, 3104, 2228, 1666, 1213, 457, 1],
        "backgroundColor": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c"]
    }],
    "labels": ["Comedy", "Drama", "Documentary", "Reality-TV", "Talk-Show", "Family", "Animation", "Romance", "Crime", "Action", "Adventure", "Music", "Game-Show", "News", "Sport", "History", "Fantasy", "Mystery", "Thriller", "Sci-Fi", "Short", "Horror", "Biography", "Adult", "Musical", "War", "Western", "Film-Noir"]
  }
}`}),w,v,k,_,I,T,n(a,{id:"chart_64a56eec","data-code":`{
  "type": "doughnut",
  "data": {
    "datasets": [{
        "data": [38825, 26944, 25393, 17387, 15152, 6896, 5310, 5130, 5126, 4874, 4768, 3622, 3090, 2803, 2320],
        "backgroundColor": ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#a6cee3", "#1f78b4", "#b2df8a"]
    }],
    "labels": ["Comedy", "Documentary", "Drama", "Reality-TV", "Talk-Show", "Family", "News", "Animation", "Music", "Game-Show", "Sport", "Drama, Romance", "Crime", "Comedy, Drama", "Adventure"]
  }
}`}),S,x,C,M,n(a,{id:"chart_64a56968","data-code":`{
  "type": "line",
  "data": {
    "datasets": [{
        "label": "All runtimes",
        "backgroundColor": "#36a2eb",
        "borderColor": "#36a2eb",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [9, 9974, 15943, 27293, 28010, 35878, 31307, 33918, 30273, 25225, 39002, 24815, 24758, 20926, 19893, 31281, 14780, 13988, 13218, 10645, 20348, 7829, 9855, 7940, 7364, 10739, 7185, 6610, 7058, 5599, 17446, 2380, 2712, 2375, 1962, 3786, 1781, 1764, 1943, 1665, 4831, 1366, 2136, 2485, 2684, 7495, 2334, 2427, 2942, 1871, 9481, 2292, 8880, 3445, 3127, 5155, 3517, 3705, 4605, 3845, 21550, 3243, 3206, 2847, 2510, 4404, 2216, 2721, 2764, 2223, 8511, 3354, 4716, 3969, 3800, 9000, 4146, 4170, 5071, 3809, 12799, 4628, 6741, 6423, 6967, 12442, 7544, 8469, 9482, 8225, 34757, 7394, 8703, 8527, 7202, 11933, 7197, 6393, 6419, 4595, 12565, 3821, 4503, 3828, 3992, 6914, 3168, 3091, 3184, 2290, 5816, 2049, 2288, 1924, 1847, 2919, 1624, 1622, 1874, 1449, 8183, 1084, 1395, 1131, 1119, 1654, 1085, 1029, 1051, 862, 1825, 727, 873, 749, 825, 1533, 781, 798, 808, 661, 1427, 544, 639, 568, 563, 869, 485, 450, 492, 368, 1454, 351, 421, 404, 352, 581, 367, 298, 322, 248, 614, 217, 253, 212, 227, 389, 190, 213, 183, 164, 289, 125, 148, 117, 124, 219, 125, 126, 117, 106, 1627, 71, 76, 77, 74, 122, 75, 68, 72, 41, 122, 37, 70, 37, 38, 81, 47, 50, 36, 32, 313, 28, 28, 14, 26, 44, 19, 25, 49, 22, 209, 28, 23, 17, 16, 44, 23, 24, 16, 24, 91, 13, 17, 20, 20, 44, 14, 17, 17, 13, 28, 20, 17, 13, 14, 21, 11, 16, 15, 7, 327, 3, 17, 14, 10, 23, 15, 12, 13, 6, 36, 10, 11, 4, 7, 22, 10, 10, 7, 4, 26, 6, 3, 10, 11, 10, 5, 6, 7, 5, 64, 3, 3, 7, 4, 13, 2, 5, 10, 4, 14, 4, 5, 3, 5, 21, 3, 7, 9, 5, 6, 2, 2, 4, 4, 4, 4, 6, 3, 131, 4, 5, 3, 1, 8, 2, 1, 6, 16, 3, 5, 1, 2, 9, 3, 5, 3, 2, 10, 2, 1, 4, 2, 4, 3, 1, 4, 18, 2, 2, 1, 1, 1, 4, 4, 1, 10, 1, 2, 2, 1, 1, 1, 3, 2, 3, 3, 2, 1, 1, 4, 2, 118, 2, 1, 2, 3, 2, 1, 2, 1, 2, 2, 1, 1, 1, 1, 6, 1, 2, 6, 1, 2, 2, 1, 2, 2, 7, 1, 2, 3, 2, 1, 8, 2, 1, 1, 1, 4, 1, 1, 1, 2, 1, 1, 17, 2, 1, 3, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 6, 1, 3, 1, 1, 1, 1, 1, 1, 22, 7, 1, 3, 1, 2, 1, 1, 1, 6, 1, 1, 6, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 20, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 2, 1, 6, 2, 1, 2, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 22, 1, 1, 1, 3, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }],
    "labels": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 330, 331, 332, 333, 334, 335, 336, 338, 339, 340, 341, 343, 345, 346, 347, 348, 350, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 378, 379, 380, 381, 382, 383, 384, 385, 388, 390, 392, 395, 396, 397, 398, 400, 402, 404, 406, 409, 410, 411, 414, 415, 416, 417, 418, 420, 421, 423, 425, 426, 429, 430, 435, 437, 439, 440, 442, 443, 447, 448, 450, 453, 460, 463, 465, 467, 468, 473, 476, 480, 485, 489, 495, 496, 500, 501, 502, 504, 510, 516, 519, 520, 540, 545, 549, 551, 566, 570, 575, 579, 580, 590, 599, 600, 601, 604, 605, 607, 613, 615, 619, 620, 623, 625, 630, 641, 659, 660, 663, 665, 669, 675, 680, 691, 700, 703, 715, 717, 719, 720, 721, 735, 746, 747, 755, 761, 763, 776, 780, 783, 785, 795, 808, 814, 840, 842, 865, 873, 900, 912, 950, 960, 990, 999, 1020, 1035, 1080, 1100, 1151, 1179, 1184, 1200, 1260, 1320, 1325, 1327, 1380, 1400, 1428, 1440, 1441, 1452, 1470, 1500, 1554, 1559, 1560, 1568, 1584, 1620, 1644, 1669, 1680, 1800, 1970, 1973, 2088, 2112, 2160, 2382, 2400, 2520, 2580, 2880, 2905, 3077, 3122, 3240, 3300, 3720, 4019, 4080, 5220, 5460, 5760, 6000, 7200, 9000, 10062, 13319, 14400, 28643, 43200, 51420]
  }
}`}),q,W,n(a,{id:"chart_64a5695a","data-code":`{
  "type": "line",
  "data": {
    "datasets": [{
        "label": "Mid 80%",
        "backgroundColor": "#36a2eb",
        "borderColor": "#36a2eb",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [35878, 31307, 33918, 30273, 25225, 39002, 24815, 24758, 20926, 19893, 31281, 14780, 13988, 13218, 10645, 20348, 7829, 9855, 7940, 7364, 10739, 7185, 6610, 7058, 5599, 17446, 2380, 2712, 2375, 1962, 3786, 1781, 1764, 1943, 1665, 4831, 1366, 2136, 2485, 2684, 7495, 2334, 2427, 2942, 1871, 9481, 2292, 8880, 3445, 3127, 5155, 3517, 3705, 4605, 3845, 21550, 3243, 3206, 2847, 2510, 4404, 2216, 2721, 2764, 2223, 8511, 3354, 4716, 3969, 3800, 9000, 4146, 4170, 5071, 3809, 12799, 4628, 6741, 6423, 6967, 12442, 7544, 8469, 9482, 8225, 34757, 7394, 8703, 8527, 7202, 11933, 7197, 6393, 6419, 4595, 12565, 3821]
    }],
    "labels": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101]
  }
}`}),A,n(a,{id:"chart_64a5691c","data-code":`{
  "type": "line",
  "data": {
    "datasets": [{
        "label": "Average runtime of 40+ minute films",
        "backgroundColor": "#36a2eb",
        "borderColor": "#36a2eb",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [61, 135, 60, 60, 68, 76, 70, 68, 90, 66, 75, 59, 59, 68, 86, 63, 59, 62, 63, 65, 65, 67, 69, 73, 72, 73, 74, 72, 74, 78, 79, 80, 78, 81, 82, 80, 81, 81, 83, 85, 84, 86, 86, 85, 85, 85, 86, 87, 87, 89, 89, 89, 91, 92, 93, 93, 92, 91, 92, 92, 93, 92, 93, 94, 95, 94, 93, 95, 95, 92, 93, 90, 90, 90, 91, 89, 90, 92, 90, 90, 92, 91, 92, 91, 91, 92, 91, 94, 92, 93, 92, 93, 93, 94, 93, 92, 93, 92, 91, 92, 91, 91, 91, 90, 91, 89, 89, 89, 88, 88, 88, 89, 92, 88, 88, 89, 89, 90, 91, 94, 93, 91, 95]
    }],
    "labels": [1896, 1899, 1900, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
  }
}`}),D,V,N,j,R,B,F,n(a,{id:"chart_64a5689c","data-code":`{
  "data": {
    "datasets": [
    {
        "type": "line",
        "label": "Percentage of nice round numbers",
        "yAxisID": "y1",
        "borderColor": "#4bc0c0",
        "backgroundColor": "#4bc0c0",
        "data": [3, 1, 15, 49, 56, 31, 30, 36, 42, 38, 39, 38, 34, 29, 29]
    },
    {
        "type": "bar",
        "label": "Total films",
        "yAxisID": "y",
        "backgroundColor": "#ff6384",
        "data": [30, 1098, 2479, 12305, 12435, 22785, 20801, 31065, 49080, 58655, 61685, 77709, 217593, 514291, 82751]
    },{
        "type": "bar",
        "label": "Total films with nice round runtimes",
        "backgroundColor": "#36a2eb",
        "yAxisID": "y",
        "data": [1, 13, 371, 6047, 6958, 7130, 6245, 11270, 20425, 22483, 23871, 29611, 73504, 150341, 24267]
    }
    ],
    "labels": ["0 - 1890", "1890 - 1900", "1900 - 1910", "1910 - 1920", "1920 - 1930", "1930 - 1940", "1940 - 1950", "1950 - 1960", "1960 - 1970", "1970 - 1980", "1980 - 1990", "1990 - 2000", "2000 - 2010", "2010 - 2020", "2020 - 2030"]
  },
  "options": {
    "stacked": "false",
    "scales": {
        "y": {
            "type": "linear",
            "display": true,
            "position": "left"
        },
        "y1": {
            "type": "linear",
            "display": true,
            "position": "right"
        }
    }
  }
}`}),O,H,P,n(a,{id:"chart_64a5685e","data-code":`{
  "type": "line",
  "data": {
    "datasets": [
    {
        "label": "Films per year",
        "yAxisID": "y",
        "pointRadius": 1,
        "backgroundColor": "#ff6384",
        "borderColor": "#ff6384",
        "borderWidth": "1",
        "data": [1, 0, 0, 4, 3, 0, 0, 2, 2, 1, 0, 1, 0, 7, 4, 0, 5, 7, 5, 2, 35, 40, 282, 233, 131, 157, 201, 192, 145, 194, 190, 173, 181, 185, 257, 346, 415, 591, 1033, 2932, 1754, 866, 947, 1062, 901, 888, 916, 883, 823, 795, 907, 1021, 1141, 1167, 1347, 1646, 1789, 2093, 1905, 1814, 2018, 2002, 2235, 2393, 2406, 2215, 1915, 1887, 1968, 1791, 1598, 1522, 1702, 1852, 2044, 2187, 2335, 2404, 2429, 2593, 2557, 2771, 2891, 3216, 3161, 3246, 3462, 3675, 3855, 4086, 4349, 4434, 4493, 5054, 5049, 5219, 5404, 5374, 5162, 5234, 5199, 5319, 5306, 5111, 5424, 5508, 5614, 5451, 5277, 5509, 5515, 5650, 5496, 5648, 5764, 5871, 5890, 5795, 5774, 5745, 6261, 6797, 7087, 7564, 8253, 8828, 9715, 10854, 12109, 13559, 16439, 18923, 20087, 22052, 25655, 31627, 36573, 40202, 44975, 49174, 52142, 51207, 53010, 52565, 50152, 45399, 38892, 33887]
    },
    {
        "label": "Films per year (including null runtimes)",
        "yAxisID": "y",
        "pointRadius": 1,
        "backgroundColor": "#4bc0c0",
        "borderColor": "#4bc0c0",
        "borderWidth": "1",
        "data": [1, 0, 0, 4, 3, 0, 0, 2, 2, 1, 0, 1, 0, 45, 5, 2, 6, 10, 9, 3, 99, 115, 852, 1356, 1796, 1820, 1860, 1768, 1809, 2675, 1837, 1704, 1855, 2489, 4300, 5441, 6418, 7735, 8705, 9780, 9351, 8574, 7069, 5628, 4753, 4167, 4545, 4242, 3622, 3048, 3104, 3393, 3405, 3521, 3501, 3665, 3168, 3244, 3046, 2887, 2928, 2873, 3260, 3269, 3157, 2936, 2564, 2462, 2396, 2170, 1993, 1975, 2300, 2493, 2682, 2909, 3084, 3109, 3339, 3559, 3646, 3878, 4025, 4408, 4445, 4591, 4937, 5259, 5368, 5668, 5961, 6217, 6299, 6646, 6780, 7021, 7346, 7303, 7017, 6995, 6825, 7120, 6985, 6798, 7149, 7345, 7436, 7230, 7171, 7295, 7540, 7701, 7471, 7633, 7804, 7892, 8346, 8021, 8084, 8099, 8427, 9286, 9677, 10267, 11239, 11986, 12987, 14273, 15627, 17280, 20248, 23738, 25103, 27938, 32423, 39138, 44715, 51030, 57480, 62615, 68168, 68614, 73933, 75391, 73842, 68778, 62141, 57314]
    },
    {
        "label": "Total runtime per year",
        "yAxisID": "y1",
        "pointRadius": 1,
        "borderWidth": "1",
        "backgroundColor": "#36a2eb",
        "borderColor": "#36a2eb",
        "data": [1, 0, 0, 4, 3, 0, 0, 2, 2, 1, 0, 1, 0, 7, 3, 0, 5, 7, 23, 2, 79, 49, 368, 294, 173, 363, 458, 493, 400, 672, 850, 941, 1114, 1476, 2484, 3268, 5619, 9150, 15463, 45589, 38634, 28336, 39534, 48410, 44372, 46100, 45872, 44630, 43906, 44034, 48770, 55293, 58801, 60027, 67674, 69631, 83121, 102999, 101917, 101066, 110531, 111657, 125365, 130097, 133525, 128747, 112539, 106766, 109980, 103488, 86240, 79673, 92545, 108991, 120190, 133129, 143751, 147565, 151100, 158473, 162564, 175171, 187318, 203976, 203962, 219643, 227959, 242254, 253027, 256205, 281117, 288423, 290469, 324363, 340100, 338890, 359077, 355770, 349417, 353823, 348340, 353803, 356303, 355375, 374711, 380163, 390763, 390313, 389198, 397389, 394873, 403183, 398506, 415548, 420989, 427787, 418533, 407046, 399023, 391742, 417833, 437788, 453150, 473058, 500582, 515767, 563673, 602259, 652389, 706196, 817282, 900833, 959792, 1030857, 1138907, 1296130, 1391072, 1499871, 1661031, 1726337, 1819416, 1854753, 1897828, 1937772, 1904355, 1863966, 1548347, 1492013]
    }],
    "labels": [1874, 1875, 1876, 1877, 1878, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  },
  "options": {
    "stacked": "false",
    "scales": {
        "y": {
            "type": "linear",
            "display": true,
            "position": "left"
        },
        "y1": {
            "type": "linear",
            "display": true,
            "position": "right",
            "grid": {
                "drawOnChartArea": false
            }
        }
    }
  }
}`}),L,n(a,{id:"chart_64a56826","data-code":`{
  "type": "line",
  "data": {
    "datasets": [{
        "label": "Average runtime of films",
        "backgroundColor": "#36a2eb",
        "borderColor": "#36a2eb",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.75, 1.0, 1.0, 4.6, 1.0, 2.26, 1.23, 1.3, 1.26, 1.32, 2.31, 2.28, 2.57, 2.76, 3.46, 4.47, 5.44, 6.15, 7.98, 9.67, 9.45, 13.54, 15.48, 14.97, 15.55, 22.03, 32.72, 41.75, 45.58, 49.25, 51.91, 50.08, 50.54, 53.35, 55.39, 53.77, 54.16, 51.53, 51.44, 50.24, 42.3, 46.46, 49.21, 53.5, 55.71, 54.77, 55.77, 56.09, 54.37, 55.5, 58.13, 58.77, 56.58, 55.88, 57.78, 53.97, 52.35, 54.37, 58.85, 58.8, 60.87, 61.56, 61.38, 62.21, 61.12, 63.58, 63.22, 64.79, 63.43, 64.52, 67.67, 65.85, 65.92, 65.64, 62.7, 64.64, 65.05, 64.65, 64.18, 67.36, 64.93, 66.45, 66.2, 67.69, 67.6, 67.0, 66.52, 67.15, 69.53, 69.08, 69.02, 69.61, 71.6, 73.75, 72.13, 71.6, 71.36, 72.51, 73.57, 73.04, 72.86, 71.06, 70.24, 69.11, 68.19, 66.74, 64.41, 63.94, 62.54, 60.65, 58.42, 58.02, 55.49, 53.88, 52.08, 49.72, 47.61, 47.78, 46.75, 44.39, 40.98, 38.04, 37.31, 36.93, 35.11, 34.89, 36.22, 35.8, 36.86, 37.97, 41.06, 39.81, 44.03]
    }],
    "labels": [1874, 1877, 1878, 1881, 1882, 1883, 1885, 1887, 1888, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  }
}`}),G,E,U,z,e("div",Y,[(i(),r("svg",K,J)),X,$]),n(a,{id:"chart_64a567ae","data-code":`{
  "type": "line",
  "title": "Yearly totals per type",
  "data": {
    "datasets": [{
        "label": "Shorts",
        "backgroundColor": "#a6cee3",
        "borderColor": "#a6cee3",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [ 1, 0, 0, 4, 3, 0, 0, 2, 2, 1, 0, 1, 0, 45, 5, 2, 6, 10, 9, 3, 99, 115, 851, 1355, 1789, 1812, 1854, 1761, 1805, 2672, 1835, 1686, 1832, 2474, 4279, 5349, 6313, 7570, 8357, 9107, 8195, 6941, 4976, 3440, 2508, 1711, 1893, 1648, 1429, 1130, 1174, 1322, 1352, 1355, 1359, 1633, 1177, 1189, 963, 881, 1003, 923, 1008, 1069, 1028, 900, 803, 930, 930, 841, 822, 840, 882, 835, 892, 970, 985, 1029, 1058, 1106, 1068, 1159, 1115, 1204, 1133, 1078, 1203, 1302, 1277, 1386, 1525, 1550, 1560, 1654, 1619, 1680, 1673, 1680, 1507, 1531, 1527, 1633, 1604, 1430, 1554, 1560, 1609, 1355, 1263, 1325, 1399, 1513, 1375, 1393, 1462, 1574, 1646, 1698, 1836, 1936, 2221, 2593, 2901, 3157, 3742, 4218, 4704, 5397, 6397, 7551, 9618, 11844, 12548, 14365, 17911, 23114, 28136, 32987, 38239, 42745, 47209, 46448, 50184, 51589, 50301, 45923, 41910, 35689 ]
    },{
        "label": "Movies",
        "backgroundColor": "#1f78b4",
        "borderColor": "#1f78b4",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 7, 8, 6, 7, 4, 3, 2, 18, 23, 15, 21, 92, 105, 165, 347, 673, 1156, 1633, 2093, 2188, 2245, 2456, 2652, 2594, 2192, 1918, 1929, 2070, 2050, 2166, 2141, 2031, 1989, 2054, 2082, 2005, 1923, 1949, 2231, 2126, 1980, 1876, 1758, 1530, 1465, 1328, 1166, 1120, 1305, 1504, 1627, 1791, 1998, 1961, 2096, 2098, 2117, 2198, 2379, 2492, 2535, 2579, 2690, 2740, 2712, 2648, 2866, 3184, 3211, 3278, 3694, 3820, 4094, 4086, 3997, 3896, 3771, 4024, 3897, 3840, 3962, 4096, 4050, 4049, 4045, 4178, 4368, 4463, 4371, 4405, 4543, 4542, 4826, 4382, 4316, 4143, 4115, 4292, 4309, 4586, 4752, 4914, 5123, 5463, 5709, 5912, 6453, 7426, 7909, 8630, 10079, 11539, 12313, 13282, 14254, 14933, 16001, 16633, 17867, 18299, 18315, 17824, 15321, 17228 ]
    },{
        "label": "TV Shorts",
        "backgroundColor": "#b2df8a",
        "borderColor": "#b2df8a",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 22, 27, 12, 2, 0, 0, 0, 0, 0, 4, 2, 7, 4, 9, 7, 27, 25, 16, 24, 24, 43, 43, 35, 47, 53, 114, 155, 104, 82, 70, 196, 51, 68, 62, 65, 62, 62, 60, 61, 62, 54, 53, 55, 61, 69, 73, 59, 78, 72, 71, 97, 69, 60, 107, 95, 121, 114, 107, 125, 98, 91, 97, 134, 128, 157, 165, 189, 214, 198, 269, 245, 271, 249, 222, 255, 298, 340, 423, 626, 745, 586, 532, 306, 238, 82 ]
    },{
        "label": "TV Movies",
        "backgroundColor": "#33a02c",
        "borderColor": "#33a02c",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 2, 0, 1, 1, 2, 1, 8, 51, 119, 143, 0, 2, 0, 1, 5, 14, 100, 144, 144, 131, 79, 97, 135, 305, 416, 452, 449, 597, 669, 811, 919, 1083, 1175, 1370, 1308, 1270, 1335, 1383, 1274, 1304, 1383, 1347, 1334, 1357, 1340, 1253, 1254, 1294, 1378, 1434, 1528, 1575, 1587, 1518, 1464, 1415, 1406, 1443, 1466, 1431, 1483, 1539, 1488, 1568, 1609, 1864, 1913, 1936, 2141, 2156, 2430, 2618, 2685, 2932, 3099, 3323, 3382, 3669, 3166, 3238, 3008, 3260, 3361, 3242, 3263, 3589, 3737, 3503, 3264, 3018, 2352, 2218 ]
    },{
        "label": "TV Specials",
        "backgroundColor": "#fb9a99",
        "borderColor": "#fb9a99",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 1, 3, 5, 1, 0, 1, 0, 0, 1, 9, 8, 12, 13, 13, 15, 23, 25, 29, 45, 58, 72, 65, 88, 78, 81, 90, 109, 158, 131, 123, 135, 142, 149, 134, 125, 117, 149, 127, 149, 168, 180, 202, 200, 188, 182, 203, 215, 231, 238, 248, 295, 264, 285, 284, 307, 323, 338, 375, 412, 456, 497, 507, 564, 602, 638, 671, 696, 864, 947, 995, 1029, 996, 998, 1036, 1246, 1328, 1355, 1272, 1318, 1400, 1414, 1430, 1707, 2320, 2097 ]
    },{
        "label": "Videos",
        "backgroundColor": "#e31a1c",
        "borderColor": "#e31a1c",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 3, 2, 2, 0, 3, 2, 6, 8, 7, 8, 6, 11, 7, 10, 15, 9, 10, 12, 12, 16, 45, 35, 36, 53, 45, 65, 84, 96, 151, 223, 245, 348, 559, 1022, 1310, 1458, 1476, 1600, 1594, 1958, 2625, 2916, 3027, 3189, 3062, 3232, 3717, 4107, 4903, 5425, 6134, 7731, 9463, 10888, 11844, 11891, 11488, 10840, 11294, 11301, 10716, 10344, 9874, 10153, 10396, 11234, 12290, 10500, 10188, 9667 ]
    },{
        "label": "TV Episodes",
        "backgroundColor": "#fdbf6f",
        "borderColor": "#fdbf6f",
        "pointRadius": 1,
        "borderWidth": "1",
        "data": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 3, 3, 6, 7, 5, 5, 2, 3, 28, 27, 30, 40, 65, 37, 95, 303, 254, 97, 120, 39, 29, 45, 49, 76, 201, 422, 858, 1879, 4087, 5547, 5985, 5943, 7902, 8700, 8556, 9649, 10511, 10676, 11382, 11503, 11169, 13267, 14484, 17266, 18686, 19574, 18488, 21498, 21413, 22110, 22598, 23615, 22140, 22129, 22141, 22051, 22260, 21681, 23034, 22241, 25585, 25721, 27450, 28750, 27882, 29467, 28776, 31964, 34680, 36381, 37089, 41158, 45199, 51206, 54573, 58721, 66265, 69156, 70499, 77660, 79382, 88087, 101388, 109803, 123379, 139117, 149536, 154304, 176950, 200187, 229996, 246714, 260924, 276281, 292177, 309313, 311950, 304617, 281336, 311499 ]
    }],
    "labels": [ 1874, 1875, 1876, 1877, 1878, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021 ]
  }
}`}),ee])}var ie=s(l,[["render",te],["__file","imdbanalysis-2.html.vue"]]);export{ie as default};
