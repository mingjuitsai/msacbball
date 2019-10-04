# msacbball 
> MSAC ball courts data scraping with Node.js.

Data scraping MSAC timetable via public HTML site. Currently official timetable loads iFrame from a widget also reload / re-render each time user switches date. Performance gets slow.
https://www.melbournesportshub.com.au/msac/basketball-court-availability/

We try to cache the data in JSON and preloads the schedule in background before the user asks for them. Then only reloads the part that needs to be re-rendered.

Built with Node.js and Vue.js. It is not quite finished yet. Fixnig a couple of bugs.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Scrape data

``` bash
# scrape data under /data
node data
```
