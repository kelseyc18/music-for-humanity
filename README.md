# music-for-humanity

## Get started
### 1. Download and install
- [Node](https://nodejs.org/en/)
```
brew install node
```
- [nodemon](https://www.npmjs.com/package/nodemon) (Optional)
```
npm install -g nodemon
```

### 2. Install dependencies
```
npm install
```

### 3. Start the node server
```
npm start
```
or
```
nodemon start
```
If you use the `nodemon` command, your process will automatically restart when your code changes.

## Developer Notes
The JavaScript for the player interface is located in `public/javascripts/player.js`.  Every time you make a change to this file, remember to run
```
browserify player.js -o player_bundle.js; browserify judge.js -o judge_bundle.js
```
from within the `public/javascripts/` directory so that the node module dependencies are included in the `bundle.js` script.

An alternative is to run
```
npm watch-player-js
```
and
```
npm watch-judge-js
```
in separate processes (e.g. two separate Terminal windows). This will automatically generate the `player_bundle.js` and `judge_bundle.js` files as you make changes to the `player.js` and `judge.js` files.
