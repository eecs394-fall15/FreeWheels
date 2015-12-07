# FreeWheels
FreeWheels -- A roadtrip POI app built on Google Places API
====================================

## DESCRIPTION

FreeWheels is an iOS app to tell you about awesome places nearby when on a roadtrip. 

FreeWheels can show you the cool nearby:
*Amusement Park
*Art Gallery
*Bowling Alley
*Casino
*Movie Theater
*Museum
*Night Club
*Park
*Place of Worship
*Restaurant
*Spa
*Stadium
*Store
*University
*Zoo

So you can focus on the road.

## SYSTEM REQUIREMENTS

- Steroids 4.1.22 
- Node.js 0.10.x+ 
- NPM   

## SECURITY

Don't commit Parse logins and Google API keys to git!

## INSTALLATION

To build FreeWheels, simply fork the repository, plug in Parse and Google API keys, and run ```bash
$ steroids connect
```

## SYNTAX

Gollum supports a variety of formats and extensions (Markdown, MediaWiki, Textile, …).
On top of these formats Gollum lets you insert headers, footers, links, image, math and more.

Check out the [Gollum Wiki](https://github.com/gollum/gollum/wiki) for all of Gollum's formats and syntactic options.


## RUNNING

To view and edit your Gollum repository locally via the built in web
interface, simply install the Gollum gem, navigate to your repository via the
command line, and run the executable:

```bash
$ gollum
```

This will start up a web server running the Gollum frontend and you can view
and edit your wiki at http://localhost:4567. To get help on the command line
utility, you can run it like so:

```bash
$ gollum --help
```

Note that the gollum server will not run on Windows because of [an issue](https://github.com/rtomayko/posix-spawn/issues/9) with posix-spawn (which is used by Grit).

### RACK

You can also run gollum with any rack-compatible server by placing this config.ru
file inside your wiki repository. This allows you to utilize any Rack middleware
like Rack::Auth, OmniAuth, etc.

```ruby
#!/usr/bin/env ruby
require 'rubygems'
require 'gollum/app'

gollum_path = File.expand_path(File.dirname(__FILE__)) # CHANGE THIS TO POINT TO YOUR OWN WIKI REPO
Precious::App.set(:gollum_path, gollum_path)
Precious::App.set(:default_markup, :markdown) # set your favorite markup language
Precious::App.set(:wiki_options, {:universal_toc => false})
run Precious::App
```

Your Rack middleware can pass author details to Gollum in a Hash in the session under the 'gollum.author' key.

## CONFIG FILE

Gollum optionally takes a `--config file`. See [config.rb](https://github.com/gollum/gollum/blob/master/config.rb) for an example.

## CUSTOM CSS/JS

The `--css` flag will inject `custom.css` from the root of your git repository into each page. `custom.css` must be commited to git or you will get a 302 redirect to the create page.

The `--js` flag will inject `custom.js` from the root of your git repository into each page. `custom.js` must be commited to git or you will get a 302 redirect to the create page.


## API DOCUMENTATION

The [Gollum API](https://github.com/gollum/gollum-lib/) allows you to retrieve
raw or formatted wiki content from a Git repository, write new content to the
repository, and collect various meta data about the wiki as a whole.


## CONTRIBUTE

If you'd like to hack on Gollum, start by forking the repo on GitHub:

http://github.com/gollum/gollum

To get all of the dependencies, install the gem first. The best way to get
your changes merged back into core is as follows:

1. Clone down your fork
1. Create a thoughtfully named topic branch to contain your change
1. Hack away
1. Add tests and make sure everything still passes by running `rake`
1. If you are adding new functionality, document it in the README
1. Do not change the version number, I will do that on my end
1. If necessary, rebase your commits into logical chunks, without errors
1. Push the branch up to GitHub
1. Send a pull request to the gollum/gollum project.

## RELEASING

Gollum uses [Semantic Versioning](http://semver.org/).

    x.y.z

For z releases:

```bash
$ rake bump
$ rake release
```

For x.y releases:

```bash
Update VERSION in lib/gollum.rb
$ rake gemspec
$ rake release
```

## BUILDING THE GEM FROM MASTER

```bash
$ gem uninstall -aIx gollum
$ git clone https://github.com/gollum/gollum.git
$ cd gollum
gollum$ rake build
gollum$ gem install --no-ri --no-rdoc pkg/gollum*.gem
```

## RUN THE TESTS

```bash
$ bundle install
$ bundle exec rake test
```

## WORK WITH TEST REPOS

An example of how to add a test file to the bare repository lotr.git.

```bash
$ mkdir tmp; cd tmp
$ git clone ../lotr.git/ .
Cloning into '.'...
done.
$ git log
$ echo "test" > test.md
$ git add . ; git commit -am "Add test"
$ git push ../lotr.git/ master
```