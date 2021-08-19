import moment from 'moment';
import videojs from 'video.js';
import { version as VERSION } from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  programs: [],
  adverts: []
};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class LinearTvPrototype extends Plugin {

  /**
     * Create a LinearTvPrototype plugin instance.
     *
     * @param  {Player} player
     *         A Video.js Player instance.
     *
     * @param  {Object} [options]
     *         An optional options object.
     *
     *         While not a core part of the Video.js plugin architecture, a
     *         second argument of options is a convenient way to accept inputs
     *         from your plugin's caller.
     */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass('vjs-linear-tv-prototype');
    });

    this.moment = moment();

    this.startWatching();

    this.renderGuide();

  }

  startWatching() {

    let setMedia; let seekTime; let seekMore;
    const guide = this.options.programs;
    const adverts = this.options.adverts;
    const player = this.player;

    // Get media for the current hour if it is set and also check the time in seconds
    setMedia = guide.filter(media => (this.moment.unix().between(media.start, media.end)));

    if (setMedia.length > 0) {

      player.src(setMedia[0].media);

      player.one('play', function(_event) {

        this.currentTime(this.moment.unix() - setMedia[0].start);

      });

    } else {

      // console.log('No video at this time add slate');

      player.src(adverts.media);

      player.play();

    }

    player.on('ended', function(_event) {

      this.currentTime(0);

      this.play();

    });

    /* this.dom.getElementById("skip_current").addEventListener('click', function() {

            player.currentTime(this.moment.unix() - setMedia[0].start);

        });*/

    player.on('timeupdate', function(_event) {

      if (setMedia.length > 0) {

        if (this.moment.unix().between_equals(setMedia[0].start, setMedia[0].end)) {

          // Still in current media time

        } else {

          // Media ended switch
          const updateMedia = guide.filter(media => this.moment.unix().between_equals(media.start, media.end));

          if (updateMedia.length > 0) {

            this.src(updateMedia[0].media);

            this.play();

            setMedia[0] = updateMedia[0];

          } else {

            // console.log('No video at this time add slate');

          }

        }

      } else {

        setMedia = guide.filter(media => (this.moment.unix().between(media.start, media.end)));

        if (setMedia.length > 0) {

          this.src(setMedia[0].media);

          this.play();

        } else {

          // console.log('fallback needed');

        }

      }

    });

    player.on('seeking', function(event) {

      if (setMedia.length > 0) {

        seekTime = this.currentTime();

        seekMore = this.moment.unix() - setMedia[0].start;

        if (seekTime > seekMore) {

          this.currentTime(seekMore);

        }

      }

    });

    player.on('seeked', function(event) {

      if (setMedia.length > 0) {

        seekTime = this.currentTime();

        seekMore = this.moment.unix() - setMedia[0].start;

        if (seekTime > seekMore) {

          this.currentTime(seekMore);

        }

      }

    });

  }

  renderGuide() {

    /* var programs = this.options.programs;

        var progs = '<ul>';

        programs.forEach(function(element) {

            progs += '<li>Title: ' + element.title + ', Start: ' + moment.unix(element.start).format("MM/DD/YYYY HH:mm:ss") + ', End: ' + moment.unix(element.end).format("MM/DD/YYYY HH:mm:ss") + '</li>';

        });

        progs += '<ul>';

        this.dom.getElementById('programmes').innerHTML = progs;
        */

  }

}

// Define default values for the plugin's `state` object here.
LinearTvPrototype.defaultState = {};

// Include the version number.
LinearTvPrototype.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('linearTvPrototype', LinearTvPrototype);

export default LinearTvPrototype;
