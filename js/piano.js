// I have no idea what I'm doing . gif
// Starting to figure it out though yipee

var myles = myles || {};

(function ($) {
    myles.midiToFreq = function(m){
        return Math.pow(2, ((m-69)/12))*440;
    };
    myles.piano = function (container){
        var that = {};
        that.container = $(container);
        that.svg = that.container.svg()
        that.keys = {
            white: [60,62,64,65,67,69,71],
            black: [61,63,66,68,70]
        };
        // console.log(that.keys);
        that.noteOn = function(note){
            // Flocking Related 
            var freq = myles.midiToFreq(note[0].id);
            that.synth.input("carrier.freq", freq);
            that.synth.input("asr.gate", 1.0);
            // UI related
            note.css('fill', 'yellow');
        };
        that.noteOff = function(note){
            // Flocking Related
            that.synth.input("asr.gate", 0.0);
            // UI Related
            if($.inArray(parseInt(note[0].id), that.keys.white) != -1){
                note.css('fill', 'white');
            }
            else{
                note.css('fill', 'black');
            }
        };
        that.bindEvents = function(){
            var lastPressed = {};
            that.isPressed = false;
            that.notes = that.container.find(".note");
            that.notes.each(function(i,note){
                note = $(note);
                note.hover(function(){
                    if(that.isPressed){
                        that.noteOff(lastPressed);
                        that.noteOn(note);
                        lastPressed = note;
                    }
                });
                note.mousedown(function(){
                    lastPressed = note;
                    that.isPressed = true;
                    that.noteOn(note);
                });
                note.mouseup(function(){
                    that.isPressed = false;
                    that.noteOff(note);
                });
            });
        };
        that.init = function(){
            that.synth = flock.synth({
                id: "carrier",
                ugen: "flock.ugen.sinOsc",
                freq: 440,
                mul: {
                    id: "asr",
                    ugen: "flock.ugen.env.simpleASR",
                    attack: 0.25,
                    sustain: 0.6,
                    release: 0.5
                }
            });
            that.bindEvents();
            flock.enviro.shared.play();
        };
        that.init();
        return that;
    };
})(jQuery);