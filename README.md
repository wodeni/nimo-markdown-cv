nimo-markdown-cv
================

A curriculum vitae template that let you write your resume in markdown and support both HTML and PDF output formats. To generate the cv, we use [Jekyll](https://jekyllrb.com/).

The project is a fork from [markdown-cv](http://elipapa.github.io/markdown-cv) and the usage is essentially the same.

***

## Getting started

To start, simply [fork the nimo-markdown-cv repo](https://github.com/elipapa/markdown-cv)

![](https://help.github.com/assets/images/help/repository/fork_button.jpg)

To transform your plain text CV into a beautiful looking HTML page and share it you then have two options:

## Using Github Pages to publish it online

1. Delete the existing `gh-pages` branch from your fork. It will only contain this webpage. You can either use git or [the github web interface](https://help.github.com/articles/creating-and-deleting-branches-within-your-repository/#deleting-a-branch)
2. Create a new branch called `gh-pages` (which will then be a copy of master)
3. Head to *yourusername*.github.io/markdown-cv to see your CV live.

Any change you want to make to your CV from then on would have to be done on the `gh-pages` branch and will be immediately rendered by Github Pages.


## Build it locally and print a PDF

1. [install jekyll](https://jekyllrb.com/docs/installation/) on your computer. `gem install jekyll` will do for most users.
2. Clone your fork on your computer
3. Type `jekyll serve` and you'll be able to see your CV on your local host (the default address is http://localhost:4000).
4. You can edit the `index.md` file and see changes live in your browser.
5. To print a PDF, just press *Print*. Print and web CSS media queries should take care of the styling.
