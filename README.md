# music-for-humanity

## Get started
### 1. Download and install
- [Node](https://nodejs.org/en/)
```
brew install node
```
- [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
```
brew install mongodb
```
- [nodemon](https://www.npmjs.com/package/nodemon) (Optional)
```
npm install -g nodemon
```
### 2. Install dependencies
```
npm install
```

### 3. Run MongoDB
1. Create a data directory within the music-for-humanity repo
```
mkdir data
```
2. Run MongoDB with the following command from within the music-for-humanity directory
```
mongod --dbpath data
```

### 4. Start the node server
```
npm start
```
or
```
nodemon start
```
