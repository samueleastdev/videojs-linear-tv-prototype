
import videojs from 'video.js';
import { version as VERSION } from '../package.json';

const Plugin = videojs.getPlugin('plugin');

const Button = videojs.getComponent('Button');

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

    this.player.programs = this.options.programs;

    this.moment = moment();

    this.startWatching();

    this.addSkipButton();

  }

  addSkipButton() {

    const that = this;

    const skipButton = videojs.extend(Button, {
      constructor() {

        Button.apply(this, arguments);

        this.addClass('vjs-skip-button');

      },
      createEl() {

        return videojs.dom.createEl('button', {
          className: 'vjs-custom-button vjs-control  vjs-button',
          innerHTML: '<span aria-hidden="true" class="vjs-icon-placeholder"></span><span class="vjs-control-text" aria-live="polite">Fullscreen</span> Go Live',
          role: 'button',
          'aria-live': 'polite',
          tabIndex: 0

        });

      },
      handleClick() {

        if (that.currentTrack.length > 0) {
          that.player.currentTime(moment().unix() - that.currentTrack[0].start);

        }

      }
    });

    videojs.registerComponent('skipButton', skipButton);

    this.player.getChild('controlBar').addChild('skipButton', {});
  }

  startWatching() {

    let seekTime; let seekMore;
    const that = this;
    this.currentTrack = [];

    this.getTrack();

    this.player.on('ended', function (_event) {

      that.getTrack();

    });

    this.player.on('timeupdate', function (_event) {

      if (that.currentTrack.length > 0) {

        if (moment().unix().between_equals(that.currentTrack[0].start, that.currentTrack[0].end)) {

          // Still in current media time

        } else {

          that.updateTrack();

        }

      }

    });

    this.player.on('seeking', function (event) {

      if (that.currentTrack.length > 0) {

        seekTime = this.currentTime();

        seekMore = moment().unix() - that.currentTrack[0].start;

        if (seekTime > seekMore) {

          this.currentTime(seekMore);

        }

      }

    });

    this.player.on('seeked', function (event) {

      if (that.currentTrack.length > 0) {

        seekTime = this.currentTime();

        seekMore = moment().unix() - that.currentTrack[0].start;

        if (seekTime > seekMore) {

          this.currentTime(seekMore);

        }

      }

    });

  }

  getTrack() {

    const programs = this.options.programs;

    const adverts = this.options.adverts;

    this.currentTrack = programs.filter(media => (moment().unix().between(media.start, media.end)));

    if (this.currentTrack.length > 0) {

      this.player.src(this.currentTrack[0].media);

      this.player.currentTime(moment().unix() - this.currentTrack[0].start);

      this.player.play();

    } else {

      this.player.src(adverts.media);

      this.player.play();

    }

  }

  updateTrack() {

    const programs = this.options.programs;

    const adverts = this.options.adverts;

    this.currentTrack = programs.filter(media => (moment().unix().between_equals(media.start, media.end)));

    if (this.currentTrack.length > 0) {

      this.player.src(this.currentTrack[0].media);

      this.player.currentTime(moment().unix() - this.currentTrack[0].start);

      this.player.play();

    } else {

      this.player.src(adverts.media);

      this.player.play();

    }

  }

  updateGuide(data) {

    this.options.programs = data;

    this.updateTrack();

  }

}

// Define default values for the plugin's `state` object here.
LinearTvPrototype.defaultState = {};

// Include the version number.
LinearTvPrototype.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('linearTvPrototype', LinearTvPrototype);

export default LinearTvPrototype;
