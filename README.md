# Image-search-gallery

# Init source TS
npm init -y

npm install typescript --save-dev

npx tsc --init



# Compile

npx tsc

# Run

npx live-server


# How to automate the process

* Add a script to package.json
"scripts": {
  "start": "tsc -w",
  "dev": "live-server"
}
# Run

npm run dev
