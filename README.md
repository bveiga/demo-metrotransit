![Tests](https://github.com/bveiga/demo-metrotransit/actions/workflows/node.yml/badge.svg)
# Metro Transit Demo
A simple demo app to display routes and departure times for metro routes similar to metrotransit.org.

Assumptions:
1. App uses the metrotransit.org api to track routes, directions, stops, and departure times.
2. App can select a bus route from a list of available routes
3. App can select a direction for a bus route
4. App can select a stop for a given route and direction
5. App displays departures for a given stop
6. "Show my train" functionality is not implemented
7. Backend is not required to handle API calls since no sensitive data is transferred.

## Build
To build this application, first install [Node JS](https://nodejs.org/). This app was tested with 14.x and 16.x versions of Node.

From within the app directory, install dependencies with NPM:
```
$ npm install
```

Next, if you're on a Linux or Unix machine, run this:
```
$ npm run build
```

If you're on a windows machine, run this instead:
```
$ npm run build-windows
```

This will build your application for production and output the resulting files in the `build` directory.

## Run
To run this application locally:
```
$ npm run start
```

## Test
To run unit tests associated with the applications, run the following command:
```
$ npm run test
```


## Languages & Frameworks ##
* HTML
* SASS
* React
* TypeScript

## Version History ##
Version 0.1.0
- Initial React app setup

## License
MIT

See [LICENSE](LICENSE.txt) to see the full text.