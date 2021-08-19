import videojs from 'video.js';
import { version as VERSION } from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

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

        this.startWatching();

        this.renderPrograms();

    }

    startWatching() {


        var set_media, seek_time, seek_more;
        var programs = this.options.programs;
        var adverts = this.options.adverts;
        var player = this.player;

        // Get media for the current hour if it is set and also check the time in seconds
        set_media = programs.filter(programs => (moment().unix().between(programs.start, programs.end)));

        if (set_media.length > 0) {

            player.src(set_media[0].media);

            player.one("play", function(_event) {

                this.currentTime(moment().unix() - set_media[0].start);

            });

        } else {

            console.log('No video at this time add slate');

            player.src(adverts.media);

            player.play();

        }

        player.on("ended", function(_event) {

            this.currentTime(0)

            this.play();

        });

        document.getElementById("skip_current").addEventListener('click', function() {

            player.currentTime(moment().unix() - set_media[0].start);

        });

        player.on("timeupdate", function(_event) {

            if (set_media.length > 0) {

                if (moment().unix().between_equals(set_media[0].start, set_media[0].end)) {

                    // Still in current media time

                } else {

                    // Media ended switch
                    const update_media = programs.filter(programs => moment().unix().between_equals(programs.start, programs.end));

                    if (update_media.length > 0) {

                        this.src(update_media[0].media);

                        this.play();

                        set_media[0] = update_media[0];

                    } else {

                        console.log('No video at this time add slate');

                    }

                }

            } else {

                set_media = programs.filter(programs => (moment().unix().between(programs.start, programs.end)));

                if (set_media.length > 0) {

                    this.src(set_media[0].media);

                    this.play();

                } else {

                    console.log('fallback needed');

                }

            }

        });

        player.on("seeking", function(event) {

            if (set_media.length > 0) {

                seek_time = this.currentTime();

                seek_more = moment().unix() - set_media[0].start;

                if (seek_time > seek_more) {

                    this.currentTime(seek_more);

                }

            }

        });

        player.on("seeked", function(event) {

            if (set_media.length > 0) {

                seek_time = this.currentTime();

                seek_more = moment().unix() - set_media[0].start;

                if (seek_time > seek_more) {

                    this.currentTime(seek_more);

                }

            }

        });

    }

    renderPrograms() {

        var programs = this.options.programs;

        var progs = '<ul>';

        programs.forEach(function(element) {

            progs += '<li>Title: ' + element.title + ', Start: ' + moment.unix(element.start).format("MM/DD/YYYY HH:mm:ss") + ', End: ' + moment.unix(element.end).format("MM/DD/YYYY HH:mm:ss") + '</li>';

        });

        progs += '<ul>';

        document.getElementById('programmes').innerHTML = progs;

    }


}

// Define default values for the plugin's `state` object here.
LinearTvPrototype.defaultState = {};

// Include the version number.
LinearTvPrototype.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('linearTvPrototype', LinearTvPrototype);

export default LinearTvPrototype;
