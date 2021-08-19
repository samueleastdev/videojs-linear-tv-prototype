# videojs-linear-tv-prototype

Prototyping a linear TV flow with video js based on current time with moment

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```sh
npm install --save videojs-linear-tv-prototype
```

## Usage

To include videojs-linear-tv-prototype on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-linear-tv-prototype.min.js"></script>
<script>
  var player = videojs("my-video");

  var programs = [
    {
      title: "Elephants Dream",
      start: moment(new Date("Aug 19, 2021 21:25:00")).unix(),
      end: moment(new Date("Aug 19, 2021 22:00:00")).unix(),
      duration: 7208,
      media: {
        type: "video/mp4",
        src: "https://s3b-assets-bucket.s3.amazonaws.com/test-videos/ElephantsDream.mp4",
      },
    },
    {
      title: "Sintel",
      start: moment(new Date("Aug 19, 2021 09:49:00")).unix() + 7208,
      end: moment(new Date("Aug 19, 2021 09:49:00")).unix() + 7208 + 7208,
      duration: 7208,
      media: {
        type: "video/mp4",
        src: "https://s3b-assets-bucket.s3.amazonaws.com/test-videos/Sintel.mp4",
      },
    },
    {
      title: "Tears Of Steel",
      start: moment(new Date("Aug 19, 2021 20:01:00")).unix(),
      end: moment(new Date("Aug 19, 2021 20:01:00")).unix() + 634,
      duration: 634,
      media: {
        type: "application/dash+xml",
        src: "https://s3b-assets-bucket.s3.amazonaws.com/test-videos/TearsOfSteel.mp4",
      },
    },
    {
      title: "Big BuckBunny",
      start: moment(new Date("Aug 19, 2021 21:05:00")).unix(),
      end: moment(new Date("Aug 19, 2021 21:05:00")).unix() + 7208,
      duration: 7208,
      media: {
        type: "video/mp4",
        src: "https://s3b-assets-bucket.s3.amazonaws.com/test-videos/BigBuckBunny.mp4",
      },
    },
  ];

  var adverts = {
    media: {
      type: "video/mp4",
      src: "https://s3b-assets-bucket.s3.amazonaws.com/test-videos/ForBiggerBlazes.mp4",
    },
  };

  player.linearTvPrototype({
    programs: programs,
    adverts: adverts,
  });
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-linear-tv-prototype via npm and `require` the plugin as you would any other module.

```js
var videojs = require("video.js");

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require("videojs-linear-tv-prototype");

var player = videojs("my-video");

player.linearTvPrototype();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(["video.js", "videojs-linear-tv-prototype"], function (videojs) {
  var player = videojs("my-video");

  player.linearTvPrototype();
});
```

## License

Apache-2.0. Copyright (c) Samuel East

[videojs]: http://videojs.com/
